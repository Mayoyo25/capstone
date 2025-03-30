import { LoaderPinwheel } from 'lucide-react';

function TestPage() {
  return (
    <div className='flex justify-center items-center w-screen h-screen space-x-3'>
      <p className='text-lg'>Loading...</p>
      <LoaderPinwheel className='animate-spin' />
    </div>
  );
}

export default TestPage;
