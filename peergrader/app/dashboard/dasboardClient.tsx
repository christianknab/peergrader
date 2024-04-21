"use client";
import TeacherDashboardPage from "./teacherDashboard";
import useCurrentUserQuery, { } from "@/utils/hooks/QueryCurrentUser";
import StudentDashboardPage from "./studentDasboard";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import GetUserById from "@/utils/queries/GetUser";
import { SupabaseClient } from "@supabase/supabase-js";

export default function DashboardClientPage() {
    
    const { 
        data: currentUser, 
        isLoading, 
        isError 
      } = useCurrentUserQuery();
     
      if (isLoading) {
        return <div>Loading...</div>;
      }
     
      if (isError ) {
        return <div>Error</div>;
      }
    
    // if (currentUser?.is_teacher) { return (<div>Teach</div>); } else { return (<div>Stu</div>); }
    if (currentUser?.is_teacher) { return (<TeacherDashboardPage />); } else { return (<StudentDashboardPage />); }
}