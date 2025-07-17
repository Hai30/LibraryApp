import { Book } from './book';

export interface Member {
  id: number;
  name: string;
  email: string;
  borrowedBooks: Book[];  // Array of borrowed books (full objects)
}

export interface CreateMember {
  name: string;
  email: string;
  borrowedBookId?: number; // optional
}
