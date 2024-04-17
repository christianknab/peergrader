'use client';
import { useUser } from '@/utils/providers/UserDataProvider';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function CreateCoursePage() {
    const supabase = createClient();
    const userContext = useUser();
    const router = useRouter()
    const [courseName, setCourseName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createCourse = async () => {
        if (!userContext?.currentUser) {
            alert('You must be logged in');
            return;
        }

        try {
            setIsLoading(true);
            const { data, error } = await supabase.from('courses').insert([
                { name: courseName, owner: userContext?.currentUser.uid },
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
            <h1 className="text-5xl text-center font-bold mb-8 write-blue">Create Course Page</h1>
            <div className="flex items-center space-x-6">
                <label htmlFor="courseName">Course Name:</label>
                <input
                    type="text"
                    placeholder="Enter course name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="py-2 px-4 rounded-md"
                />
                <button className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
                    onClick={createCourse} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Create Course'}
                </button>
            </div>
        </div>
    );
}