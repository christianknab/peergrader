"use client";

import SingleLineInputField from "@/components/SingleLineInputFeild";
import { SubmitButton } from "@/components/submit-button";
import useCurrentUserMutation from "@/utils/hooks/MutateCurrentUser";
import SetUser from "@/utils/queries/SetUser";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditAccountClient({ user }: { user: User }) {
    // const supabase = createClient();
    const router = useRouter();

    const currentUserMutation = useCurrentUserMutation();//router.push("/dashboard"); 
    const save = (formData: FormData) => {
        const accountType = formData.get("account_type");
        currentUserMutation.mutate({ uid: user.id, email: user.email!, is_teacher: accountType == "teacher" }, { onSuccess: () => { router.push("/dashboard"); } });
        // if (!currentUserMutation.error) { router.push("/dashboard"); }
    }
    return (<div><form className="animate-in flex flex-col justify-center gap-2 text-foreground ">
        {/* <SingleLineInputField label="Email" name="email" type="email" placeholder="you@example.com" required />
        <SingleLineInputField label="Password" name="password" type="password" placeholder="••••••••" required /> */}

        <label htmlFor="account_type" defaultValue="student" className="block mb-2 text-sm font-medium text-gray-500">Account Type</label>
        <select name="account_type" className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
        </select>
        {currentUserMutation.isError && <span>Failed to save. Please try again later.</span>}

        <button className="bg-btn-background hover:bg-btn-background-hover rounded-full px-3 py-2 text-foreground mb-2" formAction={save}>{currentUserMutation.isPending ? "Saving..." : "Save"}</button>



    </form></div>);
}