import { Routes, Route } from 'react-router-dom';
import './App.css';
import LayoutPage  from './component/layout';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LayoutPage />} />
      </Routes>
    </div>
  );
}