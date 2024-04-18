"use client";
import useCurrentUserQuery from "@/utils/hooks/CurrentUser";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function JoinCourse() {
    const supabase = createClient();
    // const userContext = useUser();
    const { 
        data: currentUser, 
        isLoading: isUserLoading, 
        isError 
      } = useCurrentUserQuery();
     
      if (isUserLoading) {
        return <div>Loading...</div>;
      }
     
      if (isError || !currentUser) {
        return <div>Error</div>;
      }
    const [joinCode, setJoinCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function joinCourse() {
        try {
            setIsLoading(true);

            // Check if the course exists
            const { data, error } = await supabase
                .from('courses')
                .select('course_id, name')
                .eq('join_code', joinCode)
                .single();

            if (error) {
                console.error('Error checking course:', error);
                return;
            }

            if (!data.name) {
                console.error('No course found with the given course code:', joinCode);
                return;
            }

            // Add the user to the course
            const { error: insertError } = await supabase.from('account_courses').insert({
                course_id: data.course_id,
                uid: currentUser?.uid,
            });

            if (insertError) {
                console.error('Error adding user to course:', insertError);
                return;
            }

            window.location.reload();
        } catch (error) {
            console.error('Error joining course:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                placeholder="Enter class code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="py-2 px-4 rounded-md"
            />
            <button className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
                onClick={joinCourse}
                disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Join Class'}
            </button>
        </div>
    );
}