import { Book, NewBook } from '../models/book';

const API_BASE = 'https://localhost:5001/api/books';

export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch books');
  }

  const data = await response.json();
  console.log(data);

  // Handle ReferenceHandler.Preserve format (if used)
  if (data && data.$values) {
    return data.$values;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}

export async function addBook(book: NewBook): Promise<Book> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to add book');
  }

  return response.json();
}

export async function deleteBook(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to delete book');
  }
}
