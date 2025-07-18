import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import OrderHistory from "./OrderHistory";
import axios from "axios";

export default function Account() {
  // Dummy user info, replace with real user data from context or API
  const user = {
    name: "Ezra Smaei",
    email: "ezrasmaei65@gmail.com",
    phone: "+254700000000",
    avatar: "", // Add avatar URL if available
  };

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(user);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwData, setPwData] = useState({ old: "", new1: "", new2: "" });
  const [delOpen, setDelOpen] = useState(false);

  const handleEditProfile = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const handleEditChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });
  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://127.0.0.1:8000/api/auth/users/me/",
        editData,
        { headers: { Authorization: `Token ${token}` } }
      );
      setEditOpen(false);
      // Optionally show a success message or refresh user info
    } catch (error) {
      alert("Failed to update profile.");
    }
  };

  const handlePwOpen = () => setPwOpen(true);
  const handlePwClose = () => setPwOpen(false);
  const handlePwChange = (e) =>
    setPwData({ ...pwData, [e.target.name]: e.target.value });
  const handlePwSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/api/auth/users/set_password/",
        {
          current_password: pwData.old,
          new_password: pwData.new1,
          re_new_password: pwData.new2,
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      setPwOpen(false);
      // Optionally show a success message
    } catch (error) {
      alert("Failed to change password.");
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:8000/api/my-orders-report/",
        {
          responseType: "blob",
          headers: { Authorization: `Token ${token}` },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "my_orders_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download PDF. Please make sure you are logged in.");
    }
  };

  const handleDelOpen = () => setDelOpen(true);
  const handleDelClose = () => setDelOpen(false);
  const handleDelConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        "http://127.0.0.1:8000/api/auth/users/me/",
        { headers: { Authorization: `Token ${token}` } }
      );
      setDelOpen(false);
      // Optionally log out the user and redirect to home/login
    } catch (error) {
      alert("Failed to delete account.");
    }
  };

  return (
    <Box p={4} maxWidth={1000} mx="auto">
      {/* User Info */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 64, height: 64 }}>
                {user.name[0]}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6" fontWeight={700}>
                {user.name}
              </Typography>
              <Typography color="text.secondary">{user.email}</Typography>
              <Typography color="text.secondary">{user.phone}</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={editData.name}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={editData.email}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Phone"
            name="phone"
            value={editData.phone}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={pwOpen} onClose={handlePwClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Current Password"
            name="old"
            type="password"
            value={pwData.old}
            onChange={handlePwChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="New Password"
            name="new1"
            type="password"
            value={pwData.new1}
            onChange={handlePwChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            name="new2"
            type="password"
            value={pwData.new2}
            onChange={handlePwChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePwClose}>Cancel</Button>
          <Button onClick={handlePwSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={delOpen} onClose={handleDelClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelClose}>Cancel</Button>
          <Button
            onClick={handleDelConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Orders Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h5" fontWeight={700}>
              My Orders
            </Typography>
            <IconButton
              onClick={handleDownload}
              color="primary"
              aria-label="Download PDF"
            >
              <DownloadIcon />
            </IconButton>
          </Box>
          <OrderHistory />
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Account Settings
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={handlePwOpen}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelOpen}
            >
              Delete Account
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
