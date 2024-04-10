'use client';
import UserCoursesList from '@/components/listCourses';
import { useUser } from '@/utils/providers/UserDataProvider';
import Link from 'next/link';

export default async function CoursesPage() {
    const userContext = useUser();
    if (!userContext) {
        return <div>Loading...</div>;
    }
    const { currentUser } = userContext;
    if (!currentUser) {
        return <div>Loading...</div>;
    }
    if (currentUser.is_teacher) {
        return (
            <div>
                <h1>Courses Page</h1>
                <UserCoursesList />
                <Link
                    href={{
                        pathname: '/courses/create',
                    }}
                >{<h2 className="font-bold text-4xl mb-4">Create new course</h2>}</Link>
            </div>
        );
    }
    else return (
        <div>
            <h1>Courses Page</h1>
            <UserCoursesList />
        </div>
    );
}