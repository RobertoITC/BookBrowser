// src/components/LogoutButton.tsx
import React, { useState, useCallback } from 'react';
import { useConfirmation } from '../hooks/useConfirmation';
import { logout } from '../services/authService';
import {useNavigate} from "react-router-dom";


interface LogoutButtonType extends React.FC {
    Confirmation: React.FC;
}

export const LogoutButton: LogoutButtonType = () => {
    const navigate = useNavigate();


    const { confirm } = useConfirmation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutConfirm = useCallback(async () => {
        setIsLoggingOut(true);
        try {

            await logout();
            navigate('/')
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    }, []);

    const showLogoutConfirmation = useCallback(() => {
        confirm({
            title: 'Confirm Logout',
            message: 'Are you sure you want to log out?',
            confirmText: isLoggingOut ? 'Logging out…' : 'Logout',
            cancelText: 'Cancel',
            variant: 'warning',
            onConfirm: handleLogoutConfirm,
        });
    }, [confirm, handleLogoutConfirm, isLoggingOut]);

    return (
        <button
            onClick={showLogoutConfirmation}
            disabled={isLoggingOut}
            className="
        flex items-center
        bg-red-500 hover:bg-red-600
        text-white font-medium
        px-4 py-2 rounded-md
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300
        disabled:opacity-50 disabled:cursor-not-allowed
      "
        >
            {isLoggingOut ? 'Logging out…' : 'Logout'}
        </button>
    );
};

// Expose the modal component so it can be mounted at top‐level
LogoutButton.Confirmation = () => {
    const { Confirmation } = useConfirmation();
    return <Confirmation />;
};