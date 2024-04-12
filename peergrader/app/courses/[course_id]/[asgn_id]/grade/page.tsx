'use client'
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function FilesPage() {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner');
    const file_id = searchParams.get('file_id');
    const filename = searchParams.get('filename');

    const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(`${owner}/${file_id}` || '');

    return (
        <div>
            <h1>{filename}</h1>
            {filename ? (
                <div style={{ height: '90vh', width: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <iframe
                        src={publicUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            overflow: 'hidden',
                        }}
                    >
                        This browser does not support PDFs. Please download the PDF to view it:{' '}
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                            Download PDF
                        </a>
                    </iframe>
                </div>
            ) : (
                <p>Loading file...</p>
            )}
        </div>
    );
};
