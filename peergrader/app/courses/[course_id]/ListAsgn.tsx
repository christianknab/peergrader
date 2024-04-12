"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface AsgnData {
    asgn_id: string;
    name: string;
}


export default function ListAsgn({ course_id }: { course_id: string }) {
    const supabase = createClient();
    const [asgns, setAsgns] = useState<AsgnData[]>([]);

    useEffect(() => {
        fetchAsgns(course_id).then(setAsgns);
    }, [course_id]);

    async function fetchAsgns(course_id: string) {
        const { data, error } = await supabase
            .from('assignments')
            .select('asgn_id, name')
            .eq('course_id', course_id);

        if (error) {
            console.error('Error fetching user files:', error);
            return [];
        }

        return data;
    }


    return (
        <div>
            <ul>
                {asgns.map((asgnData) => (
                    <li key={asgnData.asgn_id}>
                        <Link
                            href={{
                                pathname: `/courses/${course_id}/${asgnData.asgn_id}`,
                            }}>
                            {asgnData.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}