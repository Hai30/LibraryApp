using FluentValidation;
using api.Models;

namespace api.Validators
{
    public class BookValidator : AbstractValidator<Book>
    {
        public BookValidator()
        {
            RuleFor(b => b.Title)
                .NotEmpty().WithMessage("Title is required.");

            RuleFor(b => b.Author)
                .NotEmpty().WithMessage("Author is required.");

            RuleFor(b => b.Year)
                .InclusiveBetween(1000, DateTime.Now.Year)
                .WithMessage("Year must be a valid 4-digit number.");

            RuleFor(b => b.Email)
                .EmailAddress().WithMessage("Invalid email format.");
        }
    }
}
