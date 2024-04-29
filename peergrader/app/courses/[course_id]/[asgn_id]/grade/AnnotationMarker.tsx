import { AnnotationMarkerData } from '@/utils/types/AnnotationMarkerData';
import React from 'react';

const Marker = ({ radius, data, page }: { radius: number, data: AnnotationMarkerData , page:{ width: number, height: number } | undefined}) => {

  const width = page?.width ?? 0;
  const height = page?.height ?? 0;

  const x = (width - (data.x/1000 * width)) -  radius;
  const y = (data.y/1000 * height) - radius ;
  console.log()


  return (
    <div style={{ width: `${radius * 2}px`, height: `${radius * 2}px`, position: 'absolute', top: `${y}px`, right: `${x}px` }}>
      <div className="w-full h-full bg-red-500 rounded-full">

      </div>
    </div>
  );
};

export default Marker;