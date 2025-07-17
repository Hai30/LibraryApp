using System;

namespace api.Models;

public class Member
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";

    public ICollection<Book> BorrowedBooks { get; set; } = new List<Book>();
}