'use client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AssignmentForm } from './AssignmentForm';

export interface Rubric {
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

    // Set default start and end dates
    const defaultStartDate = new Date();
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 7);

    useEffect(() => {
        const fetchRubric = async () => {
            try {
                const { data, error } = await supabase.rpc('get_rubric', { asgn_id_param: "1" }); // hardcoded to 1 to get default rubric
                console.log('data:', data);
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

    const handleSubmit = async (assignmentName: string, editedRubric: Rubric[], anonymousGrading: boolean, startSubmitDate: Date, endSubmitDate: Date, startGradeDate: Date, endGradeDate: Date, max_score: number, num_peergrades: number) => {
        if (currentUser) {
            try {
                setIsLoading(true);

                // Upload assignment and get the asgnId
                var bcrypt = require('bcryptjs');
                let asgn_id: string = await bcrypt.hash(`${new Date().toISOString()}${assignmentName}${params.courseid}${currentUser.uid}`, 5);
                asgn_id.replace(/[^a-zA-Z0-9]/g, 'p');
                const { data: assignmentData, error: assignmentError } = await supabase
                    .from('assignments')
                    .insert([
                        { asgn_id: asgn_id, name: assignmentName, owner: currentUser.uid, course_id: params.course_id, anonymous_grading: anonymousGrading, start_date_submission: startSubmitDate, end_date_submission: endSubmitDate, start_date_grading: startGradeDate, end_date_grading: endGradeDate, max_score: max_score, num_peergrades: num_peergrades },
                    ]).select();

                if (assignmentError) {
                    throw new Error(`Error creating assignment: ${assignmentError.message}`);
                }

                const assignmentId: string = assignmentData[0].asgn_id;
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
        <main>
            <div className="w-full flex justify-between items-center p-4 light-grey">
                <button
                    className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
                    onClick={() => router.back()}>
                    Return to Home
                </button>
                <span className="font-bold text-lg">PeerGrader</span>
            </div>
            <div className="px-12">
                <AssignmentForm
                    onSubmit={handleSubmit}
                    initialRubric={rubric}
                    anonymousGrading={true}
                    startDate={defaultStartDate}
                    endDate={defaultEndDate}
                    startTime="00:00"
                    endTime="23:59"
                />
            </div>
            <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
                <p>&copy;2024 PeerGrader</p>
            </footer>
        </main>
    );
}