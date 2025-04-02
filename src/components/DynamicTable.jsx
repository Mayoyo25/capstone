import ProjectStatusBadge from './ProjectStatusBadge';

const DashboardTable = ({ columns = [], data = [] }) => {
  if (!columns.length || !data.length) {
    return (
      <div className='p-6 text-center text-gray-500'>
        {!columns.length ? 'No columns configured' : 'No data available'}
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => {
                const cellValue = row[column.key] || '-';
                if (
                  column.key.includes('status') ||
                  column.key === 'completion' ||
                  column.key === 'progress'
                ) {
                  return (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className='px-6 py-4 whitespace-nowrap'
                    >
                      <ProjectStatusBadge status={cellValue} />
                    </td>
                  );
                }
                return (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'
                  >
                    {cellValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
