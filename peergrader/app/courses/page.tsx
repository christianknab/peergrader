'use client';
import ListCourses from '@/components/ListCourses';

import Link from 'next/link';
import JoinCourse from './JoinCourse';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import '@fortawesome/fontawesome-free/css/all.css';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/loadingSpinner';

export default function CoursesPage() {
    const router = useRouter();

    const { 
        data: currentUser, 
        isLoading: isUserLoading, 
        isError 
      } = useCurrentUserQuery();
     
      if (isUserLoading) {
        return <LoadingSpinner/>;
      }
     
      if (isError || !currentUser) {
        return <div>Error</div>;
      }
    
    if (currentUser)
        if (currentUser.is_teacher) {
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

                <main className="flex-1 w-1/2 mx-auto mb-10">
                    <div className="px-4 py-0 flex gap-8">
                    <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
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
                    </div>
                </main>

                <footer className="w-full font-bold light-grey p-4 bg-white text-center">
                    <p>&copy;2024 PeerGrader</p>
                </footer>
            </div>
            );
        }
        else return (
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
                    <h1 className="text-5xl font-bold text-left pl-4 write-blue">Student Dashboard</h1>
                    <hr className="my-1 border-t-2"></hr>
                </header>

                <main className="flex-1 w-1/2 mx-auto mb-10">
                    <div className="px-4 py-0 flex gap-8">
                    <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center light-blue p-5">
                            <Link
                                href="/courses"
                                className="text-2xl text-left font-semibold write-grey"
                            >
                                Join a Course
                            </Link>
                            <JoinCourse />
                        </div>

                        <div className="min-h-[500px] light-white flex-grow p-6 items-center">
                            <div className="my-18">
                                <ListCourses /> 
                            </div>
                        </div>
                    </div>
                    </div>
                </main>

                <footer className="w-full font-bold light-grey p-4 bg-white text-center">
                    <p>&copy;2024 PeerGrader</p>
                </footer>
            </div>
  );
}

