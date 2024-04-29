'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ListAsgn from '@/app/courses/[course_id]/ListAsgn';
import ListStudents from './ListStudents';
import { useRouter } from 'next/navigation';

interface CourseData {
    owner: string;
    name: string;
}

interface Assignments {
    asgn_id: string;
    name: string;
}

export default function StudentCoursePage() {
    const router = useRouter();
    const supabase = createClient();
    const params = useParams();
    const course_id = params.course_id as string;
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [assignments, setAssignments] = useState<Assignments[]>([]);

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

    useEffect(() => {
        async function fetchAssignments() {
            const { data, error } = await supabase
                .from('assignments')
                .select('asgn_id, name') 
                .eq('course_id', course_id);

            if (error) {
                console.error('Error fetching assignments:', error);
            } else {
                setAssignments(data);
            }
        }

        if (course_id) {
            fetchAssignments();
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
                            {assignments && assignments.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {assignments.map((assignment) => (
                                        <div key={assignment.asgn_id} className="rounded-lg border p-4 bg-white shadow">
                                            <Link href={`/courses/${course_id}/${assignment.asgn_id}`}
                                                className="block text-left text-lg font-semibold hover:text-blue-700">
                                                    {assignment.name}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No assignments to display.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}


