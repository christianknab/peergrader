"use client"
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import ListCourses from "@/components/ListCourses";
import Link from "next/link";


export default async function StudentDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      
      <header className="w-full py-8">
        <h1 className="text-5xl font-bold text-left pl-10 write-blue">Student Dashboard</h1>
      </header>

      <main className="flex-1 w-full">
        <div className="p-8 flex gap-24">

          <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
            <div className="light-blue p-4">
              <p className="text-xl text-center font-semibold">Assignments</p>
            </div>
            <div className="light-white flex-grow p-6">
            </div>
          </div>

          <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
            <div className="light-blue p-4">
              <Link
                href={{
                  pathname: '/courses',
                }}
              >{<h2 className="text-black text-xl text-center font-semibold">Courses</h2>}</Link>
            </div>
            <div className="min-h-[500px] light-white flex-grow p-6">
              <ListCourses />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full font-bold light-grey p-4 bg-white text-center">
        <p>&copy;2024 PeerGrader</p>
      </footer>
    </div>
  );
}
