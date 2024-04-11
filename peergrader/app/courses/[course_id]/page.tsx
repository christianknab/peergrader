'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Layout from './layout';
import Link from 'next/link';
import ListAsgn from '@/components/ListAsgn';

interface CourseData {
    owner: string;
}

export default function CoursePage() {
    const supabase = createClient();
    const params = useParams();
    const course_id = params.course_id as string;
    const [courseData, setCourseData] = useState<CourseData | null>(null);

    useEffect(() => {
        async function fetchCourseData() {
            try {
                const { data, error } = await supabase
                    .from('courses')
                    .select('owner')
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
            {courseData && (
                <>
                    <p>Owner: {courseData.owner}</p>
                    <Link href={{ pathname: `courses/${course_id}/create-assignment` }}>Add assignment
                    </Link>
                </>

            )}
            <h3>Asignments</h3>
            <ListAsgn course_id={course_id} />
        </div>
    );
}


