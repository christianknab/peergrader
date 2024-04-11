'use client';
import { useUser } from '@/utils/providers/UserDataProvider';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';


export default function CreateCoursePage() {
    const supabase = createClient();
    const userContext = useUser();
    if (!userContext) {
        return <div>Loading...</div>;
    }
    const { currentUser } = userContext;
    if (!currentUser) {
        return <div>Loading...</div>;
    }
    const [courseName, setCourseName] = useState('');

    const createCourse = async () => {
        try {
            const { data, error } = await supabase.from('courses').insert([
                { name: courseName, owner: currentUser.uid },
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
            <h1>Create Course Page</h1>
            <div>
                <label htmlFor="courseName">Course Name:</label>
                <input
                    type="text"
                    id="courseName"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                />
                <button onClick={createCourse}>Create Course</button>
            </div>
        </div>
    );
}