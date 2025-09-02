// src/features/user-management/components/UserDrawer.tsx
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  IconButton,
  VaporIcon
} from "@vapor/v3-components";
import { faClose } from "@fortawesome/pro-regular-svg-icons/faClose";
import { useTranslation } from '@1f/react-sdk';
import type { User, UserMutationData } from '../../../types/user';

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: UserMutationData) => void;
  user: User | null;
  isEditing: boolean;
  isSaving?: boolean;
}

/**
 * Drawer per creare/modificare utenti
 */
export const UserDrawer: React.FC<UserDrawerProps> = ({
  open,
  onClose,
  onSave,
  user,
  isEditing,
  isSaving = false
}) => {
  const { t } = useTranslation();

  // State del form
  const [formData, setFormData] = useState<UserMutationData>({
    fullName: '',
    email: '',
    role: 'user',
    status: 'active'
  });

  // State per errori di validazione
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State per indicare se ci sono modifiche non salvate
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Inizializza il form quando cambia l'utente o la modalità
  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        registrationDate: user.registrationDate,
        lastAccess: user.lastAccess
      });
      setHasUnsavedChanges(false);
    } else {
      setFormData({
        fullName: '',
        email: '',
        role: 'user',
        status: 'active'
      });
      setHasUnsavedChanges(false);
    }
    setErrors({});
  }, [user, isEditing, open]);

  // Controlla se ci sono modifiche non salvate
  useEffect(() => {
    if (isEditing && user) {
      const hasChanges = 
        formData.fullName !== user.fullName ||
        formData.email !== user.email ||
        formData.role !== user.role ||
        formData.status !== user.status;
      setHasUnsavedChanges(hasChanges);
    } else {
      const hasChanges = 
        formData.fullName !== '' ||
        formData.email !== '' ||
        formData.role !== 'user' ||
        formData.status !== 'active';
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, user, isEditing]);

  // Validazione del form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validazione nome
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('features.userManagement.drawer.validation.nameRequired');
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = t('features.userManagement.drawer.validation.nameMinLength');
    }

    // Validazione email
    if (!formData.email.trim()) {
      newErrors.email = t('features.userManagement.drawer.validation.emailRequired');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t('features.userManagement.drawer.validation.emailInvalid');
      }
    }

    // Validazione ruolo
    if (!formData.role) {
      newErrors.role = t('features.userManagement.drawer.validation.roleRequired');
    }

    // Validazione stato
    if (!formData.status) {
      newErrors.status = t('features.userManagement.drawer.validation.statusRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler per i cambiamenti dei campi
  const handleFieldChange = (field: keyof UserMutationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Rimuovi l'errore per questo campo se esiste
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handler per il salvataggio
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  // Handler per la chiusura
  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm(t('features.userManagement.drawer.confirmClose'))) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Titolo e descrizione del drawer
  const title = isEditing 
    ? t('features.userManagement.drawer.editUser') 
    : t('features.userManagement.drawer.addUser');
  const description = isEditing 
    ? t('features.userManagement.drawer.editDescription') 
    : t('features.userManagement.drawer.addDescription');

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: 400 }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <VaporIcon icon={faClose} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {/* Alert per modifiche non salvate */}
          {isEditing && user && hasUnsavedChanges && (
            <Alert severity="info" sx={{ mb: 3 }}>
              {t('features.userManagement.drawer.unsavedChanges')}
            </Alert>
          )}

          {/* Form Fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Nome */}
            <TextField
              label={t('features.userManagement.drawer.fields.name')}
              value={formData.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
              required
              fullWidth
            />

            {/* Email */}
            <TextField
              label={t('features.userManagement.drawer.fields.email')}
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
              fullWidth
            />

            {/* Ruolo */}
            <FormControl fullWidth required error={!!errors.role}>
              <InputLabel>{t('features.userManagement.drawer.fields.role')}</InputLabel>
              <Select
                value={formData.role}
                label={t('features.userManagement.drawer.fields.role')}
                onChange={(e) => handleFieldChange('role', e.target.value)}
              >
                <MenuItem value="user">
                  {t('features.userManagement.roles.user')}
                </MenuItem>
                <MenuItem value="moderator">
                  {t('features.userManagement.roles.moderator')}
                </MenuItem>
                <MenuItem value="administrator">
                  {t('features.userManagement.roles.administrator')}
                </MenuItem>
              </Select>
              {errors.role && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.role}
                </Typography>
              )}
            </FormControl>

            {/* Stato */}
            <FormControl fullWidth required error={!!errors.status}>
              <InputLabel>{t('features.userManagement.drawer.fields.status')}</InputLabel>
              <Select
                value={formData.status}
                label={t('features.userManagement.drawer.fields.status')}
                onChange={(e) => handleFieldChange('status', e.target.value)}
              >
                <MenuItem value="active">
                  {t('features.userManagement.status.active')}
                </MenuItem>
                <MenuItem value="inactive">
                  {t('features.userManagement.status.inactive')}
                </MenuItem>
                <MenuItem value="pending">
                  {t('features.userManagement.status.pending')}
                </MenuItem>
              </Select>
              {errors.status && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.status}
                </Typography>
              )}
            </FormControl>

            {/* Info aggiuntive per utenti esistenti */}
            {isEditing && user && (
              <>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('features.userManagement.drawer.info.registrationDate')}:</strong> {' '}
                    {new Date(user.registrationDate).toLocaleDateString('it-IT')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('features.userManagement.drawer.info.lastAccess')}:</strong> {' '}
                    {user.lastAccess 
                      ? new Date(user.lastAccess).toLocaleString('it-IT')
                      : t('features.userManagement.grid.neverAccessed')
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('features.userManagement.drawer.info.userId')}:</strong> {user.id}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          p: 3, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end'
        }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isSaving}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving || Object.keys(errors).length > 0}
          >
            {isSaving 
              ? t('common.saving') 
              : (isEditing ? t('common.update') : t('common.create'))
            }
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};