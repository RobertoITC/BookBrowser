// src/components/ProfileMenu/ProfileMenu.tsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../index.css';

const ProfileMenu: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    if (!user) return null;

return (
    <div className="relative" ref={ref}>
        <button
            className="ring-white ring-1 focus:ring-3 focus:white rounded-full p-2"
            onClick={() => setOpen(o => !o)}
        >
            {user.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover"/>
                : <span className="w-8 h-8 flex items-center justify-center bg-pink-500 text-white rounded-full font-semibold">{user.name.charAt(0)}</span>
            }
        </button>

        {open && (
            <ul className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-20">
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <Link to="/profile" className="w-full text-left">My Profile</Link>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <Link to="/dashboard" className="w-full text-left">Dashboard</Link>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={logout}>
                    <button type="button" className="w-full text-left">Log Out</button>
                </li>
            </ul>
        )}
    </div>
);
};

export default ProfileMenu;