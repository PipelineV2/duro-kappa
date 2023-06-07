'use client'
import Link from 'next/link';
import Queues from './queues'

function Page({ children }: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-max mt-[2rem]">
      <div className="mx-auto">
        <div className="grid grid-cols-2">
          <Queues />
          
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page

