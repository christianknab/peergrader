"use client";
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';

interface ClassData {
    class_id: string;
    name: string;
}

export default function UserClassesList({ user }: { user: User }) {
    const [userClasses, setUserClasses] = useState<ClassData[]>([]);

    useEffect(() => {
        fetchUserClasses(user.id).then(setUserClasses);
    }, [user.id]);

    async function fetchUserClasses(userId: string) {
        const { data, error } = await supabase
            .from('account_classes')
            .select('class_id')
            .eq('uid', userId);

        if (error) {
            console.error('Error fetching user classes:', error);
            return [];
        }

        const classIds = data.map((row) => row.class_id);

        const { data: classesData, error: classesError } = await supabase
            .from('classes')
            .select('class_id, name')
            .in('class_id', classIds);

        if (classesError) {
            console.error('Error fetching class names:', classesError);
            return [];
        }

        return classesData;
    }

    return (
        <div>
            <h3>Your Classes:</h3>
            <ul>
                {userClasses.map((classData) => (
                    <li key={classData.class_id}>
                        <Link
                            href={{
                                pathname: '/dashboard/classes',
                                query: { class: classData.class_id },
                            }}
                        >
                            {classData.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}