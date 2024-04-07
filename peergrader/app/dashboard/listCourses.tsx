"use client";
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';

interface CourseData {
    course_id: string;
    name: string;
}

export default function UserCoursesList({ user }: { user: User }) {
    const [userCourses, setUserCourses] = useState<CourseData[]>([]);

    useEffect(() => {
        fetchUserCourses(user.id).then(setUserCourses);
    }, [user.id]);

    async function fetchUserCourses(userId: string) {
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

    return (
        <div>
            <h3>Your Courses:</h3>
            <ul>
                {userCourses.map((courseData) => (
                    <li key={courseData.course_id}>
                        <Link
                            href={{
                                pathname: '/courses',
                                query: { course: courseData.course_id },
                            }}
                        >
                            {courseData.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}