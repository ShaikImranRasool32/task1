import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Tooltip,
  Link,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HomeIcon from '@mui/icons-material/Home';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        bgcolor: 'white',
        borderBottom: '1px solid #E0E0E0',
        px: 2,
        py: 1,
        zIndex: 1300,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 1 : 0,
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'center' : 'flex-start',
          }}
        >
          <IconButton aria-label="home" sx={{ color: '#6C757D' }}>
            <HomeIcon />
          </IconButton>
          <Link
            href="#"
            underline="none"
            sx={{
              color: '#6C757D',
              fontWeight: 600,
              fontSize: 16,
              display: isMobile ? 'none' : 'block',
            }}
          >
            Dashboard V2
          </Link>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            justifyContent: 'flex-end',
            width: '100%',
            gap: 1.5,
            overflow: 'hidden',
          }}
        >
          {/* Search Field */}
          <TextField
            placeholder="Search anything..."
            size="small"
            variant="outlined"
            fullWidth={isMobile}
            sx={{
              bgcolor: '#F1F3F4',
              borderRadius: 1,
              maxWidth: isMobile ? '100%' : 300,
              '& .MuiOutlinedInput-root': {
                paddingLeft: '48px',
              },
              flexGrow: 1,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6C757D', fontSize: 28 }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Dropdown */}
          <Button
            id="dropdown-button"
            aria-controls={open ? 'dropdown-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleDropdownClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              textTransform: 'none',
              color: '#6C757D',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content',
            }}
          >
            Sample Dropdown
          </Button>
          <Menu
            id="dropdown-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleDropdownClose}
            MenuListProps={{
              'aria-labelledby': 'dropdown-button',
            }}
          >
            <MenuItem onClick={handleDropdownClose}>Sample Item 1</MenuItem>
            <MenuItem onClick={handleDropdownClose}>Sample Item 2</MenuItem>
            <MenuItem onClick={handleDropdownClose}>Sample Item 3</MenuItem>
          </Menu>

          {/* Notification */}
          <Tooltip title="Notifications">
            <IconButton aria-label="notifications" sx={{ color: '#6C757D' }}>
              <NotificationsNoneIcon />
            </IconButton>
          </Tooltip>

          {/* Avatar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              pr: isMobile ? 0 : 1,
              pl: isMobile ? 0 : 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#4370F5',
                width: 32,
                height: 32,
                fontSize: 14,
              }}
            >
              U
            </Avatar>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
