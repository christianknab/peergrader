"use client";

import TeacherAsgnPage from "./teacherAsgnPage";
import StudentAsgnPage from "./studentAsgnPage";
import useCurrentUserQuery from "@/utils/hooks/CurrentUser";

export default function CoursePage() {
  const { 
    data: currentUser, 
    isLoading: isUserLoading, 
    isError 
  } = useCurrentUserQuery();
 
  if (isUserLoading) {
    return <div>Loading...</div>;
  }
 
  if (isError || !currentUser) {
    return <div>Error</div>;
  }

  if (currentUser.is_teacher) { return (<TeacherAsgnPage />); } else { return (<StudentAsgnPage />); }
}