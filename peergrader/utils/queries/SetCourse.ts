import { SupabaseClient } from "@supabase/supabase-js";

export default async function SetCourse(client: SupabaseClient, courseData: {
  courseId: string;
  name: any;
  number: any;
  start_date: any;
  end_date: any;
}) {
  const { data , error} = await client.from('courses')
    .update([
      { name: courseData.name, number: courseData.number, start_date: courseData.start_date, end_date: courseData.end_date },
    ]).eq('course_id', courseData.courseId).throwOnError();

  return { data, error };
}
