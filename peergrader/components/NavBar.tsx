"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileLink from "@/app/dashboard/ProfileLink";
import { createClient } from '@/utils/supabase/client';
import { useQueryClient } from "@tanstack/react-query";

export default function NavBar({ courseName, courseId, assignmentName, assignmentId, showProfile = true }: { courseName?: string, courseId?: string, assignmentName?: string, assignmentId?: string, showProfile?: boolean }) {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const supabase = createClient();
    const queryClient = useQueryClient();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        await queryClient.clear();
        router.push("/");
    };

    return (
        <div className="w-full">
            <div className="w-full flex justify-between items-center p-4 light-grey relative">
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
                {showProfile && <div className="relative pr-2">
                    <button onClick={toggleDropdown} className="focus:outline-none">
                        <ProfileLink />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                            <button
                                onClick={() => handleNavigation("/dashboard/edit-account")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                Profile
                            </button>
                            <button
                                onClick={signOut}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                Logout
                            </button>
                        </div>
                    )}
                </div>}

            </div>
        </div>
    );
}
