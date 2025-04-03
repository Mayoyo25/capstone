import { useState } from 'react';

function UserTypeMenu() {
  const userTypes = ['Admin', 'Student', 'Supervisor', 'Client'];
  const [selectedType, setSelectedType] = useState('Select Role');

  const handleSelect = (type) => {
    setSelectedType(type);
    document.getElementById('popover-1').hidePopover(); // Close popover after selection
  };

  return (
    <div>
      {/* Main Button */}
      <button
        className='btn bg-purple-600 text-white font-bold px-4 py-2 rounded'
        popoverTarget='popover-1'
        style={{ anchorName: '--anchor-1' }}
        type='button'
      >
        {selectedType} <span>▾</span>
      </button>

      {/* Popover Dropdown */}
      <ul
        className='dropdown menu w-52 rounded-md bg-white shadow-md p-2'
        popover='auto'
        id='popover-1'
        style={{ positionAnchor: '--anchor-1', marginTop: '8px' }}
      >
        {userTypes.map((type) => (
          <li
            key={type}
            onClick={() => handleSelect(type)}
            className='cursor-pointer hover:bg-gray-200 p-2 rounded'
          >
            {type}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserTypeMenu;
