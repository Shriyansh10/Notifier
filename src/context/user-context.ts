'use client'
import React from "react";

export type UserType = {
    id: string,
    name: string,
    email: string,
}

export type UserContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

const UserContext = React.createContext<UserContextType | null>(null);

export default UserContext;