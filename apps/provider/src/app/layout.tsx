import './globals.css'
import { Fahkwang as Inter } from 'next/font/google'
import Header from '@/components/header'
import Providers from '@/providers'
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import 'reactjs-popup/dist/index.css';
const inter = Inter({ weight: '400', subsets: ['latin'] })

export const metadata = {
  title: 'Duro',
  description: 'a virtual queueing system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-800`}>
        <div className='max-w-screen-xl mx-auto p-8'>
          <Providers>
            <Header title="DURO" />
            <div className='w-full flex'>
              {children}
            </div>
          </Providers>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
