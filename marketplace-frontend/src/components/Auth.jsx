import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Footer from "./Footer";

export default function Auth({ onAuth }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", username: "" });
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });
  const [forgotDialog, setForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmVisibility = () => setShowConfirm((prev) => !prev);

  const validateStrongPassword = (password) => {
    const lengthCheck = password.length >= 8;
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[!@#$%^&*]/.test(password);
    return lengthCheck && upper && lower && number && special;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isLogin) {
      if (form.password !== form.confirmPassword) {
        setSnackbar({ open: true, msg: "Passwords do not match.", severity: "error" });
        setLoading(false);
        return;
      }
      if (!validateStrongPassword(form.password)) {
        setSnackbar({
          open: true,
          msg: "Password must be 8+ chars, and include uppercase, lowercase, number, and special character.",
          severity: "error",
        });
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        const res = await axios.post("http://127.0.0.1:8000/api/auth/token/login/", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.auth_token);

        const profileRes = await axios.get("http://127.0.0.1:8000/api/auth/users/me/", {
          headers: { Authorization: `Token ${res.data.auth_token}` },
        });
        const { username, email } = profileRes.data;
        localStorage.setItem("user", JSON.stringify({ username, email }));

        setSnackbar({ open: true, msg: "Login successful!", severity: "success" });
        onAuth && onAuth();
        navigate("/");
      } else {
        await axios.post("http://127.0.0.1:8000/api/auth/users/", {
          username: form.username,
          email: form.email,
          password: form.password,
        });
        setSnackbar({ open: true, msg: "Registration successful! Please log in.", severity: "success" });
        setIsLogin(true);
        navigate("/");
      }
    } catch (err) {
      let msg = "Error: ";
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          msg += err.response.data;
        } else if (typeof err.response.data === 'object') {
          msg += Object.entries(err.response.data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join(' | ');
        } else {
          msg += JSON.stringify(err.response.data);
        }
      } else {
        msg += err.message || "Try again.";
      }
      setSnackbar({ open: true, msg, severity: "error" });
    }
    setLoading(false);
  };

  const handleForgot = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/users/reset_password/", { email: forgotEmail });
      setSnackbar({ open: true, msg: "Password reset link sent!", severity: "success" });
      setForgotDialog(false);
      setForgotEmail("");
    } catch {
      setSnackbar({ open: true, msg: "Failed to send reset link.", severity: "error" });
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" bgcolor="#f7fafc">
      <Box flex={1} display="flex" alignItems="center" justifyContent="center">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            minWidth: { xs: "90vw", sm: 320 }, // 90vw on mobile, 320px on small screens and up
            maxWidth: 360,                     // Prevents it from being too wide on desktop
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5" fontWeight={700} mb={2} align="center">Account</Typography>
              <form onSubmit={handleSubmit}>
                <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth sx={{ mb: 2 }} disabled={loading} autoFocus />
                <TextField label="Password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required fullWidth sx={{ mb: 2 }} disabled={loading} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>), }} />
                <Button type="submit" variant="contained" color="success" fullWidth sx={{ fontWeight: 700, py: 1.2 }} disabled={loading}>{loading ? <CircularProgress size={24} color="inherit" /> : "Login"}</Button>
              </form>
              <Button color="primary" fullWidth sx={{ mt: 2 }} onClick={() => setIsLogin(false)}>Don't have an account? Register</Button>
              <Button color="warning" fullWidth sx={{ mt: 1 }} onClick={() => setForgotDialog(true)}>Forgot Password?</Button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <Typography variant="h5" fontWeight={700} mb={2} align="center">Register</Typography>
              <TextField label="Username" name="username" value={form.username} onChange={handleChange} required fullWidth sx={{ mb: 2 }} disabled={loading} autoFocus />
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth sx={{ mb: 2 }} disabled={loading} />
              <TextField label="Password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required fullWidth sx={{ mb: 2 }} disabled={loading} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>), }} />
              <TextField label="Confirm Password" name="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} required fullWidth sx={{ mb: 2 }} disabled={loading} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={toggleConfirmVisibility} edge="end">{showConfirm ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>), }} />
              <Button type="submit" variant="contained" color="success" fullWidth sx={{ fontWeight: 700, py: 1.2 }} disabled={loading}>{loading ? <CircularProgress size={24} color="inherit" /> : "Register"}</Button>
              <Button color="primary" fullWidth sx={{ mt: 2 }} onClick={() => setIsLogin(true)}>Already have an account? Login</Button>
            </form>
          )}
        </Paper>

        <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.msg}</Alert>
        </Snackbar>

        <Dialog open={forgotDialog} onClose={() => setForgotDialog(false)}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField label="Email" type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} fullWidth sx={{ mt: 1 }} autoFocus disabled={loading} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setForgotDialog(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleForgot} variant="contained" color="success" disabled={loading}>{loading ? <CircularProgress size={20} color="inherit" /> : "Send Reset Link"}</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </Box>
  );
}
