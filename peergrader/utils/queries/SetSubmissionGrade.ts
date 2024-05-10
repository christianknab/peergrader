import { SupabaseClient } from "@supabase/supabase-js";

export default async function SetSubmissionGrade(client: SupabaseClient, annotationData:{userId: string, fileId: string, data: JSON}, rubric_data: {points_selected: number[], total: number}) {
  const { data , error} = await client.from('grades')
    .upsert([
      { graded_by: annotationData.userId, file_id: annotationData.fileId, annotation_data: annotationData.data, points_selected: rubric_data.points_selected, total: rubric_data.total },
    ]).throwOnError();

  return { data, error };
}

//, { onConflict: 'grader_id' }