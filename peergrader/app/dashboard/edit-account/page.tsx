
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";
import EditAccountClient from "./EditAccountClient";

export default async function DashboardPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect("/login");
    }
    
// user={user}
    return (<div>
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 p-12">
            <div className="bg-white shadow-lg rounded-md p-6 border">
                <div className="pb-4"><h1 className="font-bold text-3xl">Edit Account</h1></div>
                <EditAccountClient user={user}/> 


            </div>

        </div>
    </div>);
}
