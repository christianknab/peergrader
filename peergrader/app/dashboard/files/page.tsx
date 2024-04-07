'use client'
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function FilesPage() {
    const searchParams = useSearchParams();
    const file = searchParams.get('file');

    const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(file || '');

    return (
        <div>
            <h1>File View</h1>
            {file ? (
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
