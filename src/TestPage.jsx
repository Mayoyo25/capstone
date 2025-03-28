import { ChevronDown, ChevronUp } from "lucide-react";
import { mapUserTypeToFrontend, VALID_USER_TYPES } from "./utils/userTypeUtils";
import { useState } from "react";

function TestPage() {
  const [selectedRole, setSelectedRole] = useState('Select Role');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (type) => {
    if (VALID_USER_TYPES.includes(type)) {
      setSelectedRole(mapUserTypeToFrontend(type));
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button 
        className="btn" 
        popoverTarget="popover-1" 
        style={{ anchorName: "--anchor-1" }}
        onClick={toggleDropdown}
      >
        {selectedRole}
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <ul 
        className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
        popover="auto" 
        id="popover-1" 
        style={{ positionAnchor: "--anchor-1" }}
      >
        {VALID_USER_TYPES.map((type) => (
          <li key={type} onClick={() => handleSelect(type)}>
            <a className="hover:bg-gray-100 active:bg-gray-200">
              {mapUserTypeToFrontend(type)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestPage;