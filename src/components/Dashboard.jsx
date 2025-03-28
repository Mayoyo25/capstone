import { useRef } from 'react';
import DashboardTable from './DashboardTable';
import { temporaryProjects } from '../testProjects';

export const ProjectStatusBadge = ({ status }) => {
  const statusColors = {
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Complete': 'bg-green-100 text-green-800',
    'Published': 'bg-green-100 text-green-800',
    'Overdue': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};


function TestPage() {
  const tableContainerRef = useRef(null);

  return (
    <main className="grid grid-cols-[299px_1fr] w-screen h-screen overflow-hidden bg-teal-100">
      <div className="bg-rose-700">Left</div>
      <section className="grid grid-rows-[80px_1fr] overflow-hidden">
        <div className="bg-amber-400">Top</div>
        <div className="w-full h-full p-5 flex flex-col overflow-hidden">
          {/* Scrollable container with stable layout */}
          <div 
            ref={tableContainerRef}
            className="flex-1 min-h-0 rounded-lg custom-relative-for-scrollbar overflow-hidden hover:overflow-y-auto bg-white"
          >
            <div className="custom-absolute-for-scrollbar inset-0 overflow-y-hidden hover:overflow-y-auto">
             <DashboardTable projects={temporaryProjects}/>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TestPage;