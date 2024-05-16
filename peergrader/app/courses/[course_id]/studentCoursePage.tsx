'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentListAsgn from './StudentListAsgn';

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
        <div className="w-full min-h-screen flex flex-col">
            <main className="flex-1 w-full">
                <div className="w-full flex justify-between items-center p-4 light-grey">
                    <button 
                        className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
                        onClick={() => router.push('/dashboard')}>
                        Return to Dashboard
                    </button>
                    <span className="font-bold text-lg">PeerGrader</span>
                </div>
                <header>
                    <div className="w-4/5 mx-auto">
                        <nav className="rounded-md w-1/5 bg-light-grey">
                            <ul className="flex justify-between px-4 py-2">
                            <li><Link href={`/courses/${course_id}`} className="text-black hover:text-blue-800">Home</Link></li>
                            <li className="text-black hover:text-blue-800">Students</li>
                            <li className="text-black hover:text-blue-800">Grades</li>
                            </ul>
                        </nav>
                        <h2 className=" bold-blue rounded-lg text-5xl font-bold text-left mb-6 p-14 text-white">
                            {courseData?.name || 'Course Page'}
                        </h2>
                    </div>
                </header>
                <div className="w-4/5 mx-auto">
                    <div className="flex gap-8">
                        {/* <div className="flex flex-col w-1/3 rounded-lg overflow-hidden gap-6">
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
                        </div> */}

                        <div className="flex flex-col w-full gap-6 h-full">
                            <div className="flex flex-col rounded-lg overflow-hidden flex-grow"> 
                                <div className="light-blue p-5"> 
                                    <p className="text-xl text-left font-semibold">Assignments</p>
                                </div>
                                < StudentListAsgn course_id={course_id} /> 
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
                <p>&copy;2024 PeerGrader</p>
            </footer>
        </div>
    );
}


