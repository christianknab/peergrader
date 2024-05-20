"use client";
import { createClient } from "@/utils/supabase/server";
import EditAccountClient from "./EditAccountClient";
import { redirect, useRouter } from "next/navigation";

export default function DashboardPage() {

    const router = useRouter();

    return (
        <div className="w-full"><div className="w-full flex justify-between items-center p-4 light-grey">
            <button
                onClick={() => router.push('/dashboard')}
                className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
                Return to Dashboard
            </button>
            <span className="font-bold text-lg">PeerGrader</span>
        </div><EditAccountClient/> </div>
    );
}
