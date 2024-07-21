import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/google/callback`, {
          credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/dashboard');
        } else {
          console.error('Authentication failed');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error during Google callback:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default GoogleCallback;