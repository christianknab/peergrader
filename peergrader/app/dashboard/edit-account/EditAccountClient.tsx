"use client";

import useCurrentUserMutation from "@/utils/hooks/MutateCurrentUser";
import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";
import Image from 'next/image';
import useUserCoursesQuery from "@/utils/hooks/QueryUserCourses";
import Link from "next/link";
import { LoadingSpinner } from "@/components/loadingSpinner";
import getAuthUser from "@/utils/queries/GetAuthUser";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';

export default function EditAccountClient() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>();

    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError: isUserError,
        error: userError
    } = useCurrentUserQuery(false);

    const {
        data: userCourses,
        isLoading: isUserCourseLoading,
        isError: isUserCourseError,
        error: userCourseError,
    } = useUserCoursesQuery(currentUser?.uid, !!currentUser);

    const currentUserMutation = useCurrentUserMutation();

    async function _getAuthUser() {
        return await getAuthUser();
    }

    // not sure if this is good
    useEffect(() => {
        _getAuthUser().then(setUser)
    }, [currentUser]);

    const handleSubmitGoogleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const accountType = formData.get("account_type") as "student" | "teacher";

        let user = await getAuthUser();

        await currentUserMutation.mutateAsync({
            uid: user?.id ?? "",
            email: user?.email ?? "",
            first_name: firstName,
            last_name: lastName,
            is_teacher: accountType === "teacher",
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const accountType = formData.get("account_type") as "student" | "teacher";

        await currentUserMutation.mutateAsync({
            uid: currentUser?.uid,
            email: currentUser?.email,
            first_name: firstName,
            last_name: lastName,
            is_teacher: accountType === "teacher",
        });
    };

    if (isUserLoading || isUserCourseLoading) {
        return <LoadingSpinner />;
    }

    if (currentUser && (isUserCourseError || !userCourses)) {
        return <div>Error</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center mb-8">
                <Image priority={true} src={'/assets/default_avatar.svg'} width={100} height={100} alt={""} />
                <h1 className="p-5 text-4xl font-bold">{currentUser ? `${currentUser?.first_name} ${currentUser?.last_name}` : "Profile"}</h1>
            </div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <form onSubmit={currentUser ? handleSubmit : handleSubmitGoogleAuth}>
                    <div className="flex mb-4">
                        <div className="pr-3">
                            <label className="block text-gray-700 font-bold mb-2">
                                First Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                placeholder="First"
                                name="firstName"
                                defaultValue={currentUser ? currentUser.first_name : user?.user_metadata.full_name?.split(' ')[0]}
                            />
                        </div>
                        <div className="pr-3">
                            <label className="block text-gray-700 font-bold mb-2">
                                Last Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                placeholder="Last"
                                name="lastName"
                                defaultValue={currentUser ? currentUser.last_name : user?.user_metadata.full_name?.split(' ')[1]}
                            />
                        </div>
                        <div className="pr-3">
                            <label className="block text-gray-700 font-bold mb-2">
                                Email
                            </label>
                            <input
                                disabled={true}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="email"
                                placeholder="Email"
                                value={currentUser ? currentUser.email : user?.email}
                            />
                        </div>
                        {currentUser?.is_teacher == null && <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Account Type
                            </label>
                            <select name="account_type" defaultValue={currentUser?.is_teacher ? "teacher" : "student"} className="rounded-lg block w-full p-2.5">
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>}
                    </div>

                    <div className="flex mb-4 items-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Save
                        </button>
                        {!currentUser && <div className="pl-2 text-red-500">You must choose an account type</div>}
                    </div>
                </form>
                <label className="block text-gray-700 font-bold mb-2">
                    Courses
                </label>
                {userCourses?.course.length == 0 && <button
                    className="bg-blue-500 text-white font-bold py-1 px-4 rounded hover:bg-btn-background-hover"
                    onClick={() => router.push('/courses')}>
                    + Add Course
                </button>}
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