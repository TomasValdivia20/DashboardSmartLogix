import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="h-full pb-16 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}