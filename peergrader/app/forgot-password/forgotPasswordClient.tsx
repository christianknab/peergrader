"use client";

import SingleLineInputField from "@/components/SingleLineInputFeild";
import { SubmitButton } from "@/components/submit-button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";
import OtpInput from 'react-otp-input';


export default function ForgotPasswordClient() {
    const [isSent, setIsSent] = useState<boolean>(false);
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');

    const resetPassword = async (formData: FormData) => {

        const email = formData.get("email") as string;
        const supabase = createClient();

        const { error } = await supabase.auth.resetPasswordForEmail(
            email, { redirectTo: `${location.origin}/login/callback?next=/dashboard/change-password` }
        );
        if (!error) {
            setEmail(email);
            setIsSent(true);
        }
    };
    const validateCode = async () => {

        const supabase = createClient();

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: '123456',
            type: 'email',
          });
        if (!error) {
            setIsSent(true);
        }
    };
    if (!isSent) {
        return (<form className="animate-in flex flex-col justify-center gap-2 text-foreground ">
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
        </form>)
    } else {
        return (<div className="flex flex-col justify-center gap-2 text-foreground">
            <span className="text-sm pb-1">Check {email} for a verification code or a password reset link.</span>
            <div className="flex justify-center">

                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    inputStyle={"items-center outline-none rounded-xl border border-gray-200 text-lg focus:bg-gray-50 focus:ring-1 ring-blue-700"}
                    renderInput={(props) => <input {...props} />}
                />
            </div>
            <SubmitButton
                formAction={validateCode}
                pendingText="Verifying..."
                className="bg-btn-background hover:bg-btn-background-hover rounded-full px-3 py-3 text-foreground mb-2"
            >
                Submit
            </SubmitButton>
        </div>);
    };
}