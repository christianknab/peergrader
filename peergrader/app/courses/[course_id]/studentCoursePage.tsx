'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import ListAsgn from '@/app/courses/[course_id]/ListAsgn';
import ListStudents from './ListStudents';

interface CourseData {
    owner: string;
}

export default function StudentCoursePage() {
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
                    <p className="mb-4">Owner: {courseData.owner}</p>
                    <Link href={{ pathname: `${course_id}/create-assignment` }}>
                        {<button className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
                            Add assignment</button>}
                    </Link>
                </>

            )}
            <h3 className="mt-4">Asignments: </h3>
            <ListAsgn course_id={course_id} />

            <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
                <p>&copy;2024 PeerGrader</p>
            </footer>
        </div>
    );
}


