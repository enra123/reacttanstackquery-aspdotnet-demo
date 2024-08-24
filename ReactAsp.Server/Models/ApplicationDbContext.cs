using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace reactdotnet.Server.Models
{
    public class ApplicationDbContext : IdentityDbContext<Users>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Handling custom field 'Permissions' for DB of Users
            modelBuilder
                .Entity<Users>()
                .Property(e => e.Permissions)
                .HasDefaultValueSql("'view'")
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
                        new ValueComparer<List<string>>(
                            (c1, c2) => c1.SequenceEqual(c2),
                            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                            c => c.ToList())
                 );
        }
    }
}
