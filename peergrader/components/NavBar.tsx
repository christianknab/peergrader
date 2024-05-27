"use client";
import ProfileLink from "@/app/dashboard/ProfileLink";
import LogoutButton from "@/app/dashboard/ProfileLink";
import { useRouter } from "next/navigation";

export default function NavBar({ courseName, courseId, assignmentName, assignmentId }: { courseName?: string, courseId?: string, assignmentName?: string, assignmentId?: string }) {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="w-full">
            <div className="w-full flex justify-between items-center p-4 light-grey">
                <span className="font-bold text-lg">
                    <button
                        onClick={() => handleNavigation('/dashboard')}
                        className="hover:underline">
                        PeerGrader
                    </button>
                    {courseName && (
                        <>
                            <span className="mx-2 font-normal"> &#47; </span>
                            <button
                                onClick={() => handleNavigation(`/courses/${courseId}`)}
                                className="hover:underline">
                                {courseName}
                            </button>
                        </>
                    )}
                    {(assignmentName && courseName) && (
                        <>
                            <span className="mx-2 font-normal"> &#47; </span>
                            <button
                                onClick={() => handleNavigation(`/courses/${courseId}/${assignmentId}`)}
                                className="hover:underline">
                                {assignmentName}
                            </button>
                        </>
                    )}
                </span>
                <div className="pr-2"><ProfileLink /></div>

            </div>
        </div>
    );
}
