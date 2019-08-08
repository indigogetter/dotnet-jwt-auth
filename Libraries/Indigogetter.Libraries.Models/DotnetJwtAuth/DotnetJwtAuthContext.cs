using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Indigogetter.Libraries.Models.DotnetJwtAuth
{
    public class DotnetJwtAuthContext : DbContext
    {
        public virtual DbSet<Project> Project { get; set; }
        public virtual DbSet<RefreshToken> RefreshToken { get; set; }
        public virtual DbSet<User> User { get; set; }

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
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'");

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

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.ToTable("refreshtoken", "dotnetjwtauth");

                entity.HasIndex(e => e.UserId)
                    .HasName("FK_RefreshToken_UserId");

                entity.Property(e => e.RefreshTokenId).HasColumnType("bigint(20)");

                entity.Property(e => e.EncryptionKey)
                    .IsRequired()
                    .HasColumnType("binary(16)");

                entity.Property(e => e.InitialVector)
                    .IsRequired()
                    .HasColumnType("binary(16)");

                entity.Property(e => e.IsRevoked)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'");

                entity.Property(e => e.RefreshTokenCreatedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.RefreshTokenModifiedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UserId).HasColumnType("bigint(20)");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.RefreshToken)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("refreshtoken_ibfk_1");
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
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'");

                entity.Property(e => e.IsLocked)
                    .HasColumnType("bit(1)")
                    .HasDefaultValueSql("b'0'");

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
