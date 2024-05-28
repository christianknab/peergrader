'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import ListStudents from './ListStudents';
import { useRouter } from 'next/navigation';
import useCourseDataQuery from '@/utils/hooks/QueryCourseData';
import { LoadingSpinner } from '@/components/loadingSpinner';
import TeacherListAsgn from './teacherListAsgn';
import NavBar from '@/components/NavBar';


export default function TeacherCoursePage() {
    const router = useRouter();
    const params = useParams();
    const course_id = params.course_id as string;
    const {
        data: courseData,
        isLoading: courseDataLoading,
        isError: courseDataError
    } = useCourseDataQuery(course_id);
    if (courseDataLoading) { return <LoadingSpinner />; }
    if (courseDataError) { return <div>Error</div>; }

    const [activeTab, setActiveTab] = useState('home');

    const TabHome = () => {
        return (
            < TeacherListAsgn course_id={course_id} />
        )
    };

    const TabStudents = () => {
        return (
            <ListStudents course_id={course_id} />
        );
    };

    const TabSettings = () => {
        return (
            <div>
                <div className="flex flex-col rounded-lg overflow-hidden">
                    <div className="light-blue p-5">
                        <p className="text-xl text-left font-semibold">Join Link</p>
                    </div>
                    <div className="light-grey flex-grow p-6">
                        http://localhost:3000/courses?code={courseData?.join_code} {/* TODO: change this domain and make copyable */}

                    </div>
                </div>
            </div>
        );
    };

    const TabBar = () => {
        return (
            <div className="flex">
                <button
                    className={`px-4 py-2 ${activeTab === 'home' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('home')}
                >
                    Home
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'students' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('students')}
                >
                    Students
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
                        <TabBar />
                        <h2 className=" bold-blue rounded-lg text-5xl font-bold text-left mb-6 p-14 text-white">
                            {courseData?.name || 'Course Page'}
                        </h2>
                    </div>
                </header>
                <div className="w-4/5 mx-auto">
                    <div className="flex gap-8">
                        <TabContent />
                    </div>
                </div>
                <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
                    <p>&copy;2024 PeerGrader</p>
                </footer>
            </main>
        </div>
    );
}