"use client";

import SingleLineInputField from "@/components/SingleLineInputFeild";
import { SubmitButton } from "@/components/submit-button";
import useCurrentUserMutation from "@/utils/hooks/MutateCurrentUser";
import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";
import SetUser from "@/utils/queries/SetUser";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from 'next/image';
import useUserCoursesQuery from "@/utils/hooks/QueryUserCourses";
import Link from "next/link";
import { LoadingSpinner } from "@/components/loadingSpinner";

export default function EditAccountClient() {
    const { data: currentUser, isLoading, isError } = useCurrentUserQuery();
    const {
        data: userCourses,
        isLoading: isUserCourseLoading,
        isError: isUserCourseError,
    } = useUserCoursesQuery(currentUser?.uid);
    if (isLoading) { return <LoadingSpinner/>; }
    if (isError) { return <div>Error</div>; }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center mb-8">
                <Image src={'/assets/default_avatar.svg'} width={100} height={100} alt={""} />
                {/* <img src="profile.jpg" alt="Profile Image" className="w-20 h-20 rounded-full mr-4"> */}
                <h1 className="p-5 text-4xl font-bold">{currentUser?.first_name} {currentUser?.last_name}</h1>
            </div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex mb-4">
                    <div className="pr-3"><label className="block text-gray-700 font-bold mb-2">
                        First Name
                    </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="First" value={currentUser?.first_name} /></div>
                    <div className="pr-3"><label className="block text-gray-700 font-bold mb-2">
                        Last Name
                    </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Last" value={currentUser?.last_name} /></div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="Email" value={currentUser?.email} />
                    </div>
                </div>
                <label className="block text-gray-700 font-bold mb-2">
                    Courses
                </label>
                <div>{userCourses?.course.map((courseData) => (
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
                ))}</div>
            </div>
        </div>
    );
}