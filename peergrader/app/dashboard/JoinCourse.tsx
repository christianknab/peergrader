'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface JoinCourseProps {
    onClose: () => void;
}

const JoinCourse: React.FC<JoinCourseProps> = ({ onClose }) => {
    const router = useRouter();
    const supabase = createClient();
    const searchParams = useSearchParams();
    const [joinCode, setJoinCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [autoJoin, setAutoJoin] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const code = searchParams.get("code");
        if (code) {
            setJoinCode(code);
            setAutoJoin(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (joinCode !== '') {
            joinCourse();
        }
        queryClient.invalidateQueries({ queryKey: ['getCourses'] });
    }, [autoJoin]);

    async function joinCourse() {
        router.push(`/courses?code=${joinCode}`)
    }

    return (
        <div className="flex items-center space-x-3">
            <input
                type="text"
                placeholder="Enter class code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="py-2 px-4 rounded-md"
            />
            <div className="flex items-center space-x-1">
                <button className="py-2 px-4 rounded-md light-grey text-black font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
                    onClick={joinCourse}
                    disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Join Class'}
                </button>
                <button onClick={onClose} className="py-2 px-4 rounded-md font-bold no-underline bg-red-500 hover:bg-red-600 text-white">
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default JoinCourse;
