"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";
interface SubmissionData {
    file_id: string | null;
    has_annotation: boolean;
}

function useSubmissionsGradedByUserQuery(graderId: string, asgnId: string, enabled:boolean) {

    const supabase = createClient();
    const queryKey = [graderId, asgnId, "gradedSubs"];

    const queryFn = async () => {
        const { data } = await supabase.rpc('get_grades_from_user', {p_grader_id: graderId, p_asgn_id: asgnId});
        return data as SubmissionData[];
    };
    return useQuery({ queryKey: queryKey, queryFn, enabled, staleTime: 5 * 1000}); //5 seconds
}

export default useSubmissionsGradedByUserQuery;