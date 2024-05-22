'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import ListGrades from '@/components/ListGrades';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/loadingSpinner';

export default function TeacherGradePage() {
    const {
        data: currentUser,
        isLoading,
        isError
    } = useCurrentUserQuery();

   

    const router = useRouter();
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
                const { data: average_grade, error: averageGradeError } = await supabase.rpc('calculate_average_grade', { file_id_param: file_id });

                if (averageGradeError) {
                    console.error('Error fetching current grade:', averageGradeError);
                }
                if (average_grade) {
                    setcurrentFinalGrade(average_grade);
                } else {
                    setcurrentFinalGrade(null);
                }
            } catch (error) {
                console.error('Error fetching current grade:', error);
            }
        };

        fetchCurrentFinalGrade();
    }, [file_id]);

    // TODO: this will be broken now, fix later
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
    if (isLoading) {
        return <LoadingSpinner/>;
    }

    if (isError) {
        return <div>Error</div>;
    }
    return (
        <main>
            <div className="w-full flex justify-between items-center p-4 light-grey">
                <button
                    className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
                    onClick={() => router.back()}>
                    Return to Assignment
                </button>
                <span className="font-bold text-lg">PeerGrader</span>
            </div>
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
                    <div className="flex1 items-center space-y-3">
                        < ListGrades file_id={file_id as string} />
                        {currentFinalGrade !== null ? (
                            <p>Current final grade: {currentFinalGrade}</p>
                        ) : (
                            <p>No grade yet</p>
                        )}
                        <div className="flex items-center space-x-4">
                            <input type="text" id="gradeInput" className="py-2 px-3 rounded-md" value={grade} onChange={(e) => setGrade(e.target.value)} />
                            <button 
                            onClick={handleSaveGrade} disabled={loading}
                            className="py-2 px-3 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
                                {loading ? 'Saving...' : 'update final grade'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
                <p>&copy;2024 PeerGrader</p>
            </footer>
        </main>
    );
}