using api.Models;
using System;
using System.Linq;

namespace api.Data
{
    public static class MockDatabase
    {
        public static void Seed(AppDbContext context)
        {
            if (!context.Members.Any())
            {
                var members = new[]
                {
                    new Member {
                        Id = 1,
                        Name = "Alice Johnson",
                        Email = "alice@example.com"
                    },
                    new Member {
                        Id = 2,
                        Name = "Bob Smith",
                        Email = "bob@example.com"
                    },
                    new Member {
                        Id = 3,
                        Name = "Charlie Davis",
                        Email = "charlie@example.com"
                    }
                };

                context.Members.AddRange(members);
                context.SaveChanges();
            }

            if (!context.Books.Any())
            {
                var books = new[]
                {
                    new Book {
                        Id = 1,
                        Title = "Clean Code",
                        Author = "Robert C. Martin",
                        Year = 2008,
                        Email = "clean.code@example.com",
                        BorrowedByMemberId = 1 // borrowed by Alice
                    },
                    new Book {
                        Id = 2,
                        Title = "The Pragmatic Programmer",
                        Author = "Andrew Hunt and David Thomas",
                        Year = 1999,
                        Email = "pragmatic@example.com",
                        BorrowedByMemberId = 2 // borrowed by Bob
                    },
                    new Book {
                        Id = 3,
                        Title = "Domain-Driven Design",
                        Author = "Eric Evans",
                        Year = 2003,
                        Email = "ddd@example.com",
                        BorrowedByMemberId = null // currently not borrowed
                    }
                };

                context.Books.AddRange(books);
                context.SaveChanges();
            }

            // Optionally, update navigation properties to keep them consistent
            var membersWithBooks = context.Members.ToList();
            var booksList = context.Books.ToList();

            foreach (var member in membersWithBooks)
            {
                member.BorrowedBooks.Clear();
                var borrowedBooks = booksList.Where(b => b.BorrowedByMemberId == member.Id).ToList();
                foreach (var book in borrowedBooks)
                {
                    member.BorrowedBooks.Add(book);
                }
            }

            context.SaveChanges();
        }
    }
}
