"use client";

import TeacherCoursePage from "./teacherCoursePage";
import StudentCoursePage from "./studentCoursePage";
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
    if (!currentUser) {
        alert('You must be logged in');
        return;
    } if (!currentUser) { }

    if (currentUser.is_teacher) { return (<TeacherCoursePage />); } else { return (<StudentCoursePage />); }
}