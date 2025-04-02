import { useState } from 'react';
import { axiosInstanceWithToken } from './services/axiosConfig';
import useAuthStore from './stores/authStore';

function TestPage() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    userData: { user_type },
    logout,
  } = useAuthStore();

  console.log(`User role: "${user_type}"`);

  // Sample data for different operations
  const testData = {
    createProject: {
      title: 'AI Research Platform',
      description: 'Developing machine learning models for data analysis',
      start_date: '2023-11-01',
      deadline: '2023-12-15',
      status: 'PLANNING',
      completion_percentage: 0,
    },
    createTicket: {
      title: 'API Integration Issue',
      description: 'Unable to connect to external API',
      due_date: '2023-11-10',
      ticket_type: 'TECHNICAL',
      resolved: false,
    },
    updateProject: {
      status: 'IN_PROGRESS',
      completion_percentage: 25,
    },
  };

  const handleApiCall = async (endpoint, method = 'get', data = null) => {
    setLoading(true);
    setError(null);
    try {
      let result;
      switch (method.toLowerCase()) {
        case 'get':
          result = await axiosInstanceWithToken.get(endpoint);
          break;
        case 'post':
          result = await axiosInstanceWithToken.post(endpoint, data);
          break;
        case 'put':
          result = await axiosInstanceWithToken.put(endpoint, data);
          break;
        case 'delete':
          result = await axiosInstanceWithToken.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      setResponse(result.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>API Test Page</h1>

      <div className='bg-blue-50 p-3 rounded-lg mb-4'>
        <p>
          Current user role: <strong>{user_type || 'Unknown'}</strong>
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
        {/* Dashboard Operations */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-3'>Dashboard Operations</h2>
          <div className='space-y-2'>
            <button
              onClick={() => handleApiCall('dashboard/')}
              className='btn btn-primary'
            >
              Get Dashboard Data
            </button>
            <button
              onClick={() => handleApiCall('dashboard/?page=projects')}
              className='btn btn-primary'
            >
              Get Projects Dashboard
            </button>
            <button
              onClick={() =>
                handleApiCall('dashboard/?page=academic_supervisors')
              }
              className='btn btn-primary'
            >
              Get Supervisors Dashboard
            </button>
          </div>
        </div>

        {/* Project Operations */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-3'>Project Operations</h2>
          <div className='space-y-2'>
            <button
              onClick={() =>
                handleApiCall('projects/', 'post', testData.createProject)
              }
              className='btn btn-primary'
            >
              Create Project
            </button>
            <button
              onClick={() => handleApiCall('projects/1/', 'get')}
              className='btn btn-primary'
            >
              Get Project (ID:1)
            </button>
            <button
              onClick={() =>
                handleApiCall('projects/1/', 'put', testData.updateProject)
              }
              className='btn btn-primary'
            >
              Update Project (ID:1)
            </button>
            <button
              onClick={() => handleApiCall('projects/1/', 'delete')}
              className='btn-danger'
            >
              Delete Project (ID:1)
            </button>
          </div>
        </div>

        {/* Ticket Operations */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-3'>Ticket Operations</h2>
          <div className='space-y-2'>
            <button
              onClick={() =>
                handleApiCall('tickets/', 'post', testData.createTicket)
              }
              className='btn btn-primary'
            >
              Create Ticket
            </button>
            <button
              onClick={() => handleApiCall('tickets/1/', 'get')}
              className='btn btn-primary'
            >
              Get Ticket (ID:1)
            </button>
          </div>
        </div>

        {/* User Operations */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-3'>User Operations</h2>
          <div className='space-y-2'>
            <button
              onClick={() => handleApiCall('profile/', 'get')}
              className='btn btn-primary'
            >
              Get My Profile
            </button>
            <button
              onClick={() => handleApiCall('students/', 'get')}
              className='btn btn-primary'
            >
              List Students
            </button>
            <button
              onClick={() => handleApiCall('supervisors/', 'get')}
              className='btn btn-primary'
            >
              List Supervisors
            </button>
          </div>
        </div>
      </div>

      {/* Response Display */}
      <div className='bg-gray-50 p-4 rounded-lg'>
        <h2 className='text-lg font-semibold mb-2'>API Response</h2>
        {loading && <div className='text-blue-500'>Loading...</div>}
        {error && (
          <div className='text-red-500 mb-4 p-2 bg-red-50 rounded'>
            Error: {JSON.stringify(error, null, 2)}
          </div>
        )}
        {response && (
          <pre className='bg-white p-3 rounded text-sm overflow-x-auto'>
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
      <div className='flex items-center justify-center p-10 w-full'>
        <button className='btn btn-error' onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default TestPage;
