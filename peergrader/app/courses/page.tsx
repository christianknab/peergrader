"use client";

import { useState, useEffect, Suspense } from 'react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { LoadingSpinner } from '@/components/loadingSpinner';
import NavBar from '@/components/NavBar';
import GetCourseInfo from '@/utils/queries/GetCourseInfo';
import { createClient } from '@/utils/supabase/client';
import ProfileImage from '@/components/ProfileImage';

interface Course {
    course_id: string;
    name: string;
    number: string;
    owner: string;
    start_date: string;
    end_date: string;
}

interface Owner {
    first_name: string;
    last_name: string;
    profile_image: string;
}

interface CourseInfo {
    course: Course;
    owner: Owner;
}

export default function CoursesPage() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const joinCode = searchParams.get('code');
    const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    if (joinCode == null) {
        redirect('/dashboard');
    }

    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError
    } = useCurrentUserQuery();

    useEffect(() => {
        async function fetchCourseInfo() {
            if (!currentUser || !joinCode) {
                return;
            }

            try {
                // TODO: PUT INTO A QUERY (also see joincourse component!)
                // Fetch course info
                const data = await GetCourseInfo(supabase, joinCode);
                setCourseInfo(data);

                // Check if user is enrolled in the course
                const { data: user, error } = await supabase
                    .from('account_courses')
                    .select('uid')
                    .eq('uid', currentUser.uid)
                    .eq('course_id', data.course.course_id)
                    .limit(1);

                if (error) {
                    console.error("Error checking account_courses:", error);
                } else if (user.length > 0) {
                    redirect('/dashboard');
                }
            } catch (err) {
                setError("Failed to fetch course information.");
            } finally {
                setLoading(false);
            }
        }

        if (!isUserLoading && !isError) {
            fetchCourseInfo();
        }
    }, [joinCode, currentUser, isUserLoading, isError]);

    if (isUserLoading || loading) {
        return <LoadingSpinner />;
    }

    if (isError || !currentUser || error) {
        return <div>Error: {error || "User information could not be loaded."}</div>;
    }

    if (currentUser?.is_teacher) {
        redirect('/dashboard');
    }

    if (!courseInfo) {
        return <div>No course information available.</div>;
    }

    const handleConfirm = async () => {
        try {
            // Add user to the course
            await supabase
                .from('account_courses')
                .insert({
                    uid: currentUser.uid,
                    course_id: courseInfo.course.course_id
                });
            router.push('/dashboard');
        } catch (error) {
            setError("Failed to confirm course enrollment.");
        }
    };

    const handleCancel = () => {
        router.push('/dashboard');
    };

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <main className="flex-1 w-full">
                <NavBar />
                <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Confirm Your Course Enrollment</h1>
                        <p className="text-gray-600 mb-6">Please confirm that you want to join the following course:</p>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Course Name:</label>
                            <p className="bg-gray-200 text-gray-800 rounded py-2 px-4">{courseInfo.course.name}</p>
                        </div>

                        {courseInfo.course.number && <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Course Number:</label>
                            <p className="bg-gray-200 text-gray-800 rounded py-2 px-4">{courseInfo.course.number}</p>
                        </div>}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Course Instructor:</label>
                            <div className="flex justify-between items-center bg-gray-200 text-gray-800 rounded py-2 px-4">
                                <span>{courseInfo.owner.first_name} {courseInfo.owner.last_name}</span>
                                <ProfileImage src={courseInfo.owner.profile_image} width={25} height={25} />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Term:</label>
                            <p className="bg-gray-200 text-gray-800 rounded py-2 px-4">{courseInfo.course.start_date} {`->`} {courseInfo.course.end_date}</p>
                        </div>

                        <div className="flex justify-end">
                            <button onClick={handleConfirm} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Confirm
                            </button>
                            <button onClick={handleCancel} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </Suspense >
    );
}
