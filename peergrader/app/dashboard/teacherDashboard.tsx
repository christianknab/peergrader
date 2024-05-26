"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import '@fortawesome/fontawesome-free/css/all.css';
import TeacherListAllAsgn from "./teacherListAllAsgn";
import { LoadingSpinner } from "@/components/loadingSpinner";
import CreateCourseForm from '../courses/create/page'; 

interface CourseData {
    course_id: string;
    name: string;
}

const TeacherDashboard: React.FC = () => {
    const router = useRouter();
    const supabase = createClient();
    const [userCourses, setUserCourses] = useState<CourseData[]>([]);
    const [showModal, setShowModal] = useState(false);

    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError
    } = useCurrentUserQuery();

    useEffect(() => {
        if (currentUser) {
            fetchUserCourses(currentUser.uid).then(setUserCourses);
        }
    }, [currentUser]);

    async function fetchUserCourses(userId: string) {
        const { data, error } = await supabase
            .from('courses')
            .select('course_id, name')
            .eq('owner', userId);

        if (error) {
            console.error('Error fetching course names:', error);
            return [];
        }

        return data;
    }

    const refreshCourses = async () => {
        if (currentUser) {
            const updatedCourses = await fetchUserCourses(currentUser.uid);
            setUserCourses(updatedCourses);
        }
    };

    if (isUserLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !currentUser) {
        return <div>Error</div>;
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-white">
            <header className="w-full py-3">
                <h1 className="text-5xl font-bold text-left pl-4 write-blue">Teacher Dashboard</h1>
                <hr className="my-1 border-t-2"></hr>
            </header>

            <main className="flex-1 w-full">
                <div className="px-4 py-0 flex gap-8">
                    <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
                        <div className="light-blue p-5">
                            <p className="text-xl text-left font-semibold write-grey">Assignments</p>
                        </div>
                        <div className="light-white flex-grow p-6">
                            <TeacherListAllAsgn />
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center light-blue p-5">
                            <Link
                                href="/courses"
                                className="text-xl text-left font-semibold write-grey"
                            >
                                Active Courses
                            </Link>
                            <button
                                className="bg-blue-500 text-white font-bold py-1 px-4 rounded hover:bg-btn-background-hover"
                                onClick={() => setShowModal(true)}>
                                + Add Course
                            </button>
                        </div>

                        <div className="min-h-[500px] light-white flex-grow p-6">
                            <div className="grid grid-cols-3 gap-8 flex-grow">
                                {userCourses.map((courseData) => (
                                    <div key={courseData.course_id} className="rounded-lg border p-6 bg-white">
                                        <Link href={`/courses/${courseData.course_id}`}>
                                            <div className="text-center">
                                                <div className="font-semibold light-grey">
                                                    {courseData.name}
                                                </div>
                                                <i className="fas fa-book text-5xl mt-8"></i>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full font-bold light-grey p-4 bg-white text-center">
                <p>&copy;2024 PeerGrader</p>
            </footer>

            <CreateCourseForm 
                showModal={showModal} 
                onClose={() => setShowModal(false)} 
                refreshCourses={refreshCourses} 
            />
        </div>
    );
}

export default TeacherDashboard;
