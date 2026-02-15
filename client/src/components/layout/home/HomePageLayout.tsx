"use client"

import React, { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'
import { SidebarUrls } from '../../constants/sidebarUrls'

function HomePageLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <>
      <div className='w-full flex items-start justify-start'>
        <div className=''>
          <Sidebar
            router={router}
            SidebarUrls={SidebarUrls}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
        <div className={`${isSidebarOpen ? "ml-60" : "ml-14"} duration-300`}>
          <Header
            activeTab={activeTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className={`mt-13 p-5 ${isSidebarOpen ? "w-[calc(100vw-16rem)]" : "w-[calc(100vw-4.5rem)]"} duration-300`}>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePageLayout