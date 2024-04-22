"use client"; 
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';


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
        <div>
            <ul>
                {userCourses.map((courseData) => (
                    <li key={courseData.course_id}>
                        <Link href={{ pathname: `/courses/${courseData.course_id}` }}>
                            {courseData.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}