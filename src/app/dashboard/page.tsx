'use client'

import React from 'react'
import UserContext, { type UserType } from '@/context/user-context';

const Dashboard = () => {
  const userContext = React.useContext(UserContext);

  // todo - handle sign out by clearing the user context and redirecting to the sign in page
  const handleSignOut = () => { 
    userContext?.setUser(null);
  }

  return (

    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {userContext?.user?.name}!</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

export default Dashboard