import Image, { StaticImageData } from 'next/image';
import React from 'react';

interface ProfileImageProps {
  src: string;
  width: number;
  height: number;
  alt?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, width, height, alt }) => {
  return (
    <img
      src={src}
      alt={alt || ''}
      style={{ width: `${width}px`, height: `${height}px`, borderRadius: '50%', border: '2px solid #d1d5db' }}    />
  );
};

export default ProfileImage;