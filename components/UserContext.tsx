"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DTLUser, SubscriptionLevel, UserRole } from '@/lib/server/data';

interface UserContextType {
  user: DTLUser;
  setUser: (user: DTLUser) => void;
  // Hjælpefunktion til udviklere
  updateSubscription: (level: SubscriptionLevel) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ 
  children, 
  initialUser 
}: { 
  children: ReactNode; 
  initialUser: DTLUser; 
}) {
  const [user, setUser] = useState<DTLUser>(initialUser);

  // Sikrer at vi synkroniserer hvis server-data ændrer sig (f.eks. ved rigtig login/logout)
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Funktion til at simulere skift af abonnement (Kun for Developers)
  const updateSubscription = (level: SubscriptionLevel) => {
    console.log("Switching to level:", level);
    setUser(prev => ({
      ...prev,
      subscriptionLevel: level
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateSubscription }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}