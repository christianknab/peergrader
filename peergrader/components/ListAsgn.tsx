"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';


export default function ListAsgn({ course_id }: { course_id: string }) {
    const supabase = createClient();
    const [asgns, setAsgns] = useState<string[]>([]);

    useEffect(() => {
        fetchAsgns(course_id).then(setAsgns);
    }, [course_id]);

    async function fetchAsgns(course_id: string) {
        const { data, error } = await supabase
            .from('assignments')
            .select('asgn_id')
            .eq('course_id', course_id);

        if (error) {
            console.error('Error fetching user files:', error);
            return [];
        }

        return data.map((row) => row.asgn_id);
    }


    return (
        <div>
            <ul>
                {asgns.map((asgn_id) => (
                    <li key={asgn_id}>
                        <Link
                            href={{
                                pathname: `/courses/${course_id}/${asgn_id}`,
                            }}>
                            Asignment id: {asgn_id}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}