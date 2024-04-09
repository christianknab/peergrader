"use client"
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import dynamic from 'next/dynamic';
import UserFilesList from "@/components/listFiles";
import UserCoursesList from "../../components/listCourses";
import Link from "next/link";
// import UploadButton from "@/app/dashboard/UploadButton"
// import useUserData from "@/utils/readUserData";

const UploadButton = dynamic(
  () => import("@/app/dashboard/UploadButton"),
  { ssr: false }
);

export default async function StudentDashboardPage() {
  //   const supabase = createClient();
  // const { userData, isLoading, error} = useUserData();
  // if(!isLoading && !error && userData){
  //   console.log(userData.isTeacher);
  // }
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  //   if (!user) {
  //     return redirect("/login");
  //   }
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <div className="py-6 font-bold bg-purple-950 text-center">
          Student dashboard
        </div>
        {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">

            <AuthButton />
          </div>
        </nav> */}
      </div>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">

        <main className="flex-1 flex gap-6">
          {/* Left column*/}
          <div className="flex-1">
            <h2 className="font-bold text-4xl mb-4">Assignments</h2>

          </div>
          {/* Right column*/}
          <div className="flex-1">

            <Link
              href={{
                pathname: '/courses',
              }}
            >{<h2 className="font-bold text-4xl mb-4">Courses</h2>}</Link>
            <UserCoursesList user={user!} />
          </div>
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          footer
        </p>
      </footer>
    </div>
  );
}