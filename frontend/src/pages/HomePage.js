// src/pages/HomePage.js
import React from "react";
import heroImg from "../assets/hero-img.png"; 
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-5xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          Welcome to the Student Course Registration System
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          A seamless platform for managing course enrollments, faculty inputs, and student access.
        </p>
        <img
          src={heroImg}
          alt="Student Registration Illustration"
          className="w-full max-h-[400px] object-contain mx-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default HomePage;
