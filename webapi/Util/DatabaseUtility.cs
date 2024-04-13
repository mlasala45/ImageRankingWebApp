using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

public static class DatabaseUtility
{
    /// <summary>
    /// Sets the Auto Checkpoint limit to 1, meaning that the database is updated after each individual transaction, instead of the default 1000.
    /// </summary>
    /// <param name="context"></param>
    public static void GuaranteeWALAutoCheckpoint(DbContext context)
    {
        //ExecuteDbCommand(context, "PRAGMA wal_autocheckpoint=1;");
    }

    public static void ForceWALCheckpoint(DbContext context)
    {
        //ExecuteDbCommand(context, "PRAGMA wal_checkpoint(FULL);");
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

    public static IEnumerable<T> FindPredicate<T>(this DbSet<T> dbSet, Expression<Func<T, bool>> predicate) where T : class
    {
        var local = dbSet.Local.Where(predicate.Compile());
        return local.Any()
            ? local
            : dbSet.Where(predicate).ToArray();
    }

    public static async Task<IEnumerable<T>> FindPredicateAsync<T>(this DbSet<T> dbSet, Expression<Func<T, bool>> predicate) where T : class
    {
        var local = dbSet.Local.Where(predicate.Compile());
        return local.Any()
            ? local
            : await dbSet.Where(predicate).ToArrayAsync().ConfigureAwait(false);
    }
}