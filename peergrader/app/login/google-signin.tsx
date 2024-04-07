"use client";
import { useEffect } from 'react';
import { supabase } from "../../utils/supabase/client";
import { useRouter, useSearchParams } from 'next/navigation';

// export async function signInWithGoogle() {
//   try {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {redirectTo: 'www.google.com/login', skipBrowserRedirect: false}
//     });

//     if (error) {
//       console.error('Error signing in with Google:', error);
//       throw error;
//     }
//   } catch (error) {
//     console.error('Error signing in with Google:', error);
//     throw error;
//   }
// }

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




// "use client";
// import { redirect } from "next/navigation";
// import { useEffect } from 'react';
// import { supabase } from "../../utils/supabase/client";
// import { useRouter } from 'next/router';
// export default function GoogleSignInButton() {
//     const GoogleSignIn = () => {
//         const router = useRouter();
//         useEffect(() => {
//             const handleSignIn = async () => {
//                 try {
//                     // Check if the code parameter is present in the URL
//                     const { code } = router.query;
//                     if (code) {
//                         // Use the code to complete the Google sign-in flow
//                         const { data, error } = await supabase.auth.signInWithIdToken({
//                             provider: 'google',
//                             token: String(code)
//                         });
//                         if (error) {
//                             console.error('Error signing in:', error.message);
//                         } else {
//                             console.log('Signed in successfully:', data);
//                             // Redirect the user to the desired page or perform any other necessary actions
//                             router.push('/dashboard');
//                         }
//                     } else {
//                         // If the code parameter is not present, initiate the Google sign-in flow
//                         await supabase.auth.signInWithOAuth({
//                             provider: 'google',
//                         });
//                     }
//                 } catch (error: any) {
//                     console.error('Error signing in:', error.message);
//                 }

//             }; handleSignIn();
//         }, [router]);

//     };
    

//     return (
//         <div>
//             <button onClick={GoogleSignIn}>{'Sign in with Google'}</button>
//         </div>
//     )
// }

// // async function OAuthSignIn() {

//     //     try {
//     //         setLoading(true);
//     //         const { data, error } = await supabase.auth.signInWithOAuth({
//     //             provider: 'google',
//     //         });
//     //         if (error) {
//     //             console.error('Error signing in with Google:', error);
//     //             setLoading(false);
//     //             return;
//     //         }

//     //         console.log("data:", data);
//     //         const url = new URL(data.url);
//     //         const code = url.searchParams.get('code');
//     //         console.log("code:", code);

//     //         if (code != null) {
//     //             const { error: tokenError } = await supabase.auth.signInWithIdToken({
//     //                 provider: 'google',
//     //                 token: code,
//     //             });

//     //             if (tokenError) {
//     //                 console.error('Error exchanging code for token:', tokenError);
//     //                 setLoading(false);
//     //                 return;
//     //             }
//     //         }


//     //         // Redirect the user to the desired page after successful login
//     //         await redirect('/protected');
//     //     } catch (error) {
//     //         console.error('Error signing in with Google:', error);
//     //         setLoading(false);
//     //     }
//     // }