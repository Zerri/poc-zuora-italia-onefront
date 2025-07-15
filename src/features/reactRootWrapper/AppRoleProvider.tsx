import { RoleProvider } from '../../contexts/RoleContext';

export const AppRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RoleProvider>
      {children}
    </RoleProvider>
  );
};