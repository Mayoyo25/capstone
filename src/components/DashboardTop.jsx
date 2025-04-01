import { Bell, Settings } from 'lucide-react';
function DashboardTop({ openNewProjectModal, userType }) {
  return (
    <section className='flex justify-between items-center px-5 mt-2 text-gray-600'>
      <div className='w-full h-full'>
        <p className='text-gray-700 flex gap-10'>
          {' '}
          <span className='text-gray-500'>
            {userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase()}
          </span>
          /Dashboard
        </p>
        <p className='text-lg font-bold text-gray-700'>Dashboard</p>
      </div>
      <div className='flex items-center justify-end px-4 gap-4 w-full h-full '>
        <label className='input'>
          <svg
            className='h-[1em] opacity-50'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
          >
            <g
              strokeLinejoin='round'
              strokeLinecap='round'
              strokeWidth='2.5'
              fill='none'
              stroke='currentColor'
            >
              <circle cx='11' cy='11' r='8'></circle>
              <path d='m21 21-4.3-4.3'></path>
            </g>
          </svg>
          <input type='search' className='grow' placeholder='Search' />
        </label>
        <button
          className='btn btn-outline btn-sm bg-teal-600 text-white hover:text-gray-200 '
          onClick={openNewProjectModal}
        >
          + New Project
        </button>
        <div className='justify-end gap-2 flex items-center'>
          <Settings className='cursor-pointer' size={14} />
          <Bell className='cursor-pointer' size={14} />
        </div>
      </div>
    </section>
  );
}

export default DashboardTop;
