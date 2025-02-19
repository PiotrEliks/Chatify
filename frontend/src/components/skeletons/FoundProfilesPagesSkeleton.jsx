import React from 'react'

const FoundProfilesPagesSkeleton = () => {
  const skeletonUsers = Array(4).fill(null);

  return (
    <aside className="h-screen bg-base-200">
      <div className="relative pt-20 px-4">
        {skeletonUsers.map((_, idx) => (
          <div key={idx} className="bg-base-300/70 mb-5 p-5 rounded-2xl flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <div className="relative mx-auto lg:mx-0">
                <div className="skeleton size-30 rounded-full" />
              </div>
              <div className="lg:block text-left min-w-0 flex flex-col">
                <div className="skeleton h-4 w-32 mb-2" />
                <div className="skeleton h-3 w-16" />
              </div>
            </div>
            <div className="skeleton rounded-xl w-40 h-10" />
          </div>
        ))}
      </div>
    </aside>
  )
}

export default FoundProfilesPagesSkeleton