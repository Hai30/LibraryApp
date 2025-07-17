export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  email: string;
  borrowedByMemberId?: number | null;
  borrowedByMemberName?: string | null;
  isBorrowed: boolean; // Add this field from BookDto
}


export interface NewBook {
  title: string;
  author: string;
  email: string;
  year: number;
}
