import React, { useEffect, useRef } from 'react';
import '../styles/UserTypeMenu.css';

function UserTypeMenu({ onSelect, closeMenu }) {
  const menuRef = useRef(null);
 
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    }
   
    const buttonElement = menuRef.current?.parentElement?.querySelector('.user-type-button');
    if (buttonElement && menuRef.current) {
      const rect = buttonElement.getBoundingClientRect();
      
      menuRef.current.style.top = `${rect.bottom + window.scrollY + 2}px`;
      menuRef.current.style.left = `${rect.left + window.scrollX}px`;
      
      menuRef.current.style.width = '200px';
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMenu]);

  const userTypes = ['Admin', 'Student', 'Supervisor', 'Client'];
  
  return (
    <div className="user-type-menu" ref={menuRef}>
      {userTypes.map((type) => (
        <div
          key={type}
          className="user-type-option"
          onClick={() => onSelect(type)}
        >
          {type}
        </div>
      ))}
    </div>
  );
}

export default UserTypeMenu;