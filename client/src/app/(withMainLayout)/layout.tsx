import HomePageLayout from '@/src/components/layout/home/HomePageLayout'
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HomePageLayout>
        {children}
      </HomePageLayout>
    </>
  )
}

export default layout