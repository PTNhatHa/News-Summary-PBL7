import './App.css';
import Home from './pages/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import MainLayout from './pages/MainLayout';
import SearchPage from './pages/SearchPage';
import { CategoryProvider } from './context/CategoryContext ';
import VNExpressPage from './pages/VNExpressPage';
import TuoiTrePage from './pages/TuoiTrePage';
import DaNangPage from './pages/DaNangPage';
import { DateProvider } from './context/DateContext';

function App() {
  return (
    <CategoryProvider>
      <DateProvider>
        <Router>
          <Routes>
            {/* Layout bọc tất cả */}
            <Route path='/' element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path='vnexpress' element={<VNExpressPage />} />
              <Route path='tuoitre' element={<TuoiTrePage />} />
              <Route path='danang' element={<DaNangPage />} />
              <Route path='search' element={<SearchPage />} />
            </Route>
          </Routes>
        </Router>
      </DateProvider>
    </CategoryProvider>
  );
}

export default App;
