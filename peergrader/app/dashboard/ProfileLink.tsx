'use client';

import { redirect, useRouter } from "next/navigation";

export default async function LogoutButton() {
    const router = useRouter();

    return (
        <button onClick={() => router.push("/dashboard/edit-account")} className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
            Christian
        </button>
    );

}