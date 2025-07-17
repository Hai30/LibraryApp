using api.Data;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _db;

        public BooksController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            var books = await _db.Books
                                 .Include(b => b.BorrowedByMember)
                                 .ToListAsync();

            var result = books.Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                Email = b.Email,
                Year = b.Year,
                BorrowedByMemberId = b.BorrowedByMemberId,
                BorrowedByMemberName = b.BorrowedByMember?.Name
            });

            return Ok(result);
        }

        // GET: api/books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _db.Books
                                .Include(b => b.BorrowedByMember)
                                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null) return NotFound();

            var dto = new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                Email = book.Email,
                Year = book.Year,
                BorrowedByMemberId = book.BorrowedByMemberId,
                BorrowedByMemberName = book.BorrowedByMember?.Name
            };

            return Ok(dto);
        }

        // POST: api/books
        [HttpPost]
        public async Task<ActionResult<Book>> CreateBook(Book book)
        {
            _db.Books.Add(book);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

        // PUT: api/books/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, Book book)
        {
            if (id != book.Id)
                return BadRequest();

            _db.Entry(book).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _db.Books.FindAsync(id);
            if (book == null) return NotFound();

            if (book.BorrowedByMemberId != null)
                return BadRequest("Cannot delete a book that is currently borrowed.");

            _db.Books.Remove(book);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/books/{bookId}/borrow/{memberId}
        [HttpPost("{bookId}/borrow/{memberId}")]
        public async Task<IActionResult> BorrowBook(int bookId, int memberId)
        {
            var book = await _db.Books.FindAsync(bookId);
            var member = await _db.Members.FindAsync(memberId);

            if (book == null || member == null)
                return NotFound();

            if (book.BorrowedByMemberId != null)
                return BadRequest("Book is already borrowed.");

            book.BorrowedByMemberId = memberId;
            await _db.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/books/{bookId}/return
        [HttpPost("{bookId}/return")]
        public async Task<IActionResult> ReturnBook(int bookId)
        {
            var book = await _db.Books.FindAsync(bookId);
            if (book == null) return NotFound();

            book.BorrowedByMemberId = null;
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
