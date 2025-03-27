import { Eye } from 'lucide-react';

const ProjectStatusBadge = ({ status }) => {
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


function DashboardTable({projects}){

 return (
 <div className="shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <ProjectStatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{project.assignedTo}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{project.startDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{project.endDate}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-gray-500 hover:text-gray-700">
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
 )
}
export default DashboardTable