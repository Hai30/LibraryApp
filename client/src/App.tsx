import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import MemberList from './components/MemberList';
import MemberForm from './components/MemberForm';

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <header className="text-center mb-5">
          <h1 className="display-4">📚 Library App</h1>
          <p className="lead">Manage your library and members with ease</p>
          <nav className="d-flex justify-content-center flex-wrap gap-2">
            <Link to="/" className="btn btn-outline-primary">Book List</Link>
            <Link to="/add-book" className="btn btn-primary">Add Book</Link>
            <Link to="/members" className="btn btn-outline-secondary">Member List</Link>
            <Link to="/add-member" className="btn btn-success">Add Member</Link>
          </nav>
        </header>

        <Routes>
          {/* Book routes */}
          <Route path="/" element={<BookList />} />
          <Route path="/add-book" element={<BookForm />} />

          {/* Member routes */}
          <Route path="/members" element={<MemberList />} />
          <Route path="/add-member" element={<MemberForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
