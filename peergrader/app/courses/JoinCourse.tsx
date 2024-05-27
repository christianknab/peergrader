import { useState, useEffect } from "react";
import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

interface JoinCourseProps {
  onClose: () => void;
}

const JoinCourse: React.FC<JoinCourseProps> = ({ onClose }) => {
    const router = useRouter();
    const supabase = createClient();
    const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
    const searchParams = useSearchParams();
    const [joinCode, setJoinCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [autoJoin, setAutoJoin] = useState(false);

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
    }, [autoJoin]);

    async function joinCourse() {
        try {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('courses')
                .select('course_id, name')
                .eq('join_code', joinCode)
                .single();

            if (error) {
                console.error('Error checking course:', error);
                return;
            }

            if (!data) {
                console.error('No course found with the given course code:', joinCode);
                return;
            }

            const { error: insertError } = await supabase.from('account_courses').insert({
                course_id: data.course_id,
                uid: currentUser?.uid,
            });
            if (insertError) {
                console.error('Error adding user to course:', insertError);
                return;
            }
            setJoinCode('');
            const coursePageUrl = `/courses/${data.course_id}`
            router.push(coursePageUrl);

        } catch (error) {
            console.error('Error joining course:', error);
        } finally {
            setIsLoading(false);
        }
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
                <button className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
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
