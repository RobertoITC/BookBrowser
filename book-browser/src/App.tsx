
import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import BookDetails from './pages/BookDetails';
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <main className="pt-16">

            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/book/:id" element={<BookDetails />} />

            </Routes>
            </main>

        </BrowserRouter>
    );
}
export default App
