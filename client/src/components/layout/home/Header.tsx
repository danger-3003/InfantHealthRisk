"use client"

import { HeaderTypes } from '@/src/types/layout/SidebarTypes'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import React from 'react'

function Header({ activeTab, isSidebarOpen, setIsSidebarOpen }: HeaderTypes) {
  return (
    <>
      <div className={`fixed top-0 bg-white shadow-[0_10px_10px_-12px_rgba(0,0,0,0.30)] text-sm ${isSidebarOpen ? "w-[calc(100vw-15rem)]" : "w-[calc(100vw-3.5rem)]"} p-4 flex items-center duration-300`}>
        <button className='mr-3'>
          <PanelRightOpen className={`${isSidebarOpen ? "block" : "hidden"}`} size={20} onClick={() => { setIsSidebarOpen(false) }} />
          <PanelRightClose className={`${isSidebarOpen ? "hidden" : "block"}`} size={20} onClick={() => { setIsSidebarOpen(true) }} />
        </button>
        <div>
          <h3>
            {activeTab}
          </h3>
        </div>
      </div>
    </>
  )
}

export default Header