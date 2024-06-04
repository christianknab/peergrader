import { SupabaseClient } from "@supabase/supabase-js";

interface Course {
    course_id: string;
    name: string;
    number: string;
    owner: string;
    start_date: string;
    end_date: string;
}

interface Owner {
    first_name: string;
    last_name: string;
    profile_image: string;
}

interface CourseInfo {
    course: Course;
    owner: Owner;
}

export default async function GetCourseInfo(client: SupabaseClient, joinCode: string): Promise<CourseInfo> {
    // Fetch course details based on joinCode
    const { data: course } = await client.from('courses')
        .select('course_id, name, number, owner, start_date, end_date')
        .eq('join_code', joinCode)
        .single();

    if (!course) {
        throw new Error('Course not found');
    }

    // Fetch owner details based on the owner id from course data
    const { data: owner } = await client.from('accounts')
        .select('first_name, last_name, profile_image')
        .eq('uid', course.owner)
        .single();

    if (!owner) {
        throw new Error('Owner not found');
    }

    return {
        course,
        owner
    };
}
