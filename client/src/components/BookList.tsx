import React from 'react';
import { Book } from '../models/book';
import { fetchBooks, deleteBook } from '../api/books';

interface State {
  books: Book[];
  loading: boolean;
  error: string | null;
  deletingId: number | null;
}

class BookList extends React.Component<{}, State> {
  state: State = {
    books: [],
    loading: false,
    error: null,
    deletingId: null,
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    this.setState({ loading: true, error: null });
    fetchBooks()
      .then((books) => this.setState({ books, loading: false }))
      .catch((err) => this.setState({ error: err.message, loading: false }));
  };

  handleDelete = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    this.setState({ deletingId: id, error: null });

    deleteBook(id)
      .then(() => this.loadBooks())
      .catch((err) => {
        this.setState({ error: err.message });
      })
      .finally(() => {
        this.setState({ deletingId: null });
      });
  };

  render() {
    const { books, loading, error, deletingId } = this.state;

    if (loading) return <div className="alert alert-info">Loading books...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (books.length === 0) return <div className="alert alert-warning">No books found.</div>;

    return (
      <div>
        <h2>Books</h2>
        <ul className="list-group">
          {books.map((book) => (
            <li
              key={book.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{book.title}</strong> by {book.author} <br />
                <small>Email: {book.email}</small> <br />
                {book.isBorrowed && (
                  <span className="text-danger">
                    Borrowed by {book.borrowedByMemberName || 'Unknown'}
                  </span>
                )}
              </div>

              <div>
                <span className="badge bg-secondary me-3">{book.year}</span>

                {/* Disable delete if book is borrowed */}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => this.handleDelete(book.id)}
                  disabled={book.isBorrowed || deletingId === book.id}
                  title={
                    book.isBorrowed
                      ? 'Cannot delete a borrowed book'
                      : 'Delete this book'
                  }
                >
                  {deletingId === book.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default BookList;
