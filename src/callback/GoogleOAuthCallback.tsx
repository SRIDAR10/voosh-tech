import { useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
//   const isInitialMount = useRef(true);

  useEffect(() => {
    // if (isInitialMount.current) {
    //   isInitialMount.current = false;
    //   return;
    // }

    const handleCallback = async () => {
      try {
        console.log(`${import.meta.env.VITE_API_URL}/v1/auth/google/callback?code=${searchParams.get("code")}`)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/google/callback?code=${searchParams.get("code")}`, {
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
  }, [searchParams]);

  return <div>Authenticating...</div>;
};

export default GoogleCallback;
