import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import stayoLogo from "../../assets/images/stayo_logo.jpeg";
import MdPhone from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { AppBar, Toolbar, Button, Box, IconButton, Typography } from "@mui/material";
import { useSelector } from 'react-redux';
import UserAvatar from './UserAvatar';

interface NavItem {
  name: string;
  path: string;
  type?: string;
  phone?: string;
}

interface NavbarProps {
  navItems: NavItem[];
  onOpenSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ navItems, onOpenSidebar }) => {
  const user = useSelector((state: any) => state.user.userDetails);
  return (
    <AppBar position="static" elevation={0} sx={{ background: '#fff', color: '#222', boxShadow: '0 2px 8px 0 #e0e0e0' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 72 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/">
            <img src={stayoLogo} alt="Stayo Logo" style={{ height: 56, width: 56, borderRadius: 12, marginRight: 16 }} />
          </NavLink>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, color: '#00B0FF' }}>Stayo</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navItems.map((item) => {
            if (item.type === "mobNo") {
              return (
                <a
                  key={item.name}
                  href={`tel:${item.name.replace(/\D/g, '')}`}
                  style={{
                    textDecoration: 'none',
                    color: '#222',
                    fontWeight: 500,
                    marginRight: 12,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    borderRadius: 6,
                    transition: 'background 0.2s',
                  }}
                >
                  <MdPhone sx={{ fontSize: 18, marginRight: 0.5 }} />
                  {item.name}
                </a>
              );
            }
            if (item.type === "whatsapp") {
              // WhatsApp link with prefilled number (assume Indian number)
              const phone = item.phone || item.name;
              return (
                <a
                  key={item.name}
                  href={`https://wa.me/91${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: '#222',
                    fontWeight: 500,
                    marginRight: 12,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    borderRadius: 6,
                    transition: 'background 0.2s',
                  }}
                >
                  <WhatsAppIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
                  {item.name}
                </a>
              );
            }
            // Default NavLink for other items
            return (
              <NavLink
                key={item.name}
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#00B0FF' : '#222',
                  fontWeight: 500,
                  marginRight: 12,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: isActive ? 'rgba(0,176,255,0.08)' : 'none',
                  transition: 'background 0.2s',
                })}
              >
                {item.name}
              </NavLink>
            );
          })}
          {user ? (
            <UserAvatar />
          ) : (
            <Button
              onClick={onOpenSidebar}
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #00B0FF 60%, #0099cc 100%)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 'none',
                ml: 1,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(90deg, #0099cc 60%, #00B0FF 100%)',
                  boxShadow: 'none',
                },
              }}
            >
              Sign In 
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
