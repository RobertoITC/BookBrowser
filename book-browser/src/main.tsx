import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import {ReviewsProvider} from "./context/ReviewsContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <FavoritesProvider>
                <ReviewsProvider>
                    <App />
                </ReviewsProvider>
            </FavoritesProvider>
        </AuthProvider>
    </React.StrictMode>
);