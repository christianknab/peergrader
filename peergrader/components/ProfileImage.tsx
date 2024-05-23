import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';

interface ProfileImageProps {
  src: string | null;
  width: number;
  height: number;
  alt?: string;
  border?: boolean
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, width, height, alt, border = false }) => {
  const borderStyle = border ? '2px solid #d1d5db' : 'none';
  const [loaded, setLoaded] = useState(false);
  return (
    <div>
      <img
        hidden={loaded}
        src={'/assets/default_avatar.svg'}
        alt={alt || ''}
        style={{ width: `${width}px`, height: `${height}px`, borderRadius: '50%', border: borderStyle }} />
      {src != null && <img
        hidden={!loaded}
        src={src}
        alt={alt || ''}
        onLoad={() => setLoaded(true)}
        style={{ width: `${width}px`, height: `${height}px`, borderRadius: '50%', border: borderStyle }} />}
    </div>
  );
};

export default ProfileImage;