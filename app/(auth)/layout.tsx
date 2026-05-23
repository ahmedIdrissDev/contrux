import React from 'react'

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className='flex justify-center items-center h-screen overflow-hidden bg-[var(--color-brand-teal-deep)] relative'>
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[80%] rounded-full bg-[var(--color-brand-green)] blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[70%] rounded-full bg-[var(--color-brand-teal)] blur-[120px]"></div>
      </div>
      
      <div className="relative z-10 w-full flex justify-center px-4">
        {children} 
      </div>
    </main>
  )
}

export default AuthLayout
