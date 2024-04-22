import SingleLineInputField from "@/components/SingleLineInputFeild";
import { SubmitButton } from "../../components/submit-button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import ForgotPasswordClient from "./forgotPasswordClient";

export default function ForgotPassword() {
    return (<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 p-12">

        <div className="bg-white shadow-lg rounded-md p-6 border">
            <div className="pb-4"><h1 className="font-bold text-3xl">Forgot password</h1></div>
            <ForgotPasswordClient />
        </div>
    </div>)
}