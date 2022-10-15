import React from 'react';

const Preloader = () => (
  <div className="w-full h-screen z-9999 flex flex-col justify-center items-center animate-fade text-center">
    <img src="/assets/logo.svg" alt="Foodie Logo" className="w-12 animate-spin" />
    <h5>Social Gen</h5>
    <p className="text-sm mt-4 text-gray-500 w-[80%] laptop:w-full">“One of the best ways to influence people is to make them feel important.“</p>
  </div>
);

export default Preloader;
