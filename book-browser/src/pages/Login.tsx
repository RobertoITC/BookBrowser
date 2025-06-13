import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from '../components/LoginModal';

const Login: React.FC = () => {
    const navigate = useNavigate();

    return (
        <LoginModal onClose={() => navigate('/')} />
    );
};

export default Login;