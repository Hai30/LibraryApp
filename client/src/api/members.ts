import { CreateMember, Member } from '../models/member';

const API_BASE = 'https://localhost:5001/api/members';

// Helper to recursively unwrap JSON.NET $values arrays
function unwrapValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(unwrapValues);
  } else if (obj && typeof obj === 'object') {
    if ('$values' in obj) {
      return unwrapValues(obj.$values);
    }
    // unwrap nested borrowedBooks if present
    if ('borrowedBooks' in obj) {
      return {
        ...obj,
        borrowedBooks: unwrapValues(obj.borrowedBooks),
      };
    }
    // unwrap other nested objects recursively
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = unwrapValues(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// Fetch all members with proper unwrapping of JSON.NET preserved references
export async function fetchMembers(): Promise<Member[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch members: ${errorText}`);
  }
  const data = await response.json();
  return unwrapValues(data);
}

// Create a new member
export async function createMember(member: {
  name: string;
  email: string;
  borrowedBooks?: { id: number }[];
}): Promise<Member> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create member: ${errorText}`);
  }

  return response.json();
}

// Borrow a book
export async function borrowBook(memberId: number, bookId: number): Promise<Member> {
  const response = await fetch(`${API_BASE}/${memberId}/borrow/${bookId}`, { method: 'POST' });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to borrow book');
  }
  return response.json();
}

// Return a book
export async function returnBook(memberId: number, bookId: number): Promise<Member> {
  const response = await fetch(`${API_BASE}/${memberId}/return/${bookId}`, { method: 'POST' });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to return book');
  }
  return response.json();
}

// Delete member (optional)
export async function deleteMember(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to delete member');
  }
}
