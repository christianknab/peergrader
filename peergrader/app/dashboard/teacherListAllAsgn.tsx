"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

interface AsgnData {
    asgn_id: string;
    name: string;
    course_id: string;
}

export default function TeacherListAllAsgn() {
    const supabase = createClient();
    const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
    const [userAssignments, setUserAssignments] = useState<AsgnData[]>([]);

    useEffect(() => {
        fetchUserAssignments(currentUser?.uid).then(setUserAssignments);
    }, [currentUser]);

    async function fetchUserAssignments(userId: string) {
        const { data: courses, error: coursesError } = await supabase
            .from('courses')
            .select('course_id')
            .eq('owner', userId);

        if (coursesError) {
            console.error('Error fetching user courses:', coursesError);
            return [];
        }

        const courseIds = courses.map((row) => row.course_id);

        const { data, error } = await supabase
            .from('assignments')
            .select('asgn_id, name, course_id')
            .in('course_id', courseIds);

        if (error) {
            console.error('Error fetching user assignments:', error);
            return [];
        }

        return data;
    }

    return (
        <div className="light-grey flex-grow p-6">
            {userAssignments && userAssignments.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {userAssignments.map((asgnData) => (
                        <Link
                            key={asgnData.asgn_id}
                            href={`/courses/${asgnData.course_id}/${asgnData.asgn_id}`}
                            className="block"
                        >
                            <div className="rounded-lg border p-4 bg-white shadow hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">{asgnData.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p>No assignments to display.</p>
            )}
        </div>
    );
}