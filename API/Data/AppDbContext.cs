using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Book> Books { get; set; }
        public DbSet<Member> Members { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the one-to-many relationship between Member and Book
            modelBuilder.Entity<Book>()
                .HasOne(b => b.BorrowedByMember)
                .WithMany(m => m.BorrowedBooks)
                .HasForeignKey(b => b.BorrowedByMemberId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
