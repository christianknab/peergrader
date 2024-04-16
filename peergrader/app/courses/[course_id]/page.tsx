"use client";
import { useUser } from "@/utils/providers/UserDataProvider";
import TeacherCoursePage from "./teacherCoursePage";
import StudentCoursePage from "./studentCoursePage";

export default async function CoursePage() {
    const userContext = useUser();
    if (!userContext?.currentUser) {
        alert('You must be logged in');
        return;
    } if (!userContext?.currentUser) { }

    if (userContext?.currentUser.is_teacher) { return (<TeacherCoursePage />); } else { return (<StudentCoursePage />); }
}