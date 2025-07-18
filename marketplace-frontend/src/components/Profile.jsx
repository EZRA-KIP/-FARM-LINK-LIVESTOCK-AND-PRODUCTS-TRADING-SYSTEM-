import { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function Profile() {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [edit, setEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });
  const [pwDialog, setPwDialog] = useState(false);
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/auth/users/me/", {
          headers: { Authorization: `Token ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        setSnackbar({ open: true, msg: "Failed to load profile.", severity: "error" });
      }
    }
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://127.0.0.1:8000/auth/users/me/",
        { username: profile.username, email: profile.email },
        { headers: { Authorization: `Token ${token}` } }
      );
      setSnackbar({ open: true, msg: "Profile updated!", severity: "success" });
      setEdit(false);
    } catch (err) {
      setSnackbar({ open: true, msg: "Update failed.", severity: "error" });
    }
  };

  const handlePwChange = (e) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePwSubmit = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/users/set_password/",
        pwForm,
        { headers: { Authorization: `Token ${token}` } }
      );
      setSnackbar({ open: true, msg: "Password changed!", severity: "success" });
      setPwDialog(false);
      setPwForm({ current_password: "", new_password: "" });
    } catch (err) {
      setSnackbar({ open: true, msg: "Password change failed.", severity: "error" });
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f7fafc">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, minWidth: 340 }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center">
          My Profile
        </Typography>
        <TextField
          label="Username"
          name="username"
          value={profile.username}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          disabled={!edit}
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          disabled={!edit}
        />
        {edit ? (
          <Button variant="contained" color="success" fullWidth sx={{ fontWeight: 700, py: 1.2, mb: 1 }} onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 700, py: 1.2, mb: 1 }} onClick={() => setEdit(true)}>
            Edit Profile
          </Button>
        )}
        <Button variant="outlined" color="warning" fullWidth sx={{ fontWeight: 700, py: 1.2 }} onClick={() => setPwDialog(true)}>
          Change Password
        </Button>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
      <Dialog open={pwDialog} onClose={() => setPwDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            name="current_password"
            type="password"
            value={pwForm.current_password}
            onChange={handlePwChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            name="new_password"
            type="password"
            value={pwForm.new_password}
            onChange={handlePwChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwDialog(false)}>Cancel</Button>
          <Button onClick={handlePwSubmit} variant="contained" color="success">Change</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
