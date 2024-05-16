"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";

interface GradeFeedback {
    graded_by: string;
    total:number;
}

function useSubmissionGradeForUserQuery(userID: string, asgnId: string, enabled:boolean) {

    const supabase = createClient();
    const queryKey = [userID, asgnId, "gradesForSub"];

    const queryFn = async () => {
        const { data } = await supabase.rpc('get_grades_for_user', {p_uuid: userID, p_asgn_id: asgnId});
        return data as GradeFeedback[];
    };
    return useQuery({ queryKey: queryKey, queryFn, enabled, staleTime: 30 * 1000}); //30 seconds
}

export default useSubmissionGradeForUserQuery;