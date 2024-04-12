'use client';
import { useUser } from '@/utils/providers/UserDataProvider';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/dist/server/api-utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useContext, useState } from 'react';


export default function CreateAssignmentPage() {
    const supabase = createClient();
    const userContext = useUser();
    const { course_id } = useParams();

    if (!userContext) {
        return <div>Loading...</div>;
    }
    const { currentUser } = userContext;
    if (!currentUser) {
        return <div>Loading...</div>;
    }
    // const { id: courseId } = courseData;
    const [assignmentName, setCourseName] = useState('');

    // const createAssignmentClicked = () => {
    //     createAssignment();
    // }

    const createAssignment = async () => {
        try {
            const { data, error } = await supabase.from('assignments').insert([
                { name: assignmentName, owner: currentUser.uid, course_id: course_id },
            ]);

            if (error) {
                console.error('Error creating course:', error);
            } else {
                alert('course created');
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    return (
        <div>
            <h1>Create Assignment Page</h1>
            <div>
                <label htmlFor="assignmentName">Assignment Name:</label>
                <input
                    type="text"
                    id="assignmentName"
                    value={assignmentName}
                    onChange={(e) => setCourseName(e.target.value)}
                />
                <Link href={{ pathname: `/courses/${course_id}` }}><button onClick={createAssignment}>Create Assignment</button></Link>
            </div>
        </div>
    );
}