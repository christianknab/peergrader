import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClientPage from "./dasboardClient";
import LogoutButton from "./LogoutButton";

// import { useUser } from '../../providers/UserDataProvider';

export default async function DashboardPage() {
  const supabase = createClient();
  // const userContext = useUser();
  const { data: { user } } = await supabase.auth.getUser();


  if (!user) {
    return redirect("/login");
  }
  return (<div><LogoutButton /><DashboardClientPage /></div>);
  // if (!userContext) {
  //   return <div>Loading...</div>;
  // }
  // const { currentUser, updateUser } = userContext;


  // if (currentUser.is_teacher) { return (<TeacherDashboardPage />); } else { return (<StudentDashboardPage />); }

}