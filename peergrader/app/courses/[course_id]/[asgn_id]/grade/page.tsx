'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import useCurrentUserQuery from '@/utils/hooks/CurrentUser';

export default function FilesPage() {
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
    const [currentGrade, setCurrentGrade] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCurrentGrade = async () => {
            try {
                const { data, error } = await supabase
                    .from('grades')
                    .select('grade')
                    .eq('file_id', file_id)
                    .single();

                if (error) {
                    console.error('Error fetching current grade:', error);
                }
                if (data) {
                    setCurrentGrade(data.grade);
                    setGrade(data.grade);
                } else {
                    setCurrentGrade(null);
                }
            } catch (error) {
                console.error('Error fetching current grade:', error);
            }
        };

        fetchCurrentGrade();
    }, [file_id]);

    const handleSaveGrade = async () => {
        if (!currentUser) {
            alert('You must be logged in');
            return;
        }
        const graded_by = currentUser.uid;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('grades')
                .upsert({ file_id, grade, graded_by })
                .single();

            if (error) {
                console.error('Error writing to grades table:', error);
            } else {
                console.log('Grade saved successfully');
                setCurrentGrade(grade);
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
                            {/* get error here if this is un-commented */}
                            {/* <a href={publicUrl} target="_blank" rel="noopener noreferrer"> Download PDF </a> */}
                        </iframe>
                    </div>
                ) : (
                    <p>Loading file...</p>
                )}
            </div>
            <div style={{ width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    {currentGrade !== null ? (
                        <p>Current grade: {currentGrade}</p>
                    ) : (
                        <p>No grade yet</p>
                    )}
                    <input type="text" id="gradeInput" value={grade} onChange={(e) => setGrade(e.target.value)} />
                    <button onClick={handleSaveGrade} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Grade'}
                    </button>
                </div>
            </div>
        </div>
    );
}