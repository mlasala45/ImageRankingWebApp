﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace webapi.Migrations
{
    [DbContext(typeof(AppDatabaseContext))]
    partial class AppDatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.3");

            modelBuilder.Entity("webapi.UserDataset", b =>
                {
                    b.Property<int>("UID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ImageNames")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UID");

                    b.ToTable("Datasets");
                });
#pragma warning restore 612, 618
        }
    }
}
