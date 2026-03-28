import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Landing from './pages/Landing';
import Scan from './pages/Scan';
import Report from './pages/Report';
import Recommendation from './pages/Recommendation';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-surface font-body text-on-surface">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/report" element={<Report />} />
            <Route path="/recommendation" element={<Recommendation />} />
          </Routes>
        </div>
        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
}
