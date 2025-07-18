// src/components/Navbar.jsx
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../context/CartContext";
import Tooltip from "@mui/material/Tooltip";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDashboardClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Categories", to: "/categories" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: "#388e3c" }}>
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <Typography
          variant="h6"
          component={NavLink}
          to="/"
          sx={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: "bold",
            letterSpacing: 1,
            mr: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            transition: "color 0.2s",
            "&:hover": { color: "#fff176" },
          }}
        >
          <img
            src="/Ezra'slogo[1].png"
            alt="Farmlink Logo"
            style={{
              height: 56, // Increased size for better visibility
              marginRight: 16,
              verticalAlign: "middle",
              borderRadius: 8,
              boxShadow: "0 2px 12px rgba(0,0,0,0.13)",
              background: "#fff", // White background for contrast
              padding: 6, // Padding around the logo
              border: "2px solid #f68b1e" // Orange border for branding
            }}
          />
          Farmlink
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={handleDrawerToggle}
              >
                <List>
                  {navLinks.map((item) => (
                    <ListItem key={item.to} disablePadding>
                      <ListItemButton component={NavLink} to={item.to}>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {user?.is_staff && (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton component={NavLink} to="/seller-center">
                          <ListItemText primary="Seller Center" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton component={NavLink} to="/vet-dashboard">
                          <ListItemText primary="Vet Dashboard" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton component={NavLink} to="/admin-dashboard">
                          <ListItemText primary="Admin Dashboard" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                  <ListItem disablePadding>
                    <ListItemButton component={NavLink} to="/cart">
                      <ShoppingCartIcon sx={{ mr: 1 }} />
                      <ListItemText primary={`Cart (${cartCount})`} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component={NavLink} to="/account">
                      <ListItemText primary="Account" />
                    </ListItemButton>
                  </ListItem>
                  {isAuthenticated && (
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              component={NavLink}
              to="/"
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              Home
            </Button>
            <Button
              component={NavLink}
              to="/categories"
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              Categories
            </Button>
            <Button
              component={NavLink}
              to="/about"
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              About
            </Button>
            <Button
              component={NavLink}
              to="/contact"
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              Contact
            </Button>
            {/* Dashboard dropdown for all logged-in users */}
            {isAuthenticated && (
              <Box sx={{ ml: 1 }}>
                <Button
                  color="inherit"
                  sx={{ fontWeight: 600 }}
                  id="dashboard-menu-button"
                  aria-controls="dashboard-menu"
                  aria-haspopup="true"
                  onClick={handleDashboardClick}
                >
                  Dashboard
                </Button>
                <Menu
                  id="dashboard-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  MenuListProps={{ "aria-labelledby": "dashboard-menu-button" }}
                >
                  <MenuItem
                    component={NavLink}
                    to="/dashboard"
                    onClick={() => setAnchorEl(null)}
                  >
                    Analytics Dashboard
                  </MenuItem>
                  <MenuItem
                    component={NavLink}
                    to="/seller-center"
                    onClick={() => setAnchorEl(null)}
                  >
                    Seller Center
                  </MenuItem>
                  {user?.is_staff && (
                    <MenuItem
                      component={NavLink}
                      to="/vet-dashboard"
                      onClick={() => setAnchorEl(null)}
                    >
                      Vet Dashboard
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            )}
            <Tooltip
              title={
                cartCount === 0
                  ? "Cart is empty"
                  : `${cartCount} item(s) in cart`
              }
              arrow
            >
              <Badge badgeContent={cartCount} color="error" showZero>
                <Button
                  component={NavLink}
                  to="/cart"
                  color="inherit"
                  sx={{
                    minWidth: 0,
                    p: 1,
                    borderRadius: "50%",
                    transition: "background 0.2s",
                    "&:hover": { background: "#43a047" },
                  }}
                >
                  <ShoppingCartIcon fontSize="medium" />
                </Button>
              </Badge>
            </Tooltip>
            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  sx={{ fontWeight: 600 }}
                  onClick={() => navigate("/account")}
                >
                  Account
                </Button>
                <Button
                  color="inherit"
                  sx={{ fontWeight: 600 }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                sx={{ fontWeight: 600 }}
                onClick={() => navigate("/account")}
              >
                Account
              </Button>
            )}
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
