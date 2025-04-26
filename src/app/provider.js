'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import axios from '@/lib/axios'; 

const Provider = ({ children }) => {
  const { user, isLoaded } = useUser(); // Add `isLoaded` to check if the user data is ready
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      try {
        if (!isSignedIn || !user || !isLoaded) return; // Add isLoaded check

        const token = await getToken();
        if (!token) return;

        localStorage.setItem('clerk_token', token);

        const res = await axios.post('/auth/sync-user', {
            email: user?.emailAddresses[0]?.emailAddress,
            firstName: user?.firstName,
            lastName: user?.lastName,
            profileImage: user?.imageUrl,
          });
        console.log('User synced:', res.data);
      } catch (error) {
        console.error('User sync failed:', error?.response);
      }
    };

    syncUser();
  }, [isSignedIn, user, isLoaded]); // Add `isLoaded` to dependency

  return <>{children}</>;
};

export default Provider;
