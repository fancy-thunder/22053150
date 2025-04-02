import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import UsersPage from './components/UsersPage';
import TrendingPage from './components/TrendingPage';
import FeedPage from './components/FeedPage';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-vh-100">
          {}
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/users" className="nav-link">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/trending" className="nav-link">
                    Trending Posts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/feed" className="nav-link">
                    Feed
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {}
          <Routes>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/" element={<FeedPage />} /> {}
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
