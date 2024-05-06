"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";
import GetUserById from "../queries/GetUser";
import { useRouter } from "next/navigation";
import GetSubmissionGrade from "../queries/GetSubmissionGrade";

function useSubmissionGradeQuery(graderId: string, fileId: string) {

    const client = createClient();
    const queryKey = [graderId, fileId, "grade"];

    const queryFn = async () => {
        const { data } = await GetSubmissionGrade(client, graderId, fileId);
        return data
    };
    return useQuery({ queryKey: queryKey, queryFn });
}

export default useSubmissionGradeQuery;