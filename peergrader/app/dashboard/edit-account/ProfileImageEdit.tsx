import React, { useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { supabase } from '@/utils/supabase/client';
import ImageCropper from './ImageCropper';
import CropperModal from './CropperModal';
import Pencil from '@/components/icons/Pencil';

interface ProfileImageEditProps {
    src: string;
    uid: string;
    onUpload: (url: string) => void;
}

const ProfileImageEdit: React.FC<ProfileImageEditProps> = ({ src, uid, onUpload }) => {
    const [uploading, setUploading] = useState(false);
    const [upImg, setUpImg] = useState<HTMLImageElement | null>(null);
    const [crop, setCrop] = useState<Crop>({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
    const [imgFormat, setImgFormat] = useState<string>('image/jpeg');

    const avatarUrl = useRef(
        src
    );
    const [modalOpen, setModalOpen] = useState(false);

    const updateAvatar = (imgSrc: string) => {
        avatarUrl.current = imgSrc;
    };

    return (
        <div className="relative">
            <div className="relative">
            <img
                src={avatarUrl.current}
                alt="Avatar"
                className="w-[150px] h-[150px] rounded-full border-2 border-gray-400"
            />
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