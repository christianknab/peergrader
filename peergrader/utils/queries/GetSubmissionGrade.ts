import { SupabaseClient } from "@supabase/supabase-js";

export default async function GetSubmissionGrade(client: SupabaseClient, userId: string, fileId:string) {
    const { data }= await client.from('grades')
        .select('annotation_data, points_selected, points_received, total').eq('graded_by', userId).eq('file_id', fileId).single();
        return {data};
}

