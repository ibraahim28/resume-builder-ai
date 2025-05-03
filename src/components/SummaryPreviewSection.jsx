import React from 'react'

const SummaryPreviewSection = ({resumeData}) => {
    const {summary} = resumeData;
    if (!summary) return null;
    return (
    <>
    <hr className='border-2' />
    <div className='space-y-3 break-inside-avoid'>
        <p className='text-lg font-semibold'>Professional Profile</p>
        <div className='whitespace-pre-line text-sm'>
        {summary}
        </div>
    </div>
    </>
  )
}

export default SummaryPreviewSection;