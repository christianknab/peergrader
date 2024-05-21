import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClientPage from "./dasboardClient";
import LogoutButton from "./LogoutButton";
import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";
import ProfileLink from "./ProfileLink";



export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser(); // should this me querycurrentuser

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full flex justify-between items-center p-4">
        <span className="font-bold text-lg">PeerGrader</span>
        <div className="flex"><div className="pr-2"><ProfileLink /></div>
          <LogoutButton /></div>

      </div>
      <div className="flex-1 w-full">
        <DashboardClientPage />
      </div>
    </div>
  );
  // if (!userContext) {
  //   return <div>Loading...</div>;
  // }
  // const { currentUser, updateUser } = userContext;


  // if (currentUser.is_teacher) { return (<TeacherDashboardPage />); } else { return (<StudentDashboardPage />); }

}