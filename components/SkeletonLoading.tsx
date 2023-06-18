import React from 'react';

const SkeletonLoadingDark = () => {
  return (
    <div className="flex w-64 items-center bg-gray-800 justify-start gap-6 animate-pulse rounded-full">
      <div className="w-12 h-12 rounded-full bg-gray-700"></div>
      <div className="flex flex-col items-center">
        <div className="w-32 h-4 bg-gray-700 rounded mb-1"></div>
        <div className="w-24 h-3 bg-gray-700 rounded"></div>
      </div>
      <div className="w-4 h-4 rounded-full bg-gray-700"></div>
    </div>
  );
};

export default SkeletonLoadingDark;
