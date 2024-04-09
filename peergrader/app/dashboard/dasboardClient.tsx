"use client";
import { createClient } from "@/utils/supabase/client";
import TeacherDashboardPage from "./teacherDashboard";
import { useUser } from "@/utils/providers/UserDataProvider";
import StudentDashboardPage from "./studentDasboard";
import { readUser } from "@/utils/readUser";


export default async function DashboardClientPage() {
    const supabase = createClient();
    const userContext = useUser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!userContext) {
        return <div>Loading...</div>;
    }
    const { currentUser } = userContext;
    // setUser(await readUser(user!.id));
    if (!currentUser) {
        return <div>loading...</div>
    }

    if (currentUser.is_teacher) { return (<TeacherDashboardPage />); } else { return (<StudentDashboardPage />); }
}