"use client";
import TeacherDashboardPage from "./teacherDashboard";
import { useUser } from "@/utils/providers/UserDataProvider";
import StudentDashboardPage from "./studentDasboard";



export default async function DashboardClientPage() {

    const userContext = useUser();

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