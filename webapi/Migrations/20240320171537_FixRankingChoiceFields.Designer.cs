﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace webapi.Migrations
{
    [DbContext(typeof(AppDatabaseContext))]
    [Migration("20240320171537_FixRankingChoiceFields")]
    partial class FixRankingChoiceFields
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.3");

            modelBuilder.Entity("ImageDataset", b =>
                {
                    b.Property<int>("UID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AuthorUID")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ImageNames")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsAuthorGuest")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("TimeCreated")
                        .HasColumnType("TEXT");

                    b.HasKey("UID");

                    b.ToTable("Datasets");
                });

            modelBuilder.Entity("RankingChoice", b =>
                {
                    b.Property<string>("UID")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("TimeStamp")
                        .HasColumnType("TEXT");

                    b.Property<int>("choice")
                        .HasColumnType("INTEGER");

                    b.Property<int>("datasetKey")
                        .HasColumnType("INTEGER");

                    b.Property<int>("promptLeftIndex")
                        .HasColumnType("INTEGER");

                    b.Property<int>("promptRightIndex")
                        .HasColumnType("INTEGER");

                    b.Property<string>("user")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UID");

                    b.ToTable("RankingChoices");
                });

            modelBuilder.Entity("webapi.GuestUser", b =>
                {
                    b.Property<string>("UID")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("LastDateModified")
                        .HasColumnType("TEXT");

                    b.Property<string>("OwnedDatasets")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UID");

                    b.ToTable("GuestUsers");
                });

            modelBuilder.Entity("webapi.PermanentUser", b =>
                {
                    b.Property<int>("UID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UID");

                    b.ToTable("PermanentUsers");
                });
#pragma warning restore 612, 618
        }
    }
}