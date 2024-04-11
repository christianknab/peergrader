import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function ActionButton() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (<div className="flex gap-4 mb12">
        <Link
            href={!user ? "/signup" : "/dashboard"}
            className="light-blue bg-btn-background hover:bg-btn-background-hover text-foreground font-bold py-2 px-8 rounded"
        >
            {!user ? "Sign Up" : "Dashboard"}
        </Link>
        {!user && <Link
            href="/login"
            className="font-bold py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
            Login
        </Link>}
    </div>);


}



// {/* <button className="light-blue bg-btn-background hover:bg-btn-background-hover text-foreground font-bold py-2 px-8 rounded">
//             Sign Up
//           </button>
//           <button className="bg-btn-background hover:bg-btn-background-hover text-foreground font-bold py-2 px-8 rounded">
//             {/* <AuthButton /> */}
//           </button */}