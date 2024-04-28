'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import ListAsgn from '@/app/courses/[course_id]/ListAsgn';
import ListStudents from './ListStudents';

interface CourseData {
    owner: string;
    join_code: string;
}

export default function TeacherCoursePage() {
    const supabase = createClient();
    const params = useParams();
    const course_id = params.course_id as string;
    const [courseData, setCourseData] = useState<CourseData | null>(null);

    useEffect(() => {
        async function fetchCourseData() {
            try {
                const { data, error } = await supabase
                    .from('courses')
                    .select('owner, join_code')
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
        // <div>
        //     {courseData && (
        //         <>
        //             <p className="mb-4">Join Code: {courseData.join_code}</p>
        //             <Link href={{ pathname: `${course_id}/create-assignment` }}>
        //                 {<button className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
        //                     Add assignment</button>}
        //             </Link>
        //         </>

        //     )}
        //     <h3 className="mt-4">Asignments: </h3>
        //     <ListAsgn course_id={course_id} />
        //     <h3 className="mt-4">Students: </h3>
        //     <ListStudents course_id={course_id} />
        // </div>

<main className="flex-1 w-full">
{courseData && (
    <>
<div className="flex gap-8">
    <div className="flex flex-col w-1/3 rounded-lg overflow-hidden gap-6"> 
        <div className="flex flex-col rounded-lg overflow-hidden"> 
            <div className="light-blue p-5">
                <p className="text-xl text-left font-semibold">Join Code</p>
            </div>
            <div className="light-grey flex-grow p-6"> 
                {courseData.join_code}
            </div>
        </div>

        <div className="flex flex-col rounded-lg overflow-hidden"> 
            <div className="light-blue p-5">
                <p className="text-xl text-left font-semibold">Join Link</p>
            </div>
            <div className="light-grey flex-grow p-6"> 
            http://localhost:3000/courses?code={courseData.join_code} {/* TODO: change this domain and make copyable */}
            
            </div>
        </div>

        <div className="flex flex-col rounded-lg overflow-hidden"> 
            <div className="light-blue p-5">
                <p className="text-xl text-left font-semibold">Students</p>
            </div>
            <div className="light-grey flex-grow p-6"> 
                <ListStudents course_id={course_id} />
            </div>
        </div>
    </div>

    <div className="flex flex-col w-2/3 gap-6 h-full"> 
        <div className="flex flex-col rounded-lg overflow-hidden flex-grow"> 
            <div className="light-blue p-5"> 
                <div className="flex items-center justify-between">  {/* Flex row with gap between elements */}
                    <p className="text-xl text-left font-semibold">Assignments</p>  {/* Left-aligned text */}
                    <Link href={{ pathname: `${course_id}/create-assignment` }}>  {/* Link containing the button */}
                        <button className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
                        Add assignment
                        </button>
                    </Link>
                </div>
            </div>
            <div className="light-grey flex-grow p-6"> 
                <ListAsgn course_id={course_id} />
            </div>
        </div>
    </div>
</div>
</>)}
</main>
    );
}


