import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClientPage from "./dasboardClient";
import NavBar from "@/components/NavBar";



export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 w-full">
        <DashboardClientPage />
      </div>
    </div>
  );

  // const { currentUser, updateUser } = userContext;


  // if (currentUser.is_teacher) { return (<TeacherDashboardPage />); } else { return (<StudentDashboardPage />); }

}