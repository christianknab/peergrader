import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../../components/submit-button";
import GoogleSignInButton from "../../components/google-signin";
import SingleLineInputField from "@/components/SingleLineInputFeild";


export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {


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
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 p-12">
      <div className="bg-white shadow-lg rounded-md p-6 border">
        <div className="pb-4"><h1 className="font-bold text-3xl">Sign Up</h1></div>
        <form className="animate-in flex flex-col justify-center gap-2 text-foreground ">
          <SingleLineInputField label="Email" name="email" type="email" placeholder="you@example.com" required />
          <SingleLineInputField label="Password" name="password" type="password" placeholder="••••••••" required />
          <SubmitButton
            formAction={signUp}
            className="bg-btn-background hover:bg-btn-background-hover rounded-full px-3 py-2 text-foreground mb-2"
            pendingText="Signing Up..."
          >
            Sign Up
          </SubmitButton>

          {/* TODO */}
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}

        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <div className="flex justify-center">
          <GoogleSignInButton nextUrl="/dashboard" text="Sign up with Google"/>
        </div>
      </div>
      <div className="flex justify-center">
        <span>Already have an account? <Link href='/login' className="text-blue-700 hover:underline">Sign in</Link></span>
        </div>
    </div>
  );
}