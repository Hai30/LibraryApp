import React, { useEffect, useState } from 'react';
import { Member } from '../models/member';
import { fetchMembers, deleteMember, createMember, borrowBook, returnBook } from '../api/members';

function MemberList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    setLoading(true);
    fetchMembers()
      .then(data => setMembers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await deleteMember(id);
      loadMembers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const memberData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };

    try {
      if (selectedMember) {
        // Update logic
        await fetch(`https://localhost:5001/api/members/${selectedMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...selectedMember, ...memberData }),
        });
      } else {
        // Create logic
        await createMember(memberData);
      }
      setSelectedMember(null);
      form.reset();
      loadMembers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Members</h2>

      <form onSubmit={handleFormSubmit} className="mb-4">
        <h4>{selectedMember ? 'Edit Member' : 'Add New Member'}</h4>
        <input
          name="name"
          placeholder="Name"
          defaultValue={selectedMember?.name || ''}
          required
          className="form-control mb-2"
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          defaultValue={selectedMember?.email || ''}
          required
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">
          {selectedMember ? 'Update' : 'Add'}
        </button>
        {selectedMember && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setSelectedMember(null)}
          >
            Cancel
          </button>
        )}
      </form>

      {loading && <div className="alert alert-info">Loading members...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && members.length === 0 && <div className="alert alert-warning">No members found.</div>}

      <ul className="list-group">
        {members.map(member => (
          <li key={member.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{member.name}</strong> - {member.email}
                {member.borrowedBooks && member.borrowedBooks.length > 0 ? (
                  <ul className="mt-2">
                    {member.borrowedBooks.map(book => (
                      <li key={book.id}>
                        📚 <strong>{book.title}</strong> by {book.author} ({book.year})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div><em>No borrowed books</em></div>
                )}
              </div>
              <div>
                <button onClick={() => handleEdit(member)} className="btn btn-sm btn-warning me-2">Edit</button>
                <button onClick={() => handleDelete(member.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemberList;
