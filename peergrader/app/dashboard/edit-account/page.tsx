"use client";
import { createClient } from "@/utils/supabase/server";
import EditAccountClient from "./EditAccountClient";
import { redirect, useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function DashboardPage() {

    const router = useRouter();

    return (
        <div className="w-full"><div className="w-full flex justify-between items-center p-4 light-grey">
            <NavBar />
        </div><EditAccountClient /> </div>
    );
}
