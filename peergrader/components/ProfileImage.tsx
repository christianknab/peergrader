import Image, { StaticImageData } from 'next/image';
import React from 'react';

interface ProfileImageProps {
  src: string | StaticImageData;
  width: number;
  height: number;
  alt?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, width, height, alt }) => {
  return (
    <div className="relative rounded-full overflow-hidden" style={{ width, height }}>
      <Image
        src={src}
        alt={alt || ''}
        fill
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
};

export default ProfileImage;