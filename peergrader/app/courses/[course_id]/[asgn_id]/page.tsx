"use client";
import { useUser } from "@/utils/providers/UserDataProvider";
import TeacherAsgnPage from "./teacherAsgnPage";
import StudentAsgnPage from "./studentAsgnPage";

export default async function CoursePage() {
  const userContext = useUser();
  if (!userContext?.currentUser) {
    alert('You must be logged in');
    return;
  } if (!userContext?.currentUser) { }

  if (userContext?.currentUser.is_teacher) { return (<TeacherAsgnPage />); } else { return (<StudentAsgnPage />); }
}