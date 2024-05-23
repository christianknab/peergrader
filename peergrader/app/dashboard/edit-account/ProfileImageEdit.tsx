// Credit to https://github.com/OneLightWebDev/react-image-cropper/tree/main

import React, { useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import CropperModal from './CropperModal';
import Pencil from '@/components/icons/Pencil';
import ProfileImage from "@/components/ProfileImage";


interface ProfileImageEditProps {
    src: string;
    uid: string;
    setProfileImageUrl: (profileImageUrl: string) => void;
}

const ProfileImageEdit: React.FC<ProfileImageEditProps> = ({ src, uid, setProfileImageUrl }) => {
    const [avatarUrl, setAvatarUrl] = useState(src);
    const [modalOpen, setModalOpen] = useState(false);
    const [triggerRerender, setTriggerRerender] = useState(false);

    const updateAvatar = (imgSrc: string) => {
        setAvatarUrl(imgSrc);
        setProfileImageUrl(imgSrc);
        setTriggerRerender((prev) => !prev); // triggers ProfileImage rebuild
    };

    return (
        <div className="relative">
            <div className="relative">
                <ProfileImage src={`${avatarUrl}?${new Date().getTime()}`} width={150} height={150} border={true} />
                <button
                    className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-300 hover:bg-gray-700 border border-gray-600"
                    title="Change photo"
                    onClick={() => setModalOpen(true)}
                >
                    <Pencil />
                </button>
                {modalOpen && (
                    <CropperModal
                        updateAvatar={updateAvatar}
                        closeModal={() => setModalOpen(false)}
                        uid={uid}
                    />
                )}</div>
        </div>
    );
};

export default ProfileImageEdit;