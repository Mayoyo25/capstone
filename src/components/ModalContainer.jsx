import React, { useRef } from 'react';
import Modal from 'react-modal';

// Default custom styles that can be overridden by props
const defaultStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    borderRadius: '32px',
    padding: '0',
    border: 'none',
    width: '90%',
    maxWidth: '800px',
    maxHeight: 'calc(90vh - 4px)',
    height: 'auto',
    overflow: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
};

const ModalContainer = ({
  isOpen,
  onAfterOpen,
  onRequestClose,
  contentLabel,
  title,
  children,
  footerContent,
  customStyles = {},
  shouldCloseOnOverlayClick = true,
  shouldCloseOnEsc = true,
}) => {
  // Merge custom styles with default styles
  const mergedStyles = {
    content: { ...defaultStyles.content, ...customStyles.content },
    overlay: { ...defaultStyles.overlay, ...customStyles.overlay },
  };

  // Subtitle reference for onAfterOpen
  const subtitle = useRef(null);

  const defaultAfterOpen = () => {
    if (subtitle.current) {
      subtitle.current.focus();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={onAfterOpen || defaultAfterOpen}
      onRequestClose={onRequestClose}
      style={mergedStyles}
      contentLabel={contentLabel}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      shouldCloseOnEsc={shouldCloseOnEsc}
      customStyles={{
        content: { maxHeight: 'fit-content' },
      }}
    >
      {/* Modal Header */}
      {title && (
        <div className='flex justify-between items-center py-2 px-6 border-b'>
          <h2 ref={subtitle} className='text-lg font-semibold'>
            {title}
          </h2>
          <button
            onClick={onRequestClose}
            className='text-gray-400 hover:text-gray-600 focus:outline-none'
            aria-label='Close Modal'
          >
            ✕
          </button>
        </div>
      )}

      {/* Modal Body */}
      <div className='p-6'>{children}</div>

      {/* Modal Footer - if provided */}
      {footerContent && (
        <div className='flex justify-center space-x-3 p-4 border-t'>
          {footerContent}
        </div>
      )}
    </Modal>
  );
};

export default ModalContainer;
