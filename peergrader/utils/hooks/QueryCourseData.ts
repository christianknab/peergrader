"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";

function useCourseDataQuery(course_id: string) {

    const supabase = createClient();
    const queryKey = [course_id, "CourseData"];

    const queryFn = async () => {
        const { data } = await supabase.from("courses").select("name, owner, join_code").eq("course_id", course_id).single();
        return data
    };

    return useQuery({ queryKey: queryKey, queryFn, staleTime: 5 * 60 * 1000 });
}

export default useCourseDataQuery;