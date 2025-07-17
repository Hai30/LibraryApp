using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Models;
using api.Data;
using System.Linq;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MembersController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/members
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> GetMembers()
        {
            var members = await _db.Members
                                   .Include(m => m.BorrowedBooks)
                                   .ToListAsync();

            return Ok(members);
        }

        // GET: api/members/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(int id)
        {
            var member = await _db.Members
                                  .Include(m => m.BorrowedBooks)
                                  .FirstOrDefaultAsync(m => m.Id == id);

            if (member == null)
                return NotFound();

            return Ok(member);
        }

        // POST: api/members
        [HttpPost]
        public async Task<ActionResult<Member>> CreateMember([FromBody] Member member)
        {
            if (member == null)
                return BadRequest("Member cannot be null.");

            _db.Members.Add(member);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMember), new { id = member.Id }, member);
        }

        // PUT: api/members/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, [FromBody] Member updatedMember)
        {
            if (id != updatedMember.Id)
                return BadRequest("ID mismatch.");

            var member = await _db.Members.FindAsync(id);
            if (member == null)
                return NotFound();

            member.Name = updatedMember.Name;
            member.Email = updatedMember.Email;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/members/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var member = await _db.Members
                                  .Include(m => m.BorrowedBooks)
                                  .FirstOrDefaultAsync(m => m.Id == id);

            if (member == null)
                return NotFound();

            if (member.BorrowedBooks.Any())
                return BadRequest("Cannot delete member who has borrowed books.");

            _db.Members.Remove(member);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/members/{memberId}/borrow/{bookId}
        [HttpPost("{memberId}/borrow/{bookId}")]
        public async Task<IActionResult> BorrowBook(int memberId, int bookId)
        {
            var member = await _db.Members
                                  .Include(m => m.BorrowedBooks)
                                  .FirstOrDefaultAsync(m => m.Id == memberId);
            if (member == null)
                return NotFound($"Member with ID {memberId} not found.");

            var book = await _db.Books.FindAsync(bookId);
            if (book == null)
                return NotFound($"Book with ID {bookId} not found.");

            // Check if book is already borrowed by any member
            var isBorrowed = await _db.Members
                                      .AnyAsync(m => m.BorrowedBooks.Any(b => b.Id == bookId));
            if (isBorrowed)
                return BadRequest("Book is already borrowed by another member.");

            member.BorrowedBooks.Add(book);
            await _db.SaveChangesAsync();

            return Ok(member);
        }

        // POST: api/members/{memberId}/return/{bookId}
        [HttpPost("{memberId}/return/{bookId}")]
        public async Task<IActionResult> ReturnBook(int memberId, int bookId)
        {
            var member = await _db.Members
                                  .Include(m => m.BorrowedBooks)
                                  .FirstOrDefaultAsync(m => m.Id == memberId);

            if (member == null)
                return NotFound($"Member with ID {memberId} not found.");

            var book = member.BorrowedBooks.FirstOrDefault(b => b.Id == bookId);
            if (book == null)
                return BadRequest("This book is not borrowed by the member.");

            member.BorrowedBooks.Remove(book);
            await _db.SaveChangesAsync();

            return Ok(member);
        }
    }
}
