'use client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import ListCourses from '@/components/ListCourses';


export default function CreateCoursePage() {
    const supabase = createClient();
    const { 
        data: currentUser, 
        isLoading: isUserLoading, 
        isError 
      } = useCurrentUserQuery();
     
      if (isUserLoading) {
        return <div>Loading...</div>;
      }
     
      if (isError || !currentUser) {
        return <div>Error</div>;
      }
    const router = useRouter()
    const [courseName, setCourseName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createCourse = async () => {
        if (!currentUser) {
            alert('You must be logged in');
            return;
        }

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
    <div className="flex flex-col min-h-screen w-full bg-white">
    <div className="w-full flex justify-between items-center p-4 light-grey">
        <button 
            className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
            onClick={() => router.push('/dashboard')}>
            Return to Dashboard
        </button>
        <span className="font-bold text-lg">PeerGrader</span>
    </div>

    <header className="w-full py-8">
        <h1 className="text-5xl font-bold text-left pl-4 write-blue">Teacher Dashboard</h1>
        <hr className="my-1 border-t-2"></hr>
    </header>

    <main className="flex-1 w-full mb-10 px-12">
        <div className="px-4 py-0 flex justify-center">
            <div className="flex flex-col flex-grow rounded-lg overflow-hidden w-3/4">
                <div className="flex justify-between items-center light-blue p-5">
                    <Link
                        href="/courses"
                        className="text-2xl text-left font-semibold write-grey"
                    >
                        Create a Course
                    </Link>
                    <Link
                        href={{
                            pathname: '/courses/create',
                        }}
                        >{<button className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
                            Create new course</button>}
                            </Link>

                </div>
                <div className="min-h-[500px] light-white flex-grow p-6 items-center">
                    <div className="my-18">
                        <ListCourses /> 
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-grow space-y-3 ml-10 p-5 bg-white rounded-lg overflow-hidden">
                <div className="flex items-center space-x-3">
                    <label htmlFor="courseName" className='font-bold'>Course Name:</label>
                    <input
                        type="text"
                        placeholder="Enter course name"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="py-2 px-4 rounded-md shadow-lg"
                    />
                </div>
                <button className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
                        onClick={createCourse} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Create Course'}
                    </button>
            </div>
        </div>
    </main>

    <footer className="w-full font-bold light-grey p-4 bg-white text-center">
        <p>&copy;2024 PeerGrader</p>
    </footer>
</div>
);
}

{/* <div>
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
        </div> */}