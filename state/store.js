// @ts-nocheck
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './mockDB'; // Make sure 'api' is imported

const StoreContext = createContext(null);

export function StoreProvider({ children }){
  const [communities, setCommunities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(api.currentUser());

  const refresh = async ()=>{
    setLoading(true);
    const list = await api.listCommunities();
    const notifs = await api.listNotifications();
    const refreshedUser = api.currentUser();
    
    setCommunities(list);
    setNotifications(notifs);
    setUser(refreshedUser);
    setLoading(false);
  };

  useEffect(()=>{
    refresh();
  }, []);

  const value = { user, communities, notifications, loading, refresh, api };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);