import SingleLineInputField from "@/components/SingleLineInputFeild";
import { SubmitButton } from "@/components/submit-button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default function ForgotPasswordClient() {

    const changePassword = async (formData: FormData) => {
        "use server";
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const supabase = createClient();
        //FIXME logic
        const { error } = await supabase.auth.updateUser({ password: password });


        
    };

    return (<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 p-12">

        <div className="bg-white shadow-lg rounded-md p-6 border">
            <div className="pb-4"><h1 className="font-bold text-3xl">Choose a new password</h1></div>
            <form className="animate-in flex flex-col justify-center gap-2 text-foreground ">
                <span className="text-sm pb-1">To secure your account, choose a strong password you haven’t used before and is at least 8 characters long.</span>
                <SingleLineInputField label="Password" name="password" type="password" required />
                <SingleLineInputField label="Confim Password" name="confimPassword" type="password" required />

                <SubmitButton
                    formAction={changePassword}
                    pendingText="Sending..."
                    className="bg-btn-background hover:bg-btn-background-hover rounded-full px-3 py-3 text-foreground mb-2"
                >
                    Next
                </SubmitButton>
                <Link href="/dashboard" className="flex justify-center hover:underline">Back</Link>
            </form>
        </div>
    </div>);
}