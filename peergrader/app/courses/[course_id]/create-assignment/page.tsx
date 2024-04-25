'use client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
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
    const params = useParams();

    useEffect(() => {
        const fetchRubric = async () => {
            try {
                const { data, error } = await supabase.rpc('get_rubric', { asgn_id_param: 1 }); // hardcoded to 1 to get default rubric
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

                // Upload assignment and get the asgnId
                const { data: assignmentData, error: assignmentError } = await supabase
                    .from('assignments')
                    .insert([
                        { name: assignmentName, owner: currentUser.uid, course_id: params.course_id },
                    ]).select();

                if (assignmentError) {
                    throw new Error(`Error creating assignment: ${assignmentError.message}`);
                }

                const assignmentId = assignmentData[0].asgn_id;
                const colIds = [];
                const rowNames = [];
                const rowPoints = [];

                // Loop through all rows of the rubric
                for (const row of editedRubric) {
                    
                    // Upload all the columns and get their respective col ids
                    const { data: colsData, error: rubricColsError } = await supabase
                        .from('rubric_cols')
                        .insert({
                            asgn_id: assignmentId,
                            descriptions: row.descriptions,
                            col_points: row.col_points,
                        }).select();

                    if (rubricColsError) {
                        throw new Error(`Error inserting rubric cols: ${rubricColsError.message}`);
                    }

                    if (!colsData || colsData.length === 0) {
                        throw new Error('Rubric columns data not returned');
                    }

                    // Collect all the column ids
                    colIds.push(...colsData.map(col => col.id));
                    rowNames.push(row.names[0]);
                    rowPoints.push(row.row_points[0]);
                }

                // Now insert the rubric row with collected column IDs
                const { error: rubricError } = await supabase
                .from('rubrics')
                .insert({
                    asgn_id: assignmentId,
                    row_ids: colIds,
                    names: rowNames,
                    row_points: rowPoints,
                });

            if (rubricError) {
                throw new Error(`Error inserting rubric: ${rubricError.message}`);
            }

                // If everything goes well, redirect the user
                router.push(`/courses/${params.course_id}`);
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