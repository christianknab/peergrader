"use client";
import { supabase } from "../../utils/supabase/client";

export default function GoogleSignInButton(props: { nextUrl?: string }) {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/login/callback?next=${
          props.nextUrl || ""
        }`,
      },
    });
  };

  return (
    <div>
      <button onClick={handleLogin}>{'Sign in with Google'}</button>
    </div>
  );
}