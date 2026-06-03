"use client";

import React from "react";
import UserContext, { type UserType } from "@/context/user-context";

const GlobalProviders = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default GlobalProviders;
