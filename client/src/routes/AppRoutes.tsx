import { Routes, Route } from 'react-router-dom';
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<BookList />} />
    <Route path="/add" element={<BookForm />} />
  </Routes>
);

export default AppRoutes;
