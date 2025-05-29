import React from 'react'
import ResumeEditor from './_components/ResumeEditor'

export const metadata = {
    title : "Design Your Resume",
}

const Page = () => {
  return (
    <div className='flex grow flex-col max-w-7xl mx-auto'>
        <ResumeEditor />
    </div>
  )
}

export default Page