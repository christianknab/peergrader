"use client";
import { useState } from 'react';
import { uploadFile } from "@/utils/uploadFile";
import { useUser } from '@/utils/providers/UserDataProvider';


export default function UploadButton({ asgn_id }: { asgn_id: string }) {
    const userContext = useUser();
    if (!userContext) {
        return <div>Loading...</div>;
    }
    const { currentUser } = userContext;
    if (!currentUser) {
        return <div>Loading...</div>;
    }
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null) {
            alert('No file selected.');
            return;
        }
        setSelectedFile(event.target.files[0]);
    };

    const onFileUpload = async () => {
        if (!selectedFile) {
            alert('No file selected.');
            return;
        }

        setIsLoading(true);

        // Call the upload function
        try {
            const { success } = await uploadFile(selectedFile, currentUser.uid, asgn_id);

            if (!success) {
                alert('Error uploading file.');
                return;
            }

            setSelectedFile(null);
            window.location.reload();
        } catch (error) {
            console.error("Error uploading file: ", error);
            alert('Error uploading file.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            <div></div>
            <button onClick={onFileUpload} disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
}
