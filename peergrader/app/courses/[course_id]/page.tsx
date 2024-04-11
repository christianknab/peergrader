'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface CourseData {
    name: string;
    owner: string;
    course_id: string;
}

export default function CoursePage() {
    const supabase = createClient();
    const { course_id } = useParams();
    const [courseData, setCourseData] = useState<CourseData | null>(null);

    useEffect(() => {
        async function fetchCourseData() {
            try {
                const { data, error } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('course_id', course_id)
                    .single();

                if (error) {
                    console.error('Error fetching course data:', error);
                } else {
                    setCourseData(data);
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        }

        if (course_id) {
            fetchCourseData();
        }
    }, [course_id]);

    return (
        <div>
            <h1>Course Page</h1>
            {courseData && (
                <>
                    <p>Course Name: {courseData.name}</p>
                    <p>Owner: {courseData.owner}</p>
                </>
            )}
            <h3>Asignments</h3>
        </div>
    );
}