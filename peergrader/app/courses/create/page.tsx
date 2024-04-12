'use client';
import { useUser } from '@/utils/providers/UserDataProvider';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function CreateCoursePage() {
    const supabase = createClient();
    const userContext = useUser();
    const router = useRouter()
    if (!userContext) {
        return <div>Loading...</div>;
    }
    const { currentUser } = userContext;
    if (!currentUser) {
        return <div>Loading...</div>;
    }
    const [courseName, setCourseName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createCourse = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.from('courses').insert([
                { name: courseName, owner: currentUser.uid },
            ]);

            if (error) {
                console.error('Error creating course:', error);
            }
            router.push('/courses')
        } catch (error) {
            console.error('Error creating course:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Course Page</h1>
            <div>
                <label htmlFor="courseName">Course Name:</label>
                <input
                    type="text"
                    placeholder="Enter course name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                />
                <button onClick={createCourse} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Create Course'}
                </button>
            </div>
        </div>
    );
}