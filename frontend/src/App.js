import './App.css';
import Home from './pages/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import MainLayout from './pages/MainLayout';
import NewsPage from './pages/NewsPage';
import SearchPage from './pages/SearchPage';
import { CategoryProvider } from './context/CategoryContext ';

function App() {
  return (
    <CategoryProvider>
      <Router>
        <Routes>
          {/* Layout bọc tất cả */}
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='vnexpress' element={<NewsPage source="vnexpress" />} />
            <Route path='tuoitre' element={<NewsPage source="tuoitre" />} />
            <Route path='danang' element={<NewsPage source="danang" />} />
            <Route path='search' element={<SearchPage />} />
          </Route>
        </Routes>
      </Router>
    </CategoryProvider>
  );
}

export default App;
