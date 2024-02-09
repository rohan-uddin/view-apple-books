import React from 'react'
// import Navbar from './_components/Navbar'
import { Toaster } from "@/components/ui/toaster"

const LandingLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <div className='h-full dark:bg-[#1f1f1f]'>
      {/* <Navbar /> */}
      <main className='h-full'>
        {children}
      </main>
      <Toaster />
    </div>
  )
}

export default LandingLayout