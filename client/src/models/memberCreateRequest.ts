export interface MemberCreateRequest {
  name: string;
  email: string;
  borrowedBookId?: number;  // Optional single book ID when creating/updating
}   