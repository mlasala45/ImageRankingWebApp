using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using System.Numerics;
using System.Security.Cryptography;
using System.Text;
using System.Xml.Linq;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;

    public UsersController(ILogger<UsersController> logger)
    {
        _logger = logger;
    }

    string GenerateHash(string hashInput, int saltModifier)
    {
        hashInput = hashInput + saltModifier;
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(hashInput));

            // Convert the byte array to a hexadecimal string
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < hashedBytes.Length; i++)
            {
                builder.Append(hashedBytes[i].ToString("x2"));
            }

            return builder.ToString();
        }
    }

    [HttpGet("RequestGuestId")]
    public IActionResult RequestGuestId()
    {
        string hashInput = $"{HttpContext.Session}";
        string hash;

        using (var context = new AppDatabaseContext())
        {
            GuestUser user = new();
            user.LastDateModified = DateTime.UtcNow;
            int i = 0;
            int sentinel = 0;
            do
            {
                if (sentinel > 100)
                {
                    Console.WriteLine("ERROR: Infinite loop encountered in Guest ID Generation. Aborted.");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create unique guest ID.");
                }

                hash = GenerateHash(hashInput, i++);
                sentinel++;
            } while (context.GuestUsers.Count((GuestUser a) => a.UID == hash) > 0);

            user.UID = hash;
            Console.WriteLine($"Generated new guest ID for session [{HttpContext.Session}]. Guest ID: {hash}");
            context.GuestUsers.Add(user);

            context.SaveChanges();
            DatabaseUtility.ForceWALCheckpoint(context);

            HttpContext.Session.SetString("UserId", hash);
            HttpContext.Session.SetBool("IsUserGuest", true);
            return new JsonResult(new { guestId = hash });
        }
    }

    [HttpGet("ValidateGuestId")]
    public IActionResult ValidateGuestId(string guestId)
    {
        using (var context = new AppDatabaseContext())
        {
            if (context.GuestUsers.Count((GuestUser a) => a.UID == guestId) > 0)
            {
                HttpContext.Session.SetString("UserId", guestId);
                HttpContext.Session.SetBool("IsUserGuest", true);
                return new OkResult();
            }
            else
            {
                return new NotFoundResult();
            }
        }
    }

    private async Task<string> RequestGoogleAccessToken(string authCode)
    {
        string clientId = "XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com";
        string clientSecret = "XXXXXX-XXXXXXXXXX_XXXXXXX-X_XXXXXXX";
        string redirectUri = "https://localhost:5173";

        var parameters = new Dictionary<string, string>
                {
                    { "code", authCode },
                    { "client_id", clientId },
                    { "client_secret", clientSecret },
                    { "redirect_uri", redirectUri },
                    { "grant_type", "authorization_code" }
                };

        var content = new FormUrlEncodedContent(parameters);

        var request = new HttpRequestMessage(HttpMethod.Post, "https://oauth2.googleapis.com/token")
        {
            Content = content
        };
        
        using (var client = new HttpClient())
        {
            var response = await client.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();
            var jsonBody = JObject.Parse(body);
            return jsonBody["access_token"].Value<string>();
        }
    }

    private async Task<UserDetails> RequestGoogleUserDetails(string accessToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/oauth2/v3/userinfo");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        using (var client = new HttpClient())
        {
            var response = await client.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<UserDetails>(body);
        }
    }

    [HttpPost("ProcessGoogleClientAuthCode")]
    public async Task<IActionResult> ProcessGoogleClientAuthCode([FromBody] RequestBody_ProcessGoogleClientAuthCode body)
    {
        var accessToken = await RequestGoogleAccessToken(body.Code);
        var details = await RequestGoogleUserDetails(accessToken);
        
        return new OkResult();
    }

    public class RequestBody_ProcessGoogleClientAuthCode
    {
        public string Code { get; set; }
    }

    public class UserDetails
    {
        public string Sub { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}