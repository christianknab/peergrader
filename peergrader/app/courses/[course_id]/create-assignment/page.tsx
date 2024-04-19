'use client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AssignmentForm } from './AssignmentForm';

interface Rubric {
    names: string[];
    descriptions: string[];
    row_points: number[];
    col_points: number[];
}

export default function CreateAssignmentPage() {
    const supabase = createClient();
    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError
    } = useCurrentUserQuery();

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [rubric, setRubric] = useState<Rubric[]>([]);

    useEffect(() => {
        const fetchRubric = async () => {
            try {
                const { data, error } = await supabase.rpc('get_rubric');
                console.log(data);
                if (error) {
                    throw new Error('Error fetching rubric');
                }
                
                setRubric(data);
            } catch (error) {
                console.error('Error fetching rubric:', error);
            }
        };

        fetchRubric();
    }, []);

    const handleSubmit = async (assignmentName: string, editedRubric: Rubric[]) => {
        if (currentUser) {
            try {
                setIsLoading(true);
                const { error } = await supabase.from('assignments').insert([
                    { name: assignmentName, owner: currentUser.uid, rubric: editedRubric },
                ]);

                if (error) {
                    console.error('Error creating assignment:', error);
                } else {
                    router.push('/courses');
                }
            } catch (error) {
                console.error('Error creating assignment:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isUserLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !currentUser) {
        return <div>Error</div>;
    }

    return (
        <div>
            <AssignmentForm onSubmit={handleSubmit} initialRubric={rubric} />
        </div>
    );
}