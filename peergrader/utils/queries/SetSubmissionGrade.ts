import { SupabaseClient } from "@supabase/supabase-js";

export default async function SetSubmissionGrade(client: SupabaseClient, annotationData:{userId: string, fileId: string, data: JSON}) {
  const { data } = await client.from('grades')
    .upsert([
      { grader_id: annotationData.userId, file_id: annotationData.fileId, annotation: annotationData.data },
    ]).throwOnError();

  return { data };
}

//, { onConflict: 'grader_id' }