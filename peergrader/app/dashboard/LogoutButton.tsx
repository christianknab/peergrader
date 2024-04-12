import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LogoutButton() {
    const signOut = async () => {
        "use server";
    
        const supabase = createClient();
        await supabase.auth.signOut();
        return redirect("/login");
      };
    return (<form action={signOut}>
        <button className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>);

}