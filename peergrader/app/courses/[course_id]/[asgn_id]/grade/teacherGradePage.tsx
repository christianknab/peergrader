'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import useCurrentUserQuery from '@/utils/hooks/CurrentUser';
import ListGrades from '@/components/ListGrades';

export default function TeacherGradePage() {
    const {
        data: currentUser,
        isLoading,
        isError
    } = useCurrentUserQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    const supabase = createClient();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner');
    const file_id = searchParams.get('file_id');
    const filename = searchParams.get('filename');
    const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(`${owner}/${file_id}` || '');
    const [grade, setGrade] = useState('');
    const [currentFinalGrade, setcurrentFinalGrade] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCurrentFinalGrade = async () => {
            try {
                const { data, error } = await supabase
                    .from('submissions')
                    .select('final_grade')
                    .eq('file_id', file_id)
                    .single();

                if (error) {
                    console.error('Error fetching current grade:', error);
                }
                if (data) {
                    setcurrentFinalGrade(data.final_grade);
                } else {
                    setcurrentFinalGrade(null);
                }
            } catch (error) {
                console.error('Error fetching current grade:', error);
            }
        };

        fetchCurrentFinalGrade();
    }, [file_id]);

    const handleSaveGrade = async () => {
        if (!currentUser) {
            alert('You must be logged in');
            return;
        }

        const graded_by = currentUser.uid;
        setLoading(true);

        try {
            // Save the final grade
            const { data, error } = await supabase
                .from('submissions')
                .upsert({ file_id, final_grade: grade })
                .single();

            if (error) {
                console.error('Error writing to grades table:', error);
            } else {
                console.log('Grade saved successfully');
                setcurrentFinalGrade(grade);
                setGrade('');
            }
        } catch (error) {
            console.error('Error writing to grades table:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
            <div style={{ width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {filename ? (
                    <div style={{ height: '90vh', width: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <iframe src={publicUrl} style={{ width: '100%', height: '100%', border: 'none', overflow: 'hidden' }}>
                            This browser does not support PDFs. Please download the PDF to view it:
                            <a href={publicUrl} target="_blank" rel="noopener noreferrer"> Download PDF </a>
                        </iframe>
                    </div>
                ) : (
                    <p>Loading file...</p>
                )}
            </div>
            <div style={{ width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    < ListGrades file_id={file_id as string} />
                    {currentFinalGrade !== null ? (
                        <p>Current final grade: {currentFinalGrade}</p>
                    ) : (
                        <p>No grade yet</p>
                    )}
                    <input type="text" id="gradeInput" value={grade} onChange={(e) => setGrade(e.target.value)} />
                    <button onClick={handleSaveGrade} disabled={loading}>
                        {loading ? 'Saving...' : 'update final grade'}
                    </button>
                </div>
            </div>
        </div>
    );
}