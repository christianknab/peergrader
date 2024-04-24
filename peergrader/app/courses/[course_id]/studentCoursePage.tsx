'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import ListAsgn from '@/app/courses/[course_id]/ListAsgn';
import ListStudents from './ListStudents';
import { useRouter } from 'next/navigation';
import ListAllAsgn from "@/components/ListAllAsgn";

interface CourseData {
    owner: string;
    name: string;
}

export default function StudentCoursePage() {
    const router = useRouter();
    const supabase = createClient();
    const params = useParams();
    const course_id = params.course_id as string;
    const [courseData, setCourseData] = useState<CourseData | null>(null);

    useEffect(() => {
        async function fetchCourseData() {
            try {
                const { data, error } = await supabase
                    .from('courses')
                    .select('owner, name')
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
        <main className="flex-1 w-full">
            <div className="flex gap-8">
                <div className="flex flex-col w-1/3 rounded-lg overflow-hidden gap-6"> 
                    <div className="flex flex-col rounded-lg overflow-hidden"> 
                        <div className="light-blue p-5">
                            <p className="text-xl text-left font-semibold">Students</p>
                        </div>
                        <div className="light-grey flex-grow p-6"> 
                            <ListStudents course_id={course_id} />
                        </div>
                    </div>

                    <div className="flex flex-col rounded-lg overflow-hidden"> 
                        <div className="light-blue p-5">
                            <p className="text-xl text-left font-semibold">Grades</p>
                        </div>
                        <div className="light-grey flex-grow p-6"> 
                            Grades
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-2/3 gap-6 h-full"> 
                    <div className="flex flex-col rounded-lg overflow-hidden flex-grow"> 
                        <div className="light-blue p-5"> 
                            <p className="text-xl text-left font-semibold">Assignments</p>
                        </div>
                        <div className="light-grey flex-grow p-6"> 
                            <ListAsgn course_id={course_id} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}


