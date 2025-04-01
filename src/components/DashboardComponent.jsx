import { useState, useRef } from 'react';
import {
  LogOut,
  House,
  ChartBar,
  Users,
  Globe,
  FileText,
  Settings,
  Bell,
  BookOpen,
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

// Configuration for different user types
const userTypeConfig = {
  ADMIN: {
    navItems: [
      { id: 1, label: 'Dashboard', icon: House },
      { id: 2, label: 'Analytics', icon: ChartBar },
      { id: 3, label: 'User Management', icon: Users },
      { id: 4, label: 'System Settings', icon: Settings },
    ],
    showNewProjectButton: false,
  },
  CLIENT: {
    navItems: [
      { id: 1, label: 'Dashboard', icon: House },
      { id: 2, label: 'My Projects', icon: FileText },
      { id: 3, label: 'New Project', icon: FileText },
      { id: 4, label: 'Notifications', icon: Bell },
    ],
    showNewProjectButton: true,
  },
  SUPERVISOR: {
    navItems: [
      { id: 1, label: 'Dashboard', icon: House },
      { id: 2, label: 'Student Progress', icon: ChartBar },
      { id: 3, label: 'Projects', icon: FileText },
      { id: 4, label: 'Approvals', icon: Globe },
    ],
    showNewProjectButton: false,
  },
  STUDENT: {
    navItems: [
      { id: 1, label: 'Dashboard', icon: House },
      { id: 2, label: 'My Projects', icon: BookOpen },
      { id: 3, label: 'Progress', icon: ChartBar },
      { id: 4, label: 'Resources', icon: FileText },
    ],
    showNewProjectButton: false,
  },
};

// Dynamic content generator based on user type and page
const getPageContent = (activePage, userType) => {
  const commonTable = (
    <DashboardTable projects={temporaryProjects} userType={userType} />
  );

  const contentMap = {
    ADMIN: {
      1: commonTable,
      2: <AnalyticsDashboard />,
      3: <UserManagement />,
      4: <SystemSettings />,
    },
    CLIENT: {
      1: commonTable,
      2: commonTable,
      3: <div className='p-4'>New project form would appear here</div>,
      4: <Notifications />,
    },
    SUPERVISOR: {
      1: commonTable,
      2: <StudentProgress />,
      3: commonTable,
      4: <ApprovalsDashboard />,
    },
    STUDENT: {
      1: commonTable,
      2: commonTable,
      3: <StudentProgressView />,
      4: <ResourcesLibrary />,
    },
  };

  return contentMap[userType]?.[activePage] || <div>Page not found</div>;
};

// Example component placeholders - you would replace these with your actual components
const AnalyticsDashboard = () => (
  <div className='p-4'>
    <h3 className='text-lg font-medium mb-4'>System Analytics</h3>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <div className='bg-blue-100 p-4 rounded-lg'>Users</div>
      <div className='bg-green-100 p-4 rounded-lg'>Projects</div>
      <div className='bg-purple-100 p-4 rounded-lg'>Activity</div>
    </div>
  </div>
);

const UserManagement = () => (
  <div className='p-4'>
    <h3 className='text-lg font-medium mb-4'>Manage Users</h3>
    <div className='bg-white rounded-lg shadow p-4'>
      User table would go here
    </div>
  </div>
);

const SystemSettings = () => (
  <div className='p-4'>
    <h3 className='text-lg font-medium mb-4'>System Configuration</h3>
    <div className='space-y-4'>
      <div className='bg-gray-100 p-4 rounded-lg'>Settings form</div>
    </div>
  </div>
);

const Notifications = () => (
  <div className='p-4'>
    <h3 className='text-lg font-medium mb-4'>Your Notifications</h3>
    <div className='space-y-2'>
      {[1, 2, 3].map((i) => (
        <div key={i} className='bg-white p-3 rounded-lg shadow'>
          Notification {i}
        </div>
      ))}
    </div>
  </div>
);

const StudentProgress = () => (
  <div className='p-4'>
    <h3 className='text-lg font-medium mb-4'>Student Progress Tracking</h3>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='bg-yellow-100 p-4 rounded-lg'>Progress Chart</div>
      <div className='bg-red-100 p-4 rounded-lg'>Performance Metrics</div>
    </div>
  </div>
);

const ApprovalsDashboard = () => (
  <div className='p-4'>
    <h3 className='text-lg font-medium mb-4'>Pending Approvals</h3>
    <div className='bg-white rounded-lg shadow p-4'>
      Approvals list would go here
    </div>
  </div>
);

const StudentProgressView = () => (
  <div className='p-4'>
    <h3 className='text-lg font-medium mb-4'>Your Progress</h3>
    <div className='bg-green-100 p-4 rounded-lg'>
      Progress visualization for student
    </div>
  </div>
);

const ResourcesLibrary = () => (
  <div className='p-4'>
    <h3 className='text-lg font-medium mb-4'>Learning Resources</h3>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {['Resource 1', 'Resource 2', 'Resource 3'].map((res) => (
        <div key={res} className='bg-blue-50 p-4 rounded-lg'>
          {res}
        </div>
      ))}
    </div>
  </div>
);

function DashboardComponent({ userType }) {
  const tableContainerRef = useRef(null);
  const [activePage, setActivePage] = useState(1);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const { logout } = useAuthStore();

  const config = userTypeConfig[userType] || userTypeConfig.CLIENT;
  const navItems = config.navItems;

  const openNewProjectModal = () => setIsNewProjectModalOpen(true);
  const closeNewProjectModal = () => setIsNewProjectModalOpen(false);

  return (
    <>
      {config.showNewProjectButton && (
        <ClientNewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={closeNewProjectModal}
          user_type={userType}
        />
      )}

      <main className='grid grid-cols-[249px_1fr] w-screen h-screen overflow-hidden text-gray-900 bg-gray-50'>
        {/* Left Navigation */}
        <div className='p-3 px-4 flex items-start justify-between flex-col'>
          <div className='flex-1'>
            <h3 className='px-4 font-bold mb-4 '>CPMP DASHBOARD</h3>
            <nav className='space-y-2'>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 cursor-pointer text-left px-4 py-2 rounded-lg ${
                      activePage === item.id
                        ? 'font-medium bg-white scale-105 shadow-lg'
                        : 'hover:bg-neutral-200'
                    }`}
                  >
                    <Icon
                      className='p-1 rounded-sm bg-white text-brand'
                      size={32}
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className='h-fit mx-auto mb-4'>
            <button
              onClick={logout}
              className='flex items-center gap-3 px-4 py-2 rounded-md hover:bg-neutral-200 text-red-600 font-medium cursor-pointer'
              title='Logout'
            >
              <LogOut size={18} /> logout
            </button>
          </div>
        </div>

        {/* Right Content */}
        <section className='grid grid-rows-[80px_1fr] overflow-hidden'>
          <DashboardTop
            userType={userType}
            openNewProjectModal={
              config.showNewProjectButton ? openNewProjectModal : null
            }
          />
          <section className='w-full h-full p-5 flex flex-col overflow-hidden'>
            <div
              ref={tableContainerRef}
              className='flex-1 min-h-0 rounded-lg custom-relative-for-scrollbar overflow-hidden hover:overflow-y-auto bg-white'
            >
              <div className='custom-absolute-for-scrollbar inset-0 overflow-y-hidden hover:overflow-y-auto'>
                {getPageContent(activePage, userType)}
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

export default DashboardComponent;
