using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

public static class DatabaseUtility
{
    /// <summary>
    /// Sets the Auto Checkpoint limit to 1, meaning that the database is updated after each individual transaction, instead of the default 1000.
    /// </summary>
    /// <param name="context"></param>
    public static void GuaranteeWALAutoCheckpoint(DbContext context)
    {
        ExecuteDbCommand(context, "PRAGMA wal_autocheckpoint=1;");
    }

    public static void ForceWALCheckpoint(DbContext context)
    {
        ExecuteDbCommand(context, "PRAGMA wal_checkpoint(FULL);");
    }

    private static void ExecuteDbCommand(DbContext context, string commandText)
    {
        var connection = context.Database.GetDbConnection();
        connection.Open();
        using (var command = connection.CreateCommand())
        {
            command.CommandText = commandText;
            command.ExecuteNonQuery();
        }
    }
}