using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using webapi;

public class AppDatabaseContext : DbContext
{
    public DbSet<PermanentUser> PermanentUsers { get; set; }
    public DbSet<GuestUser> GuestUsers { get; set; }


    public DbSet<ImageDataset> Datasets { get; set; }
    public DbSet<OnlineDatasetImageStore> OnlineDatasetImageStores { get; set; }
    public DbSet<RankingChoice> RankingChoices { get; set; }

    const bool RUNNING_IN_CONTAINER = false;
    static string DbHost = RUNNING_IN_CONTAINER ? "db" : "localhost:5432";
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