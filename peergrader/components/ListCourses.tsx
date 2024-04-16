"use client"; 
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/utils/providers/UserDataProvider';

interface CourseData {
    course_id: string;
    name: string;
}

export default function ListCourses() {
    const supabase = createClient();
    const userContext = useUser();
    const [userCourses, setUserCourses] = useState<CourseData[]>([]);

    useEffect(() => {
        if (userContext?.currentUser) {
        fetchUserCourses(userContext.currentUser.uid).then(setUserCourses);
        }
    }, [userContext?.currentUser]);

    async function fetchUserCourses(userId: string) {
        if (userContext?.currentUser?.is_teacher) {
            const { data, error } = await supabase
                .from('courses')
                .select('course_id, name')
                .eq('owner', userContext?.currentUser.uid)

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