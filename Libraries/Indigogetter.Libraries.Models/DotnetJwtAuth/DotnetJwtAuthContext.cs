using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Indigogetter.Libraries.Models.DotnetJwtAuth
{
    public class DotnetJwtAuthContext : DbContext
    {
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<Project> Project { get; set; }

        public DotnetJwtAuthContext() { }

        public DotnetJwtAuthContext(DbContextOptions<DotnetJwtAuthContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<Project>(entity =>
            {
                entity.ToTable("project", "dotnetjwtauth");

                entity.HasIndex(e => e.UserId)
                    .HasName("FK_UserId");

                entity.Property(e => e.ProjectId).HasColumnType("bigint(20)");

                entity.Property(e => e.Content).HasColumnType("longtext");

                entity.Property(e => e.IsDeleted)
                    .HasColumnType("tinyint(4)")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.ProjectCreatedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.ProjectModifiedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UserId).HasColumnType("bigint(20)");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Project)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("project_ibfk_1");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user", "dotnetjwtauth");

                entity.Property(e => e.UserId).HasColumnType("bigint(20)");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(320)
                    .IsUnicode(false);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IsDeleted)
                    .HasColumnType("tinyint(4)")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.IsLocked)
                    .HasColumnType("tinyint(4)")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.PasswordHash)
                    .IsRequired()
                    .HasColumnType("binary(64)");

                entity.Property(e => e.PasswordSalt)
                    .IsRequired()
                    .HasColumnType("binary(64)");

                entity.Property(e => e.UserCreatedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UserModifiedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });
        }
    }
}
