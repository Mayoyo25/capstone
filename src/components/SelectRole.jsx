import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const VALID_USER_TYPES = ['ADMIN', 'STUDENT', 'SUPERVISOR', 'CLIENT'];

function SelectRole() {
  const [selectedRole, setSelectedRole] = useState('Select Role');

  // Convert backend types to display format
  const getDisplayLabel = (type) => {
    return {
      ADMIN: 'Admin',
      STUDENT: 'Student',
      SUPERVISOR: 'Supervisor',
      CLIENT: 'Client'
    }[type] || type;
  };

  const handleSelect = (type) => {
    if (VALID_USER_TYPES.includes(type)) {
      setSelectedRole(getDisplayLabel(type));
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 group">
      <div className="dropdown dropdown-hover dropdown-end">
        <div tabIndex={0} className="btn rounded-lg m-1 flex items-center gap-2">
          {selectedRole}
          <ChevronDown className="group-hover:hidden" size={18} />
          <ChevronUp className="hidden group-hover:inline-block" size={18} />
        </div>
        
        <ul className="dropdown-content menu bg-base-100 rounded-box w-52 shadow">
          {VALID_USER_TYPES.map((type) => (
            <li key={type} onClick={() => handleSelect(type)}>
              <a className="hover:bg-gray-100 active:bg-gray-200">
                {getDisplayLabel(type)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SelectRole;