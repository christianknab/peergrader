import SingleLineInputField from "@/components/SingleLineInputFeild";
import { SubmitButton } from "../../components/submit-button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export default function ForgotPassword() {

    const resetPassword = async (formData: FormData) => {
        "use server";
        // const headerList = headers();
        // const domain = headerList.get("x-forwarded-host") || headerList.get("host") || "beta.popstarz.ai";

        const email = formData.get("email") as string;
        const supabase = createClient();

        const { error } = await supabase.auth.resetPasswordForEmail(
            email, { redirectTo: "" }

        );

        // if (error) {
        //   return redirect("/login?message=Could not authenticate user");
        // }

        // return redirect("/dashboard");
    };
    return (<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 p-12">

        <div className="bg-white shadow-lg rounded-md p-6 border">
            <div className="pb-4"><h1 className="font-bold text-3xl">Forgot password</h1></div>
            <form className="animate-in flex flex-col justify-center gap-2 text-foreground ">
                <SingleLineInputField label="Email" name="email" type="email" required />
                <span className="text-sm pb-1">We’ll send a verification code to this email if it matches an existing account.</span>
                <SubmitButton
                    formAction={resetPassword}
                    pendingText="Sending..."
                    className="bg-btn-background hover:bg-btn-background-hover rounded-full px-3 py-3 text-foreground mb-2"
                >
                    Next
                </SubmitButton>
                <Link href="/login" className="flex justify-center hover:underline">Back</Link>
            </form>
        </div>
    </div>)
}