"use client"

import React from "react";


const Controls = ({ zoomIn, zoomOut, resetTransform }) => {


    return (
      <div className="tools absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 flex space-x-2 z-10">
        <button 
          onClick={zoomIn} 
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center text-xl font-bold"
        >
          +
        </button>
        <button 
          onClick={zoomOut} 
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center text-xl font-bold"
        >
          -
        </button>
        <button 
          onClick={resetTransform} 
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center text-xl font-bold"
        >
          x
        </button>
      </div>
    );
  };


  export default Controls;
  