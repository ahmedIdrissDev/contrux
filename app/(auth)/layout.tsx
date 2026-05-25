import React from 'react'
import Image from 'next/image'

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      {/* Left side: Content */}
      <div className="flex items-center justify-center p-8 bg-canvas">
        <div className="w-full flex justify-center">
          {children}
        </div>
      </div>

      {/* Right side: Visual */}
   <div className="bg-neutral-100 h-dvh"></div>
    </main>
  )
}

export default AuthLayout
