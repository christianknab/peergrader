"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";


interface Course {
    course_id: string;
    name: string;
}

interface CoursesData {
    course: Course[];
}

function useUserCoursesQuery( userId: string) {

    const supabase = createClient();
    const queryKey = [userId, "getCoursesStudent"];

    const queryFn = async (): Promise<CoursesData> => {
        const { data } = await supabase.rpc('get_courses_student', { user_id_param: userId });
        return { course: data };
    };
    return useQuery<CoursesData>({ queryKey: queryKey, queryFn, staleTime: 3 * 60 * 1000 });
}

export default useUserCoursesQuery;