import { Eye } from 'lucide-react';

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

function DashboardTable({ projects }) {
  return (
    <table className='table w-full'>
      <thead>
        <tr>
          <th>Project</th>
          <th>Status</th>
          <th>Assigned To</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td>
              <div>{project.name}</div>
            </td>
            <td className='px-4 py-3'>
              <ProjectStatusBadge status={project.status} />
            </td>
            <td>{project.assignedTo}</td>
            <td>{project.startDate}</td>
            <td>{project.endDate}</td>
            <td>
              <button className='text-gray-500 hover:text-gray-700'>
                <Eye size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default DashboardTable;
