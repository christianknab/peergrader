"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { LoadingSpinner } from './loadingSpinner';


interface CourseData {
    course_id: string;
    name: string;
}

export default function ListCourses() {
    const supabase = createClient();
    const [userCourses, setUserCourses] = useState<CourseData[]>([]);

    const {
        data: currentUser,
        isLoading,
        isError
    } = useCurrentUserQuery();



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
            const { data, error } = await supabase.rpc('get_courses_student', { user_id_param: userId });
            if (error) {
                console.error('Error fetching courses:', error);
                return;
            }
            return data;
        }
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <div>Error</div>;
    }
    return (
        <div>
            <ul>
                {userCourses.map((courseData) => (
                    <li key={courseData.course_id} className="text-xl font-bold">
                        <Link href={{ pathname: `/courses/${courseData.course_id}` }}>
                            {courseData.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}