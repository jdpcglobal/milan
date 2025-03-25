import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LoginState } from '../Utils/Types';
import { fetchProfiles } from '../Components/Swiper';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);
  const [plans2, setPlans2] = useState({});
  const [allUserData, setUserData] = useState({});
  const token = useSelector((state: LoginState) => state.logins.auth_token);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (token) {
      fetchPlans();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        userData();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  const fetchPlans = async () => {
    if (!token) return;
    const payload = {
      token: token,
    };
    try {
      console.log('666666666');
      const response = await axios.post('https://themilan.org/api/getPlans', payload, {
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = response.data;
      if (data.isSuccess) {
        setPlans(data.data);
        setPlans2(data);
      }
    } catch (error) {
      console.error('getPlans error:', error);
    }
  };

  const userData = async () => {
    if (!token) return;

    const payload = {
      token: token,
    };

    try {
      const response = await fetch(
        'https://themilan.org/api/user', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Create EditProfileApi api error');
      }
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error('userData Error Last', error);
    }
  }

  const callAllApi = () => {
    setCount(count + 1);
  }

  return (
    <AppContext.Provider value={{ plans, allUserData, callAllApi, count, plans2, fetchPlans }}>
      {children}
    </AppContext.Provider>
  );
};
