'use client';
import useCurrentUserQuery from '@/utils/hooks/CurrentUser';
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

                // Insert into 'assignments' table
                const { data: assignmentData, error: assignmentError } = await supabase
                    .from('assignments')
                    .insert([
                        { name: assignmentName, owner: currentUser.uid },
                    ]).select();

                if (assignmentError) {
                    throw new Error(`Error creating assignment: ${assignmentError.message}`);
                }
                
                const assignmentId = assignmentData[0].asgn_id;  // Assuming 'asgn_id' is the name of the ID field in your assignments table

                // For each rubric entry, insert a row in 'rubrics' and 'rubric_cols'
            for (const rubric of editedRubric) {
                // Insert columns first to generate IDs
                const rubricColsInserts = rubric.descriptions.map((description, index) => ({
                    asgn_id: assignmentId,
                    descriptions: [description], // Each entry as an array
                    col_points: [rubric.col_points[index]],
                }));

                const { data: colsData, error: rubricColsError } = await supabase
                    .from('rubric_cols')
                    .insert(rubricColsInserts).select();

                if (rubricColsError) {
                    throw new Error(`Error inserting rubric cols: ${rubricColsError.message}`);
                }

                if (!colsData || colsData.length === 0) {
                    throw new Error('Rubric columns data not returned');
                }

                // Extracting column IDs for rubric entry
                const colIds = colsData.map(col => col.id);

                // Now insert the rubric row with collected column IDs
                const { error: rubricError } = await supabase
                    .from('rubrics')
                    .insert({
                        asgn_id: assignmentId,
                        row_ids: colIds,
                        names: rubric.names,
                        row_points: rubric.row_points,
                    });

                if (rubricError) {
                    throw new Error(`Error inserting rubric: ${rubricError.message}`);
                }
            }

                // If everything goes well, redirect the user
                router.push('/courses');
            } catch (error) {
                console.error('Error in the process:', error);
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