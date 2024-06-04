'use client';
import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ListStudents from './ListStudents';
import { useRouter } from 'next/navigation';
import useCourseDataQuery from '@/utils/hooks/QueryCourseData';
import { LoadingSpinner } from '@/components/loadingSpinner';
import TeacherListAsgn from './teacherListAsgn';
import NavBar from '@/components/NavBar';
import ExportGrades from './ExportGrades';
import TeacherCourseSettings from './teacherCourseSettings';


export default function TeacherCoursePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const course_id = params.course_id as string;
    const tab = searchParams.get('tab');

    const {
        data: courseData,
        isLoading: courseDataLoading,
        isError: courseDataError
    } = useCourseDataQuery(course_id);
    if (courseDataLoading) { return <LoadingSpinner />; }
    if (courseDataError) { return <div>Error</div>; }

    const [activeTab, setActiveTab] = useState(tab ? tab : 'home');

    const TabHome = () => {
        return (
            <TeacherListAsgn course_id={course_id} />
        )
    };

    const TabStudents = () => {
        return (
            <ListStudents course_id={course_id} />
        );
    };

    const TabSettings = () => {
        return (
            <TeacherCourseSettings courseId={course_id} courseData={courseData} />
        );
    };

    const TabBar = () => {
        return (
            <div className="flex p-1 space-x-1">
                <button
                    className={`rounded px-4 py-2 font-medium write-grey ${activeTab === 'home' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('home')}
                >
                    Home
                </button>
                <button
                    className={`rounded px-4 py-2 font-medium write-grey ${activeTab === 'students' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('students')}
                >
                    Students
                </button>
                <button
                    className={`rounded px-4 py-2 font-medium write-grey ${activeTab === 'settings' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings
                </button>
            </div>
        );
    };

    const TabContent = () => {
        switch (activeTab) {
            case 'home':
                return <TabHome />;
            case 'students':
                return <TabStudents />;
            case 'settings':
                return <TabSettings />;
        }
    };


    return (
        <div className="w-full min-h-screen flex flex-col">
            <main className="flex-1 w-full">
                <NavBar courseName={courseData?.name} courseId={course_id} />
                <header>
                    <div className="w-4/5 mx-auto">

                        <h2 className="white-blue-gradient rounded-lg text-5xl font-bold text-left p-14 text-white">
                            {courseData?.name || 'Course Page'}
                        </h2>
                    </div>
                </header>
                <div className="w-4/5 mx-auto">
                    <TabBar />
                    <div className="flex gap-8">
                        <TabContent />
                    </div>
                </div>
            </main>
            <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
                <p>&copy;2024 PeerGrader</p>
            </footer>
        </div>
    );
}