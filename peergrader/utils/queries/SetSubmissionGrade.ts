import { SupabaseClient } from "@supabase/supabase-js";

export default async function SetSubmissionGrade(client: SupabaseClient, annotationData:{userId: string, fileId: string, data: JSON}) {
  const { data , error} = await client.from('grades')
    .upsert([
      { graded_by: annotationData.userId, file_id: annotationData.fileId, annotation_data: annotationData.data },
    ]).throwOnError();

  return { data, error };
}

//, { onConflict: 'grader_id' }