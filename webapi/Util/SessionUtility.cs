using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

public static class SessionExtensions
{
    public static void SetBool(this ISession Session, string key, bool value)
    {
        Session.SetInt32(key, value ? 1 : 0);
    }

    public static bool GetBool(this ISession Session, string key)
    {
        return Session.GetInt32(key) > 0 ? true : false;
    }
}