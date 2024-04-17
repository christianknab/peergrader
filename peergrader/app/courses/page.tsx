'use client';
import ListCourses from '@/components/ListCourses';
import { useUser } from '@/utils/providers/UserDataProvider';
import Link from 'next/link';
import JoinCourse from './JoinCourse';

export default async function CoursesPage() {
    const userContext = useUser();
    
    if (userContext?.currentUser)
        if (userContext?.currentUser.is_teacher) {
            return (
                <div>
                    <h1 className="text-5xl font-bold text-center mb-8 write-blue">Courses Page</h1>
                    <ListCourses />
                    <Link
                        href={{
                            pathname: '/courses/create',
                        }}
                    >{<button className="py-2 px-4 mt-8 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
                        Create new course</button>}
                    </Link>
                </div>
            );
        }
        else return (
            <div>
                <h1 className="text-5xl font-bold text-center mb-8 write-blue">Courses Page</h1>
                <div className="mb-4">
                    <ListCourses />
                </div>
                <JoinCourse />

                <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
                    <p>&copy;2024 PeerGrader</p>
                </footer>
            </div>
        );
}