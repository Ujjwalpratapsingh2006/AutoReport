import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useFetchWithAuth = () => {
  const { accessToken, login, logout } = useAuth();
  const navigate = useNavigate();

  const fetchWithAuth = async (url, options = {}) => {
    // Inject the current access token into headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Ensure we hit the backend
    const finalUrl = url.startsWith('/api') ? `http://localhost:8080${url}` : url;

    // Make the initial request
    let response = await fetch(finalUrl, { ...options, headers });

    // If unauthorized, attempt to refresh the token
    if (response.status === 401) {
      try {
        const refreshResponse = await fetch('http://localhost:8080/api/auth/refresh-tokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Sends the HTTP-only refreshToken cookie
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          const newAccessToken = data.accessToken;
          const user = data.user;

          // Update context memory with the new token
          login(user, newAccessToken);

          // Retry the original request with the new access token
          headers['Authorization'] = `Bearer ${newAccessToken}`;
          response = await fetch(finalUrl, { ...options, headers });

        } else {
          // Token refresh failed (e.g., refresh token expired)
          throw new Error('Refresh token expired or invalid');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Force logout and redirect
        await logout();
        navigate('/login', { replace: true });
        throw error;
      }
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch (err) {
      responseData = null;
    }

    if (!response.ok) {
      return { error: responseData?.message || 'Request failed', status: response.status };
    }

    return responseData;
  };

  return fetchWithAuth;
};
