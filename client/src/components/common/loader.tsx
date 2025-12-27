import React from "react";

const Loader = () => {
  return (
    <div className=" w-full h-full flex justify-center items-center">
      <span className="block w-16 h-16 border-4 border-blue-400 border-solid border-t-transparent rounded-full animate-spin"></span>
    </div>
  );
};

export default Loader;
