import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#8B5CF6"
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  );
};

export default Loader;