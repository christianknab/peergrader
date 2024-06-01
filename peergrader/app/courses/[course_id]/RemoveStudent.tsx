"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

interface RemoveStudentProps {
    showRemove: boolean;
    onClose: () => void;
    course_id: string;
    accountData: AccountData | undefined;
    onStudentRemoved: () => void;
}

interface AccountData {
    uid: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
}

export default function RemoveStudent({ showRemove, onClose, accountData, course_id, onStudentRemoved }: RemoveStudentProps) {
    if (!showRemove || !accountData) return null;
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    async function handleRemoveStudent(course_id: string, uid: string) {
        try {
            setIsLoading(true);

            const { error } = await supabase
                .from('account_courses')
                .delete()
                .eq('course_id', course_id)
                .eq('uid', uid);

            if (error) {
                console.error('Error removing student from course:', error);
                return;
            }
            onStudentRemoved();
            onClose();

        } catch (error) {
            console.error('Error removing student from course:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 relative max-w-md mx-auto">
                <button
                    className="absolute top-4 right-4 write-grey hover:text-gray-700 transition duration-150"
                    onClick={onClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <div className="flex flex-col items-center space-y-6">
                    <div className="text-center">
                        Remove {accountData.first_name} {accountData.last_name} ({accountData.email}) from this course?
                    </div>
                    <button className="py-2 px-6 rounded-md font-semibold text-white bg-red-500 hover:bg-red-600 transition duration-150"
                        onClick={() => handleRemoveStudent(course_id, accountData.uid)}>
                        {isLoading ? 'Loading...' : 'Remove'}
                    </button>
                </div>
            </div>
        </div>
    );
};

