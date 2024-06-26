import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function ActionButton() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div className="flex gap-4 mb-12">
            <Link
                href={!user ? "/signup" : "/dashboard"}
                className="light-blue bg-btn-background hover:bg-btn-background-hover text-foreground font-bold py-2 px-8 rounded flex justify-center items-center min-w-[120px]"
            >
                {!user ? "Sign Up" : "Dashboard"}
            </Link>
            {!user && (
                <Link
                    href="/login"
                    className="font-bold bg-btn-background hover:bg-btn-background-hover text-foreground font-bold py-2 px-8 rounded flex justify-center items-center min-w-[120px]"
                >
                    Login
                </Link>
            )}
        </div>
    );
}



// {/* <button className="light-blue bg-btn-background hover:bg-btn-background-hover text-foreground font-bold py-2 px-8 rounded">
//             Sign Up
//           </button>
//           <button className="bg-btn-background hover:bg-btn-background-hover text-foreground font-bold py-2 px-8 rounded">
//             {/* <AuthButton /> */}
//           </button */}