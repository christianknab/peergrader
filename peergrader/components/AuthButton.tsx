import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  //signout function
  // const signOut = async () => {
  //   "use server";

  //   const supabase = createClient();
  //   await supabase.auth.signOut();
  //   return redirect("/login");
  // };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!

      <Link
        href="/dashboard"
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Dashboard
      </Link>
    </div>
  ) : (
    <Link
      href="/login"
      className="font-bold py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
