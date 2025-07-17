import React, { useState, useEffect } from 'react';
import { Book } from '../models/book';
import { createMember } from '../api/members';  // <-- changed here
import { fetchBooks } from '../api/books';
import { useNavigate } from 'react-router-dom';
import { CreateMember } from '../models/member';

function MemberForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<number | undefined>(undefined);
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch(err => setError(err.message));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email) {
      setError('Please fill all required fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
      return;
    }


    const newMember: CreateMember = {
      name,
      email,
      borrowedBookId: selectedBookId,
    };
    await createMember(newMember);


    try {
      await createMember(newMember);  // <-- changed here
      navigate('/members');
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Add Member</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          id="name"
          className="form-control"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="borrowedBook" className="form-label">Borrowed Book (optional)</label>
        <select
          id="borrowedBook"
          className="form-select"
          value={selectedBookId ?? ''}
          onChange={e => {
            const val = e.target.value;
            setSelectedBookId(val ? Number(val) : undefined);
          }}
        >
          <option value="">-- None --</option>
          {books.map(book => (
            <option key={book.id} value={book.id}>
              {book.title} by {book.author}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">Add Member</button>
    </form>
  );
}

export default MemberForm;
