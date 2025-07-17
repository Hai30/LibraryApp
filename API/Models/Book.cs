namespace api.Models
{
public class Book
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public int Year { get; set; }

    public int? BorrowedByMemberId { get; set; }

    public Member? BorrowedByMember { get; set; }
}

}
