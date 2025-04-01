import { useState, useRef } from 'react';
import {
  House,
  ChartNoAxesColumn,
  ChartNoAxesCombined,
  Globe,
  LogOut,
} from 'lucide-react';
import DashboardTable from './DashboardTable';
import DashboardTop from './DashboardTop';
import { temporaryProjects } from '../testProjects';
import ClientNewProjectModal from './ClientNewProjectModal';
import useAuthStore from '../stores/authStore';

export const ProjectStatusBadge = ({ status }) => {
  const statusColors = {
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Complete: 'bg-green-100 text-green-800',
    Published: 'bg-green-100 text-green-800',
    Overdue: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusColors[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
};

function DashboardComponent() {
  const tableContainerRef = useRef(null);
  const [activePage, setActivePage] = useState(1);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const { logout } = useAuthStore();

  // Function to open the modal
  const openNewProjectModal = () => {
    setIsNewProjectModalOpen(true);
  };

  // Function to close the modal
  const closeNewProjectModal = () => {
    setIsNewProjectModalOpen(false);
  };

  // Navigation items with icons and labels
  const navItems = [
    { id: 1, label: 'Dashboard', icon: House },
    { id: 2, label: 'Track Progress', icon: ChartNoAxesColumn },
    { id: 3, label: 'Monitor Students', icon: ChartNoAxesCombined },
    { id: 4, label: 'Pending Approvals', icon: Globe },
  ];

  return (
    <>
      <ClientNewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={closeNewProjectModal}
      />
      <main className='grid grid-cols-[299px_1fr] w-screen h-screen overflow-hidden text-gray-900 bg-gray-50'>
        {/* Left Navigation */}
        <div className='p-3 flex items-start justify-between flex-col'>
          <div className='flex-1'>
            <h2 className='px-4 text-lg font-bold mb-4 '>CPMP DASHBOARD</h2>
            <nav className='space-y-2'>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 cursor-pointer text-left px-4 py-2 rounded-md ${
                      activePage === item.id
                        ? 'font-medium'
                        : 'hover:bg-neutral-200'
                    }`}
                  >
                    <Icon className='w-5 h-5' />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className='h-fit'>
            <button onClick={logout} className='btn btn-error'>
              <LogOut size={18} /> logout
            </button>
          </div>
        </div>

        {/* Right Content */}
        <section className='grid grid-rows-[80px_1fr] overflow-hidden'>
          <DashboardTop openNewProjectModal={openNewProjectModal} />
          <section className='w-full h-full p-5 flex flex-col overflow-hidden'>
            <div
              ref={tableContainerRef}
              className='flex-1 min-h-0 rounded-lg custom-relative-for-scrollbar overflow-hidden hover:overflow-y-auto bg-white'
            >
              <div className='custom-absolute-for-scrollbar inset-0 overflow-y-hidden hover:overflow-y-auto'>
                {pageContents[activePage]}
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

export default DashboardComponent;

// Dummy content for pages 1-5
const pageContents = {
  1: <DashboardTable projects={temporaryProjects} />,
  2: (
    <div className='p-4 text-center'>
      <h3 className='text-lg font-medium mb-2'>Track Progress</h3>
      <p className='text-gray-600'>
        This section would show project progress tracking
      </p>
      <div className='mt-4 h-20 bg-blue-100 rounded-md flex items-center justify-center'>
        <span>Progress Tracking Components</span>
      </div>
    </div>
  ),
  3: (
    <div className='p-4 text-center'>
      <h3 className='text-lg font-medium mb-2'>Student Monitoring</h3>
      <div className='grid grid-cols-2 gap-4 mt-4'>
        <div className='h-24 bg-green-100 rounded-md flex items-center justify-center'>
          Student Activity
        </div>
        <div className='h-24 bg-green-100 rounded-md flex items-center justify-center'>
          Performance Metrics
        </div>
      </div>
    </div>
  ),
  4: (
    <div className='p-4 text-center'>
      <h3 className='text-lg font-medium mb-2'>Pending Approvals</h3>
      <div className='mt-4 p-4 bg-purple-100 rounded-md'>
        <p className='text-purple-800'>
          Items awaiting approval would appear here
        </p>
      </div>
    </div>
  ),
};
