// "use client";
// import { useQuery } from "@tanstack/react-query"
// import { createClient } from "../supabase/client";
// import GetSubmissionGrade from "../queries/GetSubmissionGrade";

// function useSubmissionGradeQuery(graderId: string, fileId: string) {

//     const supabase = createClient();
//     const queryKey = [graderId, fileId, "grade"];

//     const queryFn = async () => {
//         const { data } = await GetSubmissionGrade(supabase, graderId, fileId);
//         return data
//     };
//     return useQuery({ queryKey: queryKey, queryFn });
// }

// export default useSubmissionGradeQuery;