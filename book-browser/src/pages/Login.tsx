// src/pages/Login/Login.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
    const { login } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app you’d verify credentials here.
        // For now we just call login with a minimal User object.
        login({ id: email, name, email, avatarUrl: undefined, favorites: [] });
        navigate('/'); // send them back to Home (or Dashboard)
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800 p-4">
            <form
                className="bg-white p-6 rounded-md shadow-md w-full max-w-sm space-y-4"
                onSubmit={handleSubmit}
            >
                <h2 className="text-xl font-semibold text-center text-gray-900">
                    Log In
                </h2>

                <label className="block text-gray-700">
                    Name
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 mt-1"
                    />
                </label>

                <label className="block text-gray-700">
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 mt-1"
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600"
                >
                    Log In
                </button>
            </form>
        </div>
    );
};

export default Login;