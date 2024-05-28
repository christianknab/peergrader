'use client';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentListAsgn from './studentListAsgn';
import useCourseDataQuery from '@/utils/hooks/QueryCourseData';
import { LoadingSpinner } from '@/components/loadingSpinner';
import NavBar from '@/components/NavBar';


export default function StudentCoursePage() {
    const router = useRouter();
    const course_id = useParams().course_id as string;

    const {
        data: courseData,
        isLoading: courseDataLoading,
        isError: courseDataError
    } = useCourseDataQuery(course_id);
    if (courseDataLoading) { return <LoadingSpinner />; }
    if (courseDataError) { return <div>Error</div>; }

    return (
        <div className="w-full min-h-screen flex flex-col">
            <main className="flex-1 w-full">
                <NavBar courseName={courseData?.name} courseId={course_id} />
                <header>
                    <div className="w-4/5 mx-auto">
                        <h2 className=" bold-blue rounded-lg text-5xl font-bold text-left mb-6 p-14 text-white">
                            {courseData?.name || 'Course Page'}
                        </h2>
                    </div>
                </header>
                <div className="w-4/5 mx-auto">
                    <div className="flex gap-8">
                        <div className="flex flex-col w-full gap-6 h-full">
                            <div className="flex flex-col rounded-lg overflow-hidden flex-grow">
                                <div className="light-blue p-5">
                                    <p className="text-xl text-left font-semibold">Assignments</p>
                                </div>
                                < StudentListAsgn course_id={course_id} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
                <p>&copy;2024 PeerGrader</p>
            </footer>
        </div>
    );
}


