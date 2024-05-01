"use client";
import { useState } from 'react';
import { uploadFile } from "@/utils/uploadFile";
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

export default function UploadButton({ asgn_id }: { asgn_id: string }) {
    const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null) {
            alert('No file selected.');
            return;
        }
        setSelectedFile(event.target.files[0]);
    };

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const onDropFile = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files.length > 0) {
            setSelectedFile(event.dataTransfer.files[0]);
        }
    };

    const onFileUpload = async () => {
        if (!selectedFile) {
            alert('No file selected.');
            return;
        }

        if (!currentUser) {
            alert('You must be logged in');
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
        <div
            className={`flex flex-col items-center justify-center p-4 rounded-md ${selectedFile ? '' : 'border-2 border-dashed border-gray-400'}`}
            onDragOver={onDragOver}
            onDrop={onDropFile}
        >
            {!selectedFile ? (
                <>
                    <p className="text-gray-600 mb-2">
                        Drag and drop a file here or select a file
                    </p>
                    <label
                        htmlFor="file-input"
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                    >
                        Select File
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        onChange={onFileChange}
                        className="hidden"
                    />
                </>
            ) : (
                <>
                    <p className="text-gray-600">
                        {selectedFile.name}
                    </p>
                    <div className="flex items-center justify">

                        <label
                            htmlFor="file-input"
                            className="py-1 px-3 rounded-md text-gray-500 no-underline bg-btn-background hover:bg-btn-background-hover cursor-pointer"
                        >
                            Select File
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            onChange={onFileChange}
                            className="hidden"
                        />

                        <button
                            onClick={onFileUpload}
                            disabled={isLoading}
                            className="ml-4 inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
                        >
                            {isLoading ? 'Submitting...' : 'Submit Assignment'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );

}