import ListAllAsgn from "@/components/ListAllAsgn";
import ListCourses from "@/components/ListCourses";
import '@fortawesome/fontawesome-free/css/all.css';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { useRouter } from 'next/navigation';

interface CourseData {
    course_id: string;
    name: string;
}

export default function ListCourses() {
    const router = useRouter();
    const supabase = createClient();
    const [userCourses, setUserCourses] = useState<CourseData[]>([]);

    const { 
        data: currentUser, 
        isLoading, 
        isError 
      } = useCurrentUserQuery();
     
      if (isLoading) {
        return <div>Loading...</div>;
      }
     
      if (isError) {
        return <div>Error</div>;
      }

    useEffect(() => {
        if (currentUser) {
        fetchUserCourses(currentUser.uid).then(setUserCourses);
        }
    }, [currentUser]);

    async function fetchUserCourses(userId: string) {
        if (currentUser?.is_teacher) {
            const { data, error } = await supabase
                .from('courses')
                .select('course_id, name')
                .eq('owner', currentUser.uid)

            if (error) {
                console.error('Error fetching course names:', error);
                return [];
            }

            return data;
        }
        else {
            const { data, error } = await supabase
                .from('account_courses')
                .select('course_id')
                .eq('uid', userId);

            if (error) {
                console.error('Error fetching user courses:', error);
                return [];
            }

            const courseIds = data.map((row) => row.course_id);

            const { data: coursesData, error: coursesError } = await supabase
                .from('courses')
                .select('course_id, name')
                .in('course_id', courseIds);

            if (coursesError) {
                console.error('Error fetching course names:', coursesError);
                return [];
            }

            return coursesData;
        }
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-white">
            <header className="w-full py-3">
                <h1 className="text-5xl font-bold text-left pl-4 write-blue">Teacher Dashboard</h1>
                <hr className="my-2 border-t-2"></hr>
            </header>

        <main className="flex-1 w-full">
            <div className="p-8 flex gap-8">
                <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center light-blue p-5">
                            <Link
                                href="/courses"
                                className="text-xl text-left font-semibold write-blue"
                            >
                                Active Courses
                            </Link>
                            <button
                                className="bg-blue-500 text-white font-bold py-1 px-4 rounded hover:bg-btn-background-hover" 
                                onClick={() => router.push('/courses')}>
                                + Add Course  
                            </button>
                        </div>

                        <div className="min-h-[500px] light-white flex-grow p-6"> 
                            <div className="grid grid-cols-3 gap-8 flex-grow">  
                                        {userCourses.map((courseData) => (  
                                            <div key={courseData.course_id} className="rounded-lg border p-6 bg-white">
                                                <Link href={`/courses/${courseData.course_id}`}>  
                                                <div className="text-center"> 
                                                    <div className="font-semibold light-grey"> 
                                                        {courseData.name} 
                                                    </div>
                                                    <i className="fas fa-book text-5xl mt-8"></i>  
                                                </div>
                                                </Link>
                                            </div>
                                        ))}
                                </div> 
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow">
                        <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
                            <div className="light-blue p-5">
                            <p className="text-xl text-left write-blue font-semibold">Assignments</p>
                            </div>
                            <div className="light-white flex-grow p-6">
                            <ListAllAsgn />
                            </div>
                        </div>
                        <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
                            <div className="light-blue p-5">
                            <p className="text-xl text-left write-blue font-semibold">Analytics</p>
                            </div>
                            <div className="light-white flex-grow p-6"></div>
                        </div>
                    </div>
            </div>
        </main>

            <footer className="w-full font-bold light-grey p-4 bg-white text-center"> 
                <p>&copy;2024 PeerGrader</p>
            </footer>
        </div>
    );
}