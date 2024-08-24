import { MouseEvent, useState } from 'react';

import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { useAuth } from "../hooks/useAuth";

type MenuItem = {
    name: string,
    navigateTo: string,
    permission: string,
}
export default function MenuBar() {
    const { email, permissions, doLogout } = useAuth();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        doLogout();
        setAnchorElNav(null);
    }

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (url: string) => {
        setAnchorElNav(null);
        navigate(url);
    };

    const handleCloseUserMenu = (url: string) => {
        setAnchorElUser(null);
        navigate(url);
    };

    const menuItems = [
        { name: 'Register', navigateTo: '/register', permission: '' },
        { name: 'Login', navigateTo: '/login', permission: '' },
        { name: email, navigateTo: '/weather', permission: 'view' },
    ]

    const menuAccountItems = [
        { name: 'Dashboard', navigateTo: '/weather' },
    ]

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, padding: '1em' }}>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            onClick={() => handleCloseUserMenu('/')} sx={{ p: 0 }}
                        >
                            <HomeIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {menuItems.filter((item) => permissions.includes(item.permission)).map((item) => (
                                <MenuItem key={item.name} onClick={() => handleCloseNavMenu(item.navigateTo)}>
                                    <Typography textAlign="center">{item.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {menuItems.filter((item) => permissions.includes(item.permission)).map((item) => (
                            <Button
                                key={item.name}
                                onClick={() => handleCloseNavMenu(item.navigateTo)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </Box>

                    {email &&
                        <Box sx={{ flexGrow: 0 }}>
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                onClick={handleOpenUserMenu} sx={{ p: 0 }}
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {menuAccountItems.map((item) => (
                                    <MenuItem key={item.name} onClick={() => handleCloseUserMenu(item.navigateTo)}>
                                        <Typography textAlign="center">{item.name}</Typography>
                                    </MenuItem>
                                ))}
                                <MenuItem key='logout' onClick={handleLogout}>
                                    <Typography textAlign="center">Log out</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    }
                </Toolbar>
            </Container>
        </AppBar>

    );
}