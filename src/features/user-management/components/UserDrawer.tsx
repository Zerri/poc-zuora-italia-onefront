// src/features/user-management/components/UserDrawer.tsx
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Title,
  IconButton,
  VaporIcon,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Button,
  VaporToolbar,
  Divider,
  Alert
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import { useTranslation } from '@1f/react-sdk';
import { User, UserFormData, UserRole, UserStatus } from '../../../types';

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  isEditing: boolean;
  onSave: (userData: UserFormData) => void;
  isLoading?: boolean;
}

/**
 * @component UserDrawer
 * @description Drawer for adding/editing users
 */
export const UserDrawer: React.FC<UserDrawerProps> = ({
  open,
  onClose,
  user,
  isEditing,
  onSave,
  isLoading = false
}) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    role: 'User',
    status: 'Active'
  });

  // Validation errors
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Initialize form when user changes
  useEffect(() => {
    if (isEditing && user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status
      });
    } else {
      // Reset form for new user
      setFormData({
        fullName: '',
        email: '',
        role: 'User',
        status: 'Active'
      });
    }
    // Clear errors when user changes
    setErrors({});
  }, [user, isEditing]);

  // Handle input changes
  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = t("features.userManagement.drawer.validation.fullNameRequired");
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = t("features.userManagement.drawer.validation.fullNameTooShort");
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t("features.userManagement.drawer.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("features.userManagement.drawer.validation.emailInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  // Handle close with confirmation if form is dirty
  const handleClose = () => {
    // Check if form has been modified
    const isFormDirty = isEditing 
      ? (user && (
          formData.fullName !== user.fullName ||
          formData.email !== user.email ||
          formData.role !== user.role ||
          formData.status !== user.status
        ))
      : (
          formData.fullName.trim() !== '' ||
          formData.email.trim() !== '' ||
          formData.role !== 'User' ||
          formData.status !== 'Active'
        );

    if (isFormDirty && !isLoading) {
      if (window.confirm(t("features.userManagement.drawer.confirmClose"))) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      width="400px"
      hideBackdrop={false}
      sx={{ "& .MuiDrawer-paperAnchorRight": { marginTop: "48px" } }}
    >
      <Title
        title={isEditing 
          ? t("features.userManagement.drawer.editUser") 
          : t("features.userManagement.drawer.addUser")
        }
        description={isEditing 
          ? t("features.userManagement.drawer.editDescription")
          : t("features.userManagement.drawer.addDescription")
        }
        divider
        rightItems={[
          <IconButton 
            key="close" 
            size="small" 
            variant="outlined" 
            onClick={handleClose}
            disabled={isLoading}
          >
            <VaporIcon icon={faClose} size="xl" />
          </IconButton>
        ]}
      />

      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {/* User Information Section */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t("features.userManagement.drawer.userInformation")}
        </Typography>

        {/* Full Name Field */}
        <TextField
          fullWidth
          label={t("features.userManagement.drawer.fullName")}
          placeholder={t("features.userManagement.drawer.fullNamePlaceholder")}
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          error={!!errors.fullName}
          helperText={errors.fullName}
          disabled={isLoading}
          sx={{ mb: 2 }}
        />

        {/* Email Field */}
        <TextField
          fullWidth
          type="email"
          label={t("features.userManagement.drawer.email")}
          placeholder={t("features.userManagement.drawer.emailPlaceholder")}
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          disabled={isLoading}
          sx={{ mb: 3 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Role Section */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t("features.userManagement.drawer.roleAndPermissions")}
        </Typography>

        {/* Role Selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>{t("features.userManagement.drawer.role")}</InputLabel>
          <Select
            value={formData.role}
            label={t("features.userManagement.drawer.role")}
            onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
            disabled={isLoading}
          >
            <MenuItem value="User">
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {t("features.userManagement.roles.user")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("features.userManagement.drawer.roleDescriptions.user")}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem value="Moderator">
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {t("features.userManagement.roles.moderator")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("features.userManagement.drawer.roleDescriptions.moderator")}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem value="Administrator">
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {t("features.userManagement.roles.administrator")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("features.userManagement.drawer.roleDescriptions.administrator")}
                </Typography>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Status Section */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t("features.userManagement.drawer.accountStatus")}
        </Typography>

        <FormControl component="fieldset" disabled={isLoading}>
          <RadioGroup
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as UserStatus)}
            sx={{ gap: 1 }}
          >
            <FormControlLabel
              value="Active"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {t("features.userManagement.status.active")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("features.userManagement.drawer.statusDescriptions.active")}
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="Inactive"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {t("features.userManagement.status.inactive")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("features.userManagement.drawer.statusDescriptions.inactive")}
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="Pending"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {t("features.userManagement.status.pending")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("features.userManagement.drawer.statusDescriptions.pending")}
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        {/* Warning for status change */}
        {isEditing && user && formData.status !== user.status && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {t("features.userManagement.drawer.statusChangeWarning")}
          </Alert>
        )}
      </Box>

      <Divider />

      {/* Footer Actions */}
      <VaporToolbar
        contentRight={[
          <Button 
            key="cancel" 
            variant="outlined" 
            color="secondary" 
            onClick={handleClose}
            disabled={isLoading}
          >
            {t("features.userManagement.drawer.cancel")}
          </Button>,
          <Button
            key="save"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading 
              ? t("features.userManagement.drawer.saving")
              : (isEditing 
                  ? t("features.userManagement.drawer.updateUser")
                  : t("features.userManagement.drawer.createUser")
                )
            }
          </Button>
        ]}
        size="medium"
        variant="regular"
      />
    </Drawer>
  );
};