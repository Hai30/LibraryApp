import React, { useState } from 'react';
import { NewBook } from '../models/book';  // or Book if id is optional
import { addBook } from '../api/books';
import { useNavigate } from 'react-router-dom';

function BookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !author || !year || !email) {
      setError('Please fill all fields.');
      return;
    }

    if (!/^\d{4}$/.test(year)) {
      setError('Year must be a 4-digit number.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
      return;
    }

    const newBook: NewBook = {
      title,
      author,
      year: Number(year),
      email,
    };

    try {
      await addBook(newBook);
      navigate('/books');
    } catch (err: any) {
      setError(err.message || 'Failed to add book');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Add Book</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input id="title" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label htmlFor="author" className="form-label">Author</label>
        <input id="author" className="form-control" value={author} onChange={e => setAuthor(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label htmlFor="year" className="form-label">Year</label>
        <input id="year" className="form-control" maxLength={4} value={year} onChange={e => setYear(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input id="email" type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>

      <button type="submit" className="btn btn-primary">Add Book</button>
    </form>
  );
}

export default BookForm;
