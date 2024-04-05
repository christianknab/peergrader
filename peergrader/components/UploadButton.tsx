"use client";
import { useState } from 'react';
import { uploadFile } from "@/utils/supabase/uploadFile";

export default function UploadButton() {
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
        const bucket = "files"

        setIsLoading(true); // Start loading

        
        // Call the upload function
        try {
            const { success, error } = await uploadFile(selectedFile);

            // Handle error if upload failed
            if (!success) {
                alert('Error uploading file.');
                return;
            }

            alert('File uploaded successfully!');
        } catch (error) {
            console.error("Error uploading file: ", error);
            alert('Error uploading file.');
        } finally {
            setIsLoading(false); // End loading
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
