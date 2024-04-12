'use client';
import { useUser } from '@/utils/providers/UserDataProvider';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';


export default function CreateAssignmentPage() {
    const supabase = createClient();
    const userContext = useUser();
    const router = useRouter()
    const { course_id } = useParams();

    if (!userContext) {
        return <div>Loading...</div>;
    }
    const { currentUser } = userContext;
    if (!currentUser) {
        return <div>Loading...</div>;
    }
    const [assignmentName, setCourseName] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const createAssignment = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.from('assignments').insert([
                { name: assignmentName, owner: currentUser.uid, course_id: course_id },
            ]);

            if (error) {
                console.error('Error creating course:', error);
            } else {
                router.push(`/courses/${course_id}`);
            }
        } catch (error) {
            console.error('Error creating course:', error);
        } finally {
            setIsLoading(false);
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
                <button onClick={createAssignment} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Create Assignment'}
                </button>
            </div>
        </div>
    );
}