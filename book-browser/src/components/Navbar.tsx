// src/components/Navbar/Navbar.tsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileMenu from '../components/ProfileMenu';
import {LogoutButton} from '../components/LogoutButton';
import {LoginButton} from '../components/LoginButton';
import '../index.css';

const Navbar: React.FC = () => {
    // 👇 This hook call MUST be *inside* the FC body
    const { user } = useContext(AuthContext);

    return (
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between bg-pink-500 p-4 z-50">
            <Link to="/" className="text-xl font-bold text-white">
                Book Browser
            </Link>
            <ul className="flex space-x-6 items-center">
                <li><Link to="/" className="text-white hover:underline">Home</Link></li>
                <li><Link to="/search" className="text-white hover:underline">Search</Link></li>
                {user ? (
                    <>
                        <li><Link to="/dashboard" className="text-white hover:underline">Dashboard</Link></li>
                        <li><ProfileMenu /></li>
                    </>
                ) : (
                    <>
                        <div>

                            {user ? (
                                <LogoutButton />
                            ) : (
                                <LoginButton />
                            )}
                        </div>
                    </>
                )}

            </ul>
            <LogoutButton.Confirmation />
        </nav>
    );
};

export default Navbar;