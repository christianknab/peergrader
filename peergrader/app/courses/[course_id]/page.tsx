'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Layout from './layout';
import Link from 'next/link';

interface CourseData {
    // id: string;
    // name: string;
    owner: string;
}

export default function CoursePage() {
    const { course_id } = useParams();
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const supabase = createClient();

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
        </div>
    );
}


