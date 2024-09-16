import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthRedirect() {
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/sign-in');
    }
  }, [token, navigate]);

  return token;
}
