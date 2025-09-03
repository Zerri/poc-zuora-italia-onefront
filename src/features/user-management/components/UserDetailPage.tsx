// src/features/user-management/components/UserDetailPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VaporThemeProvider,
  VaporPage,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  ExtendedTabs,
  ExtendedTab,
  Title,
  VaporIcon,
  TextField,
  FormControl,
  FormControlLabel,
  Switch,
  Avatar,
  Chip
} from "@vapor/v3-components";
import { faArrowLeft, faFloppyDisk, faEllipsisVertical } from "@fortawesome/pro-regular-svg-icons";

interface UserDetailPageProps {}

export const UserDetailPage: React.FC<UserDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);

  // Mock user data - in futuro sarà caricato da API
  const mockUser = {
    _id: id,
    fullName: 'Marco Rossi',
    email: 'marco.rossi@example.com',
    role: 'admin' as const,
    status: 'active' as const,
    registrationDate: '2024-01-15T10:30:00Z',
    lastAccess: '2024-03-01T14:20:00Z',
    avatar: null
  };

  const handleBack = () => {
    navigate('/admin/users');
  };

  const handleSave = () => {
    console.log('💾 Saving user data...');
    // TODO: Implement save functionality
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <VaporThemeProvider>
      <VaporPage>
        <Title
          leftItems={[
            <IconButton key="back" color="primary" size="small" onClick={handleBack}>
              <VaporIcon icon={faArrowLeft} size="xl" />
            </IconButton>
          ]}
          rightItems={[
            <Button 
              key="save-user" 
              size="small" 
              variant="contained" 
              startIcon={<VaporIcon icon={faFloppyDisk} />}
              onClick={handleSave}
            >
              Salva
            </Button>,
            <IconButton key="options" size="small">
              <VaporIcon icon={faEllipsisVertical} size="xl" />
            </IconButton>
          ]}
          size="small"
          title={`${mockUser.fullName}`}
          description={`${mockUser.email} • ${mockUser.role.toUpperCase()}`}
        />

        <VaporPage.Section>
          <ExtendedTabs value={activeTab} onChange={handleTabChange} size="small" variant="standard">
            <ExtendedTab label="Profile" />
            <ExtendedTab label="Activity" />
            <ExtendedTab label="Permissions" />
            <ExtendedTab label="Settings" />
          </ExtendedTabs>

          {/* Tab Profile */}
          {activeTab === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                Informazioni Profilo
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  {/* Avatar Section */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 3,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                  }}>
                    <Avatar sx={{ width: 80, height: 80, mb: 2, fontSize: '2rem' }}>
                      {mockUser.fullName[0]}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {mockUser.fullName}
                    </Typography>
                    <Chip 
                      label={mockUser.role} 
                      color={mockUser.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                    <Chip 
                      label={mockUser.status} 
                      color={mockUser.status === 'active' ? 'success' : 'error'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="body2" gutterBottom>Nome Completo</Typography>
                        <TextField
                          value={mockUser.fullName}
                          fullWidth
                          size="small"
                          variant="outlined"
                        />
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="body2" gutterBottom>Email</Typography>
                        <TextField
                          value={mockUser.email}
                          fullWidth
                          size="small"
                          variant="outlined"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="body2" gutterBottom>Data Registrazione</Typography>
                        <TextField
                          value={new Date(mockUser.registrationDate).toLocaleDateString()}
                          fullWidth
                          size="small"
                          variant="outlined"
                          disabled
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography variant="body2" gutterBottom>Ultimo Accesso</Typography>
                        <TextField
                          value={mockUser.lastAccess ? new Date(mockUser.lastAccess).toLocaleString() : 'Mai'}
                          fullWidth
                          size="small"
                          variant="outlined"
                          disabled
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab Activity */}
          {activeTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                Cronologia Attività
              </Typography>
              
              <Box sx={{ 
                p: 4,
                textAlign: 'center',
                border: '1px dashed #ccc',
                borderRadius: 2,
                backgroundColor: '#f9f9f9'
              }}>
                <Typography variant="body1" color="text.secondary">
                  📈 Sezione Attività in sviluppo
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Qui verranno mostrati i log di accesso, le modifiche al profilo e altre attività dell'utente
                </Typography>
              </Box>
            </Box>
          )}

          {/* Tab Permissions */}
          {activeTab === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                Gestione Permessi
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Ruolo Utente
                    </Typography>
                    <FormControlLabel
                      control={<Switch checked={mockUser.role === 'admin'} />}
                      label="Amministratore"
                    />
                    <FormControlLabel
                      control={<Switch checked={false} />}
                      label="Utente Standard"
                    />
                    <FormControlLabel
                      control={<Switch checked={false} />}
                      label="Moderatore"
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Permessi Specifici
                    </Typography>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Gestione Utenti"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Gestione Preventivi"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Accesso Reports"
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab Settings */}
          {activeTab === 3 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                Impostazioni Account
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Sicurezza Account
                    </Typography>
                    <Button variant="outlined" sx={{ mb: 2, display: 'block' }}>
                      Cambia Password
                    </Button>
                    <Button variant="outlined" sx={{ mb: 2, display: 'block' }}>
                      Attiva 2FA
                    </Button>
                    <Button variant="outlined" color="error">
                      Disattiva Account
                    </Button>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Notifiche
                    </Typography>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="SMS Notifications"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Push Notifications"
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </VaporPage.Section>
      </VaporPage>
    </VaporThemeProvider>
  );
};