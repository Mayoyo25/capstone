export const VALID_USER_TYPES = ['Admin', 'Student', 'Supervisor', 'Client'];

export const mapUserTypeToFrontend = (backendType) => {
  const userTypeMap = {
    ADMIN: 'Admin',
    STUDENT: 'Student',
    SUPERVISOR: 'Supervisor',
    CLIENT: 'Client',
  };
  return userTypeMap[backendType] || backendType;
};

export const mapUserTypeToBackend = (frontendType) => {
  const userTypeMap = {
    Admin: 'ADMIN',
    Student: 'STUDENT',
    Supervisor: 'SUPERVISOR',
    Client: 'CLIENT',
  };
  return userTypeMap[frontendType] || frontendType;
};