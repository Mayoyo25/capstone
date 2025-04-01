import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import ModalContainer from './ModalContainer';
import { createProject } from '../services/projects';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useAuthStore from '../stores/authStore';

const CustomDateInput = React.forwardRef(
  ({ value, onClick, onChange, placeholder, errors }, ref) => (
    <div className='relative'>
      <input
        type='text'
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 border ${
          errors?.deadline ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
        readOnly
      />
      <span className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400'>
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
          ></path>
        </svg>
      </span>
    </div>
  )
);

const ClientNewProjectModal = ({ isOpen, onClose }) => {
  const {
    userData: { user_type },
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: '',
      description: '',
      field: '',
      categories: '',
    },
    mode: 'onBlur',
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('user_type', user_type);
      formData.append('title', data.projectName);
      formData.append('description', data.description);
      formData.append('field', data.field);
      formData.append('categories', data.categories);

      if (selectedDate) {
        formData.append(
          'deadline',
          new Date(selectedDate).toISOString().split('T')[0]
        );
      }

      files.forEach((file) => formData.append('files', file));

      await createProject(formData);
      toast.success('Project created successfully!');
      reset();
      setFiles([]);
      setSelectedDate(null);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create project');
    }
  };

  // Footer buttons
  const footerContent = (
    <>
      <button
        type='button'
        onClick={() => {
          reset();
          setFiles([]);
          setSelectedDate(null);
          onClose();
        }}
        className='px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer'
      >
        Cancel
      </button>
      <button
        type='submit'
        form='new-project-form'
        className='px-6 py-2 bg-brand-darker text-white rounded-md hover:bg-brand-darker/80 focus:outline-none focus:ring-2 focus:ring-teal-300 cursor-pointer'
      >
        Create
      </button>
    </>
  );

  return (
    <ModalContainer
      isOpen={isOpen}
      onRequestClose={() => {
        reset();
        setFiles([]);
        setSelectedDate(null);
        onClose();
      }}
      title='New Project'
      contentLabel='New Project Modal'
      footerContent={footerContent}
    >
      <form
        id='new-project-form'
        onSubmit={handleSubmit(onFormSubmit)}
        className='space-y-6 h-full w-full flex-1 overflow-auto'
      >
        {/* Project Name and Deadline in same row */}
        <div className='flex space-x-4'>
          <div className='w-1/2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Project Name
              {errors.projectName && (
                <span className='text-red-500 text-xs ml-1'>* required</span>
              )}
            </label>
            <input
              type='text'
              {...register('projectName', { required: true })}
              placeholder='Type here...'
              className={`w-full p-2 border ${
                errors.projectName ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
          </div>
          <div className='w-1/2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Deadline
              {errors.deadline && (
                <span className='text-red-500 text-xs ml-1'>* required</span>
              )}
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
              }}
              placeholderText='YYYY/MM/DD'
              dateFormat='yyyy/MM/dd'
              minDate={new Date()} // This prevents selecting past dates
              customInput={<CustomDateInput errors={errors} />}
              className={`w-full p-2 border ${
                errors.deadline ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
          </div>
        </div>
        {/* Description */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Description
            {errors.description && (
              <span className='text-red-500 text-xs ml-1'>* required</span>
            )}
          </label>
          <textarea
            {...register('description', { required: true })}
            placeholder='Type here...'
            rows='4'
            className={`w-full p-2 border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
        </div>

        {/* Field and Project Categories in same row */}
        <div className='flex space-x-4'>
          <div className='w-1/2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Field
              {errors.field && (
                <span className='text-red-500 text-xs ml-1'>* required</span>
              )}
            </label>
            <input
              type='text'
              {...register('field', { required: true })}
              placeholder='Type here...'
              className={`w-full p-2 border ${
                errors.field ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
          </div>
          <div className='w-1/2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Project Categories
              {errors.categories && (
                <span className='text-red-500 text-xs ml-1'>* required</span>
              )}
            </label>
            <input
              type='text'
              {...register('categories', { required: true })}
              placeholder='Type here...'
              className={`w-full p-2 border ${
                errors.categories ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
          </div>
        </div>

        {/* Attach Files */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Attach Files
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center ${
              isDragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <div className='flex justify-center mb-2'>
              <svg
                className='w-12 h-12 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1'
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                ></path>
              </svg>
            </div>
            {isDragActive ? (
              <p className='text-sm text-teal-600'>Drop the files here...</p>
            ) : (
              <p className='text-sm text-gray-500'>
                Drag & drop files here, or click to select files
              </p>
            )}
            <div className='mt-2'>
              <button
                type='button'
                className='px-4 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300'
              >
                Browse Files
              </button>
            </div>
          </div>

          {/* Preview uploaded files */}
          {files.length > 0 && (
            <div className='mt-4 space-y-2'>
              <h4 className='text-sm font-medium text-gray-700'>
                Selected Files:
              </h4>
              <ul className='space-y-2'>
                {files.map((file, index) => (
                  <li
                    key={file.name}
                    className='flex items-center justify-between p-2 bg-gray-50 rounded-md'
                  >
                    <span className='text-sm text-gray-600 truncate max-w-xs'>
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </span>
                    <button
                      type='button'
                      onClick={() => removeFile(index)}
                      className='text-red-500 hover:text-red-700'
                    >
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>
    </ModalContainer>
  );
};

export default ClientNewProjectModal;
