import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import {ReviewsProvider} from "./context/ReviewsContext.tsx";
import {SavedItemsProvider} from "./context/SavedItemsContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <FavoritesProvider>
                <ReviewsProvider>
                    <SavedItemsProvider>
                        <App />
                    </SavedItemsProvider>
                </ReviewsProvider>
            </FavoritesProvider>
        </AuthProvider>
    </React.StrictMode>
);