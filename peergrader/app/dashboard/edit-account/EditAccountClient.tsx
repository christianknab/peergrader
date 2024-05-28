"use client";

import useCurrentUserMutation from "@/utils/hooks/MutateCurrentUser";
import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";
import useUserCoursesQuery from "@/utils/hooks/QueryUserCourses";
import Link from "next/link";
import { LoadingSpinner } from "@/components/loadingSpinner";
import getAuthUser from "@/utils/queries/GetAuthUser";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';
import ProfileImageEdit from "./ProfileImageEdit";
import CourseCard from "@/components/CourseCard";

export default function EditAccountClient() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>();
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [formEdited, setFormEdited] = useState(false);

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
    } = useUserCoursesQuery(currentUser?.uid, currentUser?.is_teacher, !!currentUser);

    const currentUserMutation = useCurrentUserMutation();

    async function _getAuthUser() {
        return await getAuthUser();
    }

    // not sure if this is good
    useEffect(() => {
        async function fetchProfileImage() {
            if (currentUser) {
                if (currentUser.profile_image == null) {
                    setProfileImageUrl(null);
                } else {
                    setProfileImageUrl(currentUser.profile_image);
                }
            }
        }
        _getAuthUser().then(setUser);
        fetchProfileImage();
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
            profile_image: profileImageUrl,
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
            profile_image: profileImageUrl,
        });
        setFormEdited(false);
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
                <ProfileImageEdit
                    src={currentUser?.profile_image || '/assets/default_avatar.svg'}
                    uid={currentUser?.uid}
                    setProfileImageUrl={setProfileImageUrl}
                />
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
                                onChange={() => setFormEdited(true)}
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
                                onChange={() => setFormEdited(true)}
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
                                onChange={() => setFormEdited(true)}
                            />
                        </div>
                        {currentUser?.is_teacher == null && <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Account Type
                            </label>
                            <select name="account_type" defaultValue={currentUser?.is_teacher ? "teacher" : "student"} className="rounded-lg block w-full p-2.5" onChange={() => setFormEdited(true)}>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>}
                    </div>

                    <div className="flex mb-4 items-center">
                        {formEdited ? (
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Save
                            </button>
                        ) : (
                            <div className="py-5"></div>
                        )}
                        {!currentUser && <div className="pl-2 text-red-500">You must choose an account type</div>}
                    </div>

                </form>
                <label className="block text-gray-700 font-bold mb-2">
                    {currentUser?.is_teacher ? `Your Courses` : `Enrolled Courses`}
                </label>
                {userCourses?.course.length == 0 && <button
                    className="bg-blue-500 text-white font-bold py-1 px-4 rounded hover:bg-btn-background-hover"
                    onClick={() => router.push('/courses')}>
                    + Add Course
                </button>}
                <div className="flex-grow p-6">
                    <div className="grid grid-cols-3 gap-8 flex-grow">
                        {userCourses?.course.map((courseData) => (
                            <CourseCard key={courseData.course_id} courseData={courseData} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}