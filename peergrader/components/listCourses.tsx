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
    if (!userContext) {
        return <div>Loading...</div>;
    }
    const { currentUser } = userContext;
    if (!currentUser) {
        return <div>Loading...</div>;
    }

    const [userCourses, setUserCourses] = useState<CourseData[]>([]);

    useEffect(() => {
        fetchUserCourses(currentUser.uid).then(setUserCourses);
    }, [currentUser.uid]);

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
            <h3>Your Courses:</h3>
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