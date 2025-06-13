import { useState } from 'react';
                import { signInWithGoogle, signInWithEmail, registerWithEmail } from '../services/authService.ts';

                export const LoginModal = ({ onClose }: { onClose: () => void }) => {
                    const [email, setEmail] = useState('');
                    const [password, setPassword] = useState('');
                    const [displayName, setDisplayName] = useState('');
                    const [isRegistering, setIsRegistering] = useState(false);
                    const [error, setError] = useState('');

                    const handleEmailLogin = async (e: React.FormEvent) => {
                        e.preventDefault();
                        try {
                            await signInWithEmail(email, password);
                            onClose();
                        } catch {
                            setError('Invalid email or password');
                        }
                    };

                    const handleRegister = async (e: React.FormEvent) => {
                        e.preventDefault();
                        if (password.length < 6) {
                            setError('Password must be at least 6 characters');
                            return;
                        }
                        try {
                            await registerWithEmail(email, password, displayName);
                            onClose();
                        } catch {
                            // show the log error message
                            console.error('Registration error:', error);

                            setError('Registration failed. Email might be in use.');
                        }
                    };

                    const handleGoogleLogin = async () => {
                        try {
                            await signInWithGoogle();
                            onClose();
                        } catch {
                            console.error('Registration error:', error);

                            setError('Registration failed. Email might be in use.');
                            setError('Google sign-in failed');
                        }
                    };

                    return (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
                            <div
                                className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {isRegistering ? 'Register' : 'Login'}
                                    </h2>
                                    <button
                                        className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                                        onClick={onClose}
                                        aria-label="Close"
                                    >
                                        &times;
                                    </button>
                                </div>
                                {error && (
                                    <div className="mb-4 text-red-600 bg-red-100 rounded px-3 py-2 text-sm">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={isRegistering ? handleRegister : handleEmailLogin} className="space-y-4">
                                    {isRegistering && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition"
                                    >
                                        {isRegistering ? 'Register' : 'Login'}
                                    </button>
                                </form>
                                <div className="my-4 flex items-center">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="mx-3 text-gray-400 text-sm">or</span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded transition"
                                >
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                                        alt="Google logo"
                                        className="w-5 h-5"
                                    />
                                    Sign in with Google
                                </button>
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => setIsRegistering(!isRegistering)}
                                        className="text-pink-600 hover:underline text-sm"
                                    >
                                        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                };