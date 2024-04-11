'use client';
import { useUser } from '@/utils/providers/UserDataProvider';
import { createClient } from '@/utils/supabase/client';
import { useContext, useState } from 'react';


export default function CreateAssignmentPage() {
    const supabase = createClient();
    const userContext = useUser();

    if (!userContext) {
        return <div>Loading...</div>;
    }
    const { currentUser } = userContext;
    if (!currentUser) {
        return <div>Loading...</div>;
    }
    // const { id: courseId } = courseData;
    const [assignmentName, setCourseName] = useState('');

    

    const createAssignment = async () => {
        try {
            const { data, error } = await supabase.from('assignments').insert([
                { name: assignmentName, owner: currentUser.uid},
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
                <button onClick={createAssignment}>Create Assignment</button>
            </div>
        </div>
    );
}