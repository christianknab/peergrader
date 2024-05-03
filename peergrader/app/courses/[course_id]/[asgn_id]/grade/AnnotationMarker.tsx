import { AnnotationMarkerData } from '@/utils/types/AnnotationMarkerData';
import React from 'react';
import { supportedColors } from '@/utils/constants';

const Marker = ({ radius, data, page, selected }: { radius: number, data: AnnotationMarkerData, selected: boolean, page: { width: number, height: number } | undefined }) => {

  const width = page?.width ?? 0;
  const height = page?.height ?? 0;

  const x = (width - (data.x / 1000 * width)) - radius;
  const y = (data.y / 1000 * height) - radius;

  return (
    <div style={{ position: 'absolute', top: `${y}px`, right: `${x}px` }}>
      <div className="w-full h-full rounded-full" style={{
        backgroundColor: supportedColors[data.colorIndex],
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        border: `${selected ? radius * 0.2 : 0}px solid #000`
      }}>
        
      </div>
    </div>
  );
};

export default Marker;