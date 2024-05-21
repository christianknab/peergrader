"use client";

import useCurrentUserMutation from "@/utils/hooks/MutateCurrentUser";
import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";
import Image from 'next/image';
import useUserCoursesQuery from "@/utils/hooks/QueryUserCourses";
import Link from "next/link";

export default function EditAccountClient() {
    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError: isUserError
    } = useCurrentUserQuery();
    const {
        data: userCourses,
        isLoading: isUserCourseLoading,
        isError: isUserCourseError,
    } = useUserCoursesQuery(currentUser?.uid, !!currentUser);

    const currentUserMutation = useCurrentUserMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const accountType = formData.get("account_type") as "student" | "teacher";

        await currentUserMutation.mutateAsync({
            uid: currentUser?.uid,
            email: currentUser?.email!,
            first_name: firstName,
            last_name: lastName,
            is_teacher: accountType === "teacher"
        });
    };

    if (isUserLoading || isUserCourseLoading) {
        return <div>Loading...</div>;
    }

    if (isUserError || !currentUser || isUserCourseError || !userCourses) {
        return <div>Error</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center mb-8">
                <Image priority={true} src={'/assets/default_avatar.svg'} width={100} height={100} alt={""} />
                <h1 className="p-5 text-4xl font-bold">{currentUser?.first_name} {currentUser?.last_name}</h1>
            </div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <form onSubmit={handleSubmit}>
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
                                defaultValue={currentUser?.first_name}
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
                                defaultValue={currentUser?.last_name}
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
                                value={currentUser?.email}
                            />
                        </div>
                        {currentUser.is_teacher == null && <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Account Type
                            </label>
                            <select name="account_type" defaultValue={currentUser.is_teacher ? "teacher" : "student"} className="rounded-lg block w-full p-2.5">
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>}
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save
                        </button>
                    </div>
                </form>
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