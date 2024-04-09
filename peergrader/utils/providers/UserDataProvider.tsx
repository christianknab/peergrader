"use client";
import { createContext, useState, ReactNode, useContext, useEffect, SetStateAction, Dispatch } from 'react';

export type AppUser = {
  uid: string;
  email: string;
  is_teacher: boolean;
};

type UserContextType = {
  currentUser: AppUser | null;
  // setUser: Dispatch<SetStateAction<AppUser | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children , appUser}:{ children: ReactNode, appUser:AppUser | null}) => {

  const [currentUser] = useState<AppUser | null>(appUser);
  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
