import SingleLineInputField from "@/components/SingleLineInputFeild";
import { SubmitButton } from "../../components/submit-button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import ForgotPasswordClient from "./forgotPasswordClient";

export default function ForgotPassword() {

    // const resetPassword = async (formData: FormData) => {
    //     "use server";
    //     // const headerList = headers();
    //     // const domain = headerList.get("x-forwarded-host") || headerList.get("host") || "beta.popstarz.ai";

    //     const email = formData.get("email") as string;
    //     const supabase = createClient();

    //     const { error } = await supabase.auth.resetPasswordForEmail(
    //         email, { redirectTo: "" }

    //     );

    //     // if (error) {
    //     //   return redirect("/login?message=Could not authenticate user");
    //     // }

    //     // return redirect("/dashboard");
    // };
    return (<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 p-12">

        <div className="bg-white shadow-lg rounded-md p-6 border">
            <div className="pb-4"><h1 className="font-bold text-3xl">Forgot password</h1></div>
            <ForgotPasswordClient />
        </div>
    </div>)
}