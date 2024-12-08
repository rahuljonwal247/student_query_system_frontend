// pages/index.tsx
import React from 'react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">Welcome to the Student Query System</h1>
        <p className="mt-4 text-lg text-gray-600">Efficiently manage student queries and resolve issues quickly.</p>
        <div className="mt-8">
          <Link href="/login" legacyBehavior>
            <a className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
              Get Started
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
