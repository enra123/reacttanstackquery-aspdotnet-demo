import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import Home from './components/Home.tsx';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import WeatherForecast from './components/WeatherForecast.tsx';
import MenuBar from './components/Menu.tsx';
import { AuthProvider } from './hooks/useAuth.tsx';
import { ProtectedRoute, ReverseProtectedRoute } from "./components/AuthRoute.tsx";
import './App.css';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Box sx={{ display: 'flex', width: { xs: '100%', sm: '70%', md:'60%' }, margin: '0 auto' }}>
                    <Stack spacing={2} sx={{ width: '100%' }}>
                        <MenuBar />
                        <Paper
                            sx={{
                                p: 2,
                                margin: 'auto',
                                flexGrow: 1,
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                            }}
                        >
                            <Routes>
                                <Route path="/login" element={
                                    <ReverseProtectedRoute>
                                        <Login />
                                    </ReverseProtectedRoute>
                                } />
                                <Route path="/register" element={
                                    <ReverseProtectedRoute>
                                        <Register />
                                    </ReverseProtectedRoute>
                                } />
                                <Route path="/" element={<Home />} />
                                <Route path="/weather" element={
                                    <ProtectedRoute>
                                        <WeatherForecast />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </Paper>
                    </Stack>
                </Box>
            </AuthProvider>
        </BrowserRouter>
    );

}