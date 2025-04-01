import { getProjects } from './services/projects';

function TestPage() {
  const handleTest = async () => {
    const list = await getProjects();
    console.log(list);
  };

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center gap-5'>
      <h1>Test Page</h1>
      <button onClick={handleTest} className='btn btn-primary'>
        Create Hardcoded Project
      </button>
    </div>
  );
}

export default TestPage;
