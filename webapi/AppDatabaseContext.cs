using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using webapi;

public class AppDatabaseContext : DbContext
{
    public DbSet<ImageDataset> Datasets { get; set; }
    public DbSet<PermanentUser> PermanentUsers { get; set; }
    public DbSet<GuestUser> GuestUsers { get; set; }
    public DbSet<RankingChoice> RankingChoices { get; set; }


    public string DbPath { get; }

    public AppDatabaseContext()
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = System.IO.Path.Join(path, "ImageRankingWebApp/database.db");
    }

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}