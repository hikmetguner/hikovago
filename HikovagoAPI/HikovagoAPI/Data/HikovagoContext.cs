using HikovagoAPI.Configurations;
using HikovagoAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HikovagoAPI.Data
{
    public class HikovagoContext: IdentityDbContext<User>
    {
        public HikovagoContext(DbContextOptions options): base(options)
        {
        }

        public DbSet<Country> Countries { get; set; } = null!;
        public DbSet<City> Cities { get; set; } = null!;
        public DbSet<County> Counties { get; set; } = null!;
        public DbSet<Hotel> Hotels { get; set; } = null!;
        public DbSet<Room> Rooms { get; set; } = null!;

        public DbSet<Comment> Comments { get; set; } = null!;
        public DbSet<Media> Medias { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new RoleConfiguration());

            modelBuilder.Entity<User>(e =>
            {
                e.HasMany(e => e.Hotels)
                .WithOne(e => e.Owner)
                .HasForeignKey(e => e.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Country>(e =>
            {
                e.HasKey(e => e.Id);
                e.HasMany(e => e.Cities)
                .WithOne(e => e.Country)
                .HasForeignKey(e => e.CountryId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

                e.HasMany(e => e.Hotels)
                .WithOne(h=>h.Country)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
            });
                

            modelBuilder.Entity<City>(e =>
            {
                e.HasKey(e => e.Id);
                e.HasMany(e => e.Counties)
                .WithOne(c => c.City)
                .HasForeignKey(e => e.CityId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

                e.HasMany(e => e.Hotels)
                .WithOne(h => h.City)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<County>(e =>
            {
                e.HasKey(e => e.Id);

                e.HasMany(e => e.Hotels)
                .WithOne(h => h.County)
                .HasForeignKey(e => e.CountyId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Media>(e =>
            {
                e.HasKey(e => e.Id);

                e.HasMany(e => e.Hotels)
                .WithMany(e => e.Medias)
                .UsingEntity(j => j.ToTable("HotelMedias"));

                e.HasMany(e => e.Rooms)
                .WithMany(e => e.Medias)
                .UsingEntity(j => j.ToTable("RoomMedias"));

                e.HasOne(e => e.User)
                .WithOne(e => e.Media)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(e => e.Attribute)
                .WithOne(e => e.Icon)
                .OnDelete(DeleteBehavior.Cascade);

            });

            modelBuilder.Entity<Comment>(e =>
            {
                e.HasKey(e => e.Id);

                e.HasOne(e => e.User)
                .WithMany(e => e.Comments)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(e => e.Hotel)
                .WithMany( e=> e.Comments)
                .HasForeignKey(e => e.HotelId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Models.Attribute>(e =>
            {
                e.HasKey(e => e.Id);

                e.HasMany(e => e.Hotels)
                .WithMany(e => e.Attributes)
                .UsingEntity(j => j.ToTable("HotelAttributes"));

                e.HasMany(e => e.Rooms)
                .WithMany(e => e.Attributes)
                .UsingEntity(j => j.ToTable("RoomAttributes"));
            });

            modelBuilder.Entity<Room>(e =>
            {
                e.HasKey(e => e.Id);
            });

            modelBuilder.Entity<Hotel>(e =>
            {                
                e.HasMany(e => e.Rooms)
                .WithOne(e => e.Hotel)
                .HasForeignKey(e => e.HotelId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
