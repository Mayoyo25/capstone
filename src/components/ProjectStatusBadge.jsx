const ProjectStatusBadge = ({ status }) => {
  const statusColors = {
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Complete: 'bg-green-100 text-green-800',
    Published: 'bg-green-100 text-green-800',
    Overdue: 'bg-red-100 text-red-800',
    Pending: 'bg-blue-100 text-blue-800',
    Approved: 'bg-purple-100 text-purple-800',
    Rejected: 'bg-gray-100 text-gray-800',
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

export default ProjectStatusBadge;
