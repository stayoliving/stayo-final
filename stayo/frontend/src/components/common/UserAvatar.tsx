import React, { useState } from 'react';
import { Avatar, Menu, MenuItem, Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../../features/userSlice';


const UserAvatar: React.FC = () => {
  const user_details = useSelector((state: any) => state.user.userDetails);
  const user = user_details?.user;
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(logoutAction());
    handleClose();
  };

  return (
    <Box sx={{ display: 'inline-block', ml: 2 }}>
      <Avatar
        sx={{ bgcolor: '#00B0FF', cursor: 'pointer' }}
        onClick={handleClick}
      >
        {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
      </Avatar>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ px: 2, py: 1, minWidth: 220 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user?.first_name || ''} {user?.last_name || ''}
          </Typography>
          {user?.email && (
            <Typography variant="body2" color="text.secondary">
              <b>Email:</b> {user.email}
            </Typography>
          )}
          {user?.phone_number && (
            <Typography variant="body2" color="text.secondary">
              <b>Phone:</b> {user.phone_number}
            </Typography>
          )}
          {!user?.first_name && !user?.last_name && !user?.email && !user?.phone_number && (
            <Typography variant="body2" color="text.secondary">
              No user details available.
            </Typography>
          )}
        </Box>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default UserAvatar;
