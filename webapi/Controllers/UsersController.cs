using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
            user.LastDateModified = DateTime.Now;
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
            if(context.GuestUsers.Count((GuestUser a) => a.UID == guestId) > 0)
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
}