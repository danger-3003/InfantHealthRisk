"use client"

import { SidebarTypes } from '@/src/types/layout/SidebarTypes'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { HeartPulse, LogOut } from 'lucide-react';

function Sidebar({ router, SidebarUrls, activeTab, setActiveTab, isSidebarOpen }: SidebarTypes) {

  const pathName = usePathname();

  useEffect(() => {
    const tab = SidebarUrls.find((item) => pathName === item?.path || pathName.startsWith(`${item?.path}/`));
    setActiveTab(tab?.name ?? "");
  }, [SidebarUrls, pathName, setActiveTab]);

  const handleSetActiveTab = (tab: string, path: string) => {
    router.push(path);
    setActiveTab(tab);
  }

  return (
    <>
      <div className={`${isSidebarOpen ? "min-w-60" : "min-w-14"} fixed top-0 h-screen py-5 bg-white shadow-xl text-sm duration-300`}>
        <div className='flex items-center justify-center mb-3 gap-3 px-3'>
          <HeartPulse size={30} />
          <p className={`${isSidebarOpen ? "block" : "hidden"} text-center font-semibold uppercase text-lg duration-300`}>Health Predect</p>
        </div>
        <div className='px-3'>
          <ul className='border-slate-300 border-t pt-2'>
            {
              SidebarUrls.map((item, key) => {
                return (
                  <li key={key} className={`cursor-pointer px-2 py-2 h-8 my-1.5 rounded-lg flex gap-2 items-center ${activeTab === item?.name ? "bg-pink-200 text-pink-950" : "hover:bg-pink-50 hover:text-pink-900"} duration-300`} onClick={() => handleSetActiveTab(item?.name, item?.path)}>
                    <span>{item?.icon}</span>
                    <span className={`${isSidebarOpen ? "block" : "hidden"}`}>{item?.name}</span>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className='px-3 absolute bottom-3 w-full'>
          <div className='text-red-500 px-2 py-2 h-8 flex gap-2 items-center cursor-pointer hover:bg-red-50 hover:text-red-400 active:bg-red-200 active:text-red-500 rounded-lg duration-300'>
            <LogOut size={16} className='rotate-180' />
            <span className={`${isSidebarOpen ? "block" : "hidden"} duration-300`}>Logout</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar