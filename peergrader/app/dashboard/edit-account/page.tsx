"use client";
import { createClient } from "@/utils/supabase/server";
import EditAccountClient from "./EditAccountClient";
import { redirect, useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function DashboardPage() {

    const router = useRouter();

    return (
        <div className="w-full">
            <NavBar showProfile={false}/>
            <EditAccountClient />
        </div>
    );
}
