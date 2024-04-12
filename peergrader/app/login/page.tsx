import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import GoogleSignInButton from "./google-signin";
import SingleLineInputField from "@/components/SingleLineInputFeild";


export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/dashboard");
  };


  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log(error);
      return redirect("/login?message=Could not authenticate user");
    }

    // If sign up is successful, add the user to the accounts table
    if (data && data.user) {
      const { data: insertData, error: insertError } = await supabase
        .from('accounts')
        .insert([
          { uid: data.user.id, email: data.user.email },
        ]);

      if (insertError) {
        console.log('Error inserting to accounts:', insertError);
      }
    }

    return redirect("/dashboard");
  };



  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      {/* <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link> */}
      <div className="bg-white shadow-lg rounded-md p-6 border">
        <div className="pb-4"><h1 className="font-bold text-3xl">Log in</h1></div>
        <form className="animate-in flex flex-col justify-center gap-2 text-foreground ">
          <SingleLineInputField label="Email" name="email" type="email" placeholder="you@example.com" required/>
          <SingleLineInputField label="Password" name="password" type="password" placeholder="••••••••" required/>
          <SubmitButton
            formAction={signIn}
            className="bg-btn-background hover:bg-btn-background-hover rounded-full px-3 py-2 text-foreground mb-2"
            pendingText="Signing In..."
          >
            Sign In
          </SubmitButton>

{/* TODO */}
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
          <Link href="/forgot-password" className="hover:underline">Forgot password?</Link>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <div className="flex justify-center">
          <GoogleSignInButton nextUrl="/dashboard" />
        </div>
      </div>
    </div>
  );
}


// {/* <SubmitButton
//   formAction={signUp}
//   className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
//   pendingText="Signing Up..."
// >
//   Sign Up
// </SubmitButton> */}