'use client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AssignmentForm } from './AssignmentForm';
import Link from 'next/link';
import useCourseDataQuery from '@/utils/hooks/QueryCourseData';
import { LoadingSpinner } from '@/components/loadingSpinner';
import NavBar from '@/components/NavBar';

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

    const course_id = params.course_id as string;
    const {
        data: courseData,
        isLoading: courseDataLoading,
        isError: courseDataError
    } = useCourseDataQuery(course_id);

    const handleSubmit = async (assignmentName: string, editedRubric: Rubric[], anonymousGrading: boolean, startSubmitDate: Date, endSubmitDate: Date, startGradeDate: Date, endGradeDate: Date, maxScore: number, numPeergrades: number, numAnnotations: number, numberInput: boolean, description: string) => {
        if (currentUser) {
            try {
                setIsLoading(true);

                // Upload assignment and get the asgnId
                var bcrypt = require('bcryptjs');
                let asgn_id: string = await bcrypt.hash(`${new Date().toISOString()}${assignmentName}${params.courseid}${currentUser.uid}`, 5);
                asgn_id = asgn_id.replace(/[^a-zA-Z0-9]/g, 'p');
                const { data: assignmentData, error: assignmentError } = await supabase
                    .from('assignments')
                    .insert([
                        {
                            asgn_id: asgn_id,
                            name: assignmentName,
                            owner: currentUser.uid,
                            course_id: params.course_id,
                            anonymous_grading: anonymousGrading,
                            start_date_submission: startSubmitDate,
                            end_date_submission: endSubmitDate,
                            start_date_grading: startGradeDate,
                            end_date_grading: endGradeDate,
                            max_score: maxScore,
                            num_peergrades: numPeergrades,
                            num_annotations: numAnnotations,
                            number_input: numberInput,
                            description: description
                        },
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

    if (isUserLoading || courseDataLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !currentUser || courseDataError) {
        return <div>Error</div>;
    }

    return (
        <main>
            <NavBar />
            <div className="w-4/5 mx-auto">
                <nav className="rounded-md w-1/5 bg-light-grey">
                    <ul className="flex justify-between px-4 py-2">
                        <li><Link href={`/courses/${course_id}`} className="text-black hover:text-blue-800">Home</Link></li>
                        <li className="text-black hover:text-blue-800">Students</li>
                        <li className="text-black hover:text-blue-800">Grades</li>
                    </ul>
                </nav>
                <header>
                    <h2 className="bold-blue rounded-lg text-5xl font-bold text-left mb-6 p-14 text-white">
                        {courseData?.name || 'Course Page'}
                    </h2>
                </header>
                <div className="flex flex-col flex-grow rounded-lg overflow-hidden shadow-lg">
                    <div className="light-blue p-5">
                        <p className="text-3xl text-center font-semibold text-white rounded-lg">Create Assignment</p>
                    </div>
                    <div className="light-white flex-grow p-6">
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
                </div>
            </div>
            <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
                <p>&copy;2024 PeerGrader</p>
            </footer>
        </main>
    );
}