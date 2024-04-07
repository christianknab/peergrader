"use client";
import { redirect } from "next/navigation";
import { useState } from 'react';
import {supabase} from "../../utils/supabase/client";
export default function GoogleSignInButton() {
    const [loading, setLoading] = useState(false);
    async function OAuthSignIn() {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
            });
      
            if (error) {
              console.error('Error signing in with Google:', error);
              setLoading(false);
              return;
            }
      
            // Redirect the user to the desired page after successful login
            await redirect('/dashboard');
          } catch (error) {
            console.error('Error signing in with Google:', error);
            setLoading(false);
          }
    }

    return (
        <div>
            <button onClick={OAuthSignIn} disabled={loading}>{loading ? 'Loading...' : 'Sign in with Google'}</button>
        </div>
    )
}