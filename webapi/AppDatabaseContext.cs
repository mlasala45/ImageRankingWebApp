using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using webapi;

public class AppDatabaseContext : DbContext
{
    public DbSet<ImageDataset> Datasets { get; set; }
    public DbSet<PermanentUser> PermanentUsers { get; set; }
    public DbSet<GuestUser> GuestUsers { get; set; }
    public DbSet<RankingChoice> RankingChoices { get; set; }

    const bool EDITING_MIGRATIONS = true;
    static string DbHost = EDITING_MIGRATIONS ? "localhost:5432" : "db";
    static string DbDatabase = "imagerankingwebapp";
    static string DbUsername = "backend";
    static string DbPass = "backend_password"; //Laughably insecure?

    public AppDatabaseContext()
    {
        if(!Database.CanConnect())
        {
            throw new Exception("Database Service not available.");
        }
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseNpgsql($"Host={DbHost};Database={DbDatabase};Username={DbUsername};Password={DbPass}");
}