import UserCoursesList from "@/components/listCourses";
import { useUser } from "@/utils/providers/UserDataProvider";
import Link from "next/link";

export default async function TeacherDashboardPage() {
    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="w-full">
                <div className="py-6 font-bold bg-purple-950 text-center">
                    Teacher dashboard
                </div>
                {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
    
                <AuthButton />
              </div>
            </nav> */}
            </div>

            <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">

                <main className="flex-1 flex gap-6">
                    {/* Left column*/}
                    <div className="flex-1">
                        <Link
                            href={{
                                pathname: '/courses',
                            }}
                        >{<h2 className="font-bold text-4xl mb-4">Courses</h2>}</Link>
                        <UserCoursesList />

                    </div>
                    {/* Right column*/}
                    <div className="flex-1">
                        <h2 className="font-bold text-4xl mb-4">Assignments</h2>


                    </div>
                </main>
            </div>

            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <p>
                    footer
                </p>
            </footer>
        </div>
    );
}
