import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const translateError = (err) => {
    const msg = err.response?.data?.new_password?.[0] || err.response?.data?.detail;
    if (!msg) return "❌ Failed to reset password. Please try again.";
    if (msg.includes("too common")) return "❌ Password is too common. Try something more unique.";
    if (msg.includes("too short")) return "❌ Password must be at least 8 characters long.";
    if (msg.includes("too similar")) return "❌ Password is too similar to your email or name.";
    if (msg.includes("entirely numeric")) return "❌ Password cannot be all numbers.";
    return `❌ ${msg}`;
  };

  // Password strength checks
  const isStrong = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    if (Object.values(isStrong).includes(false)) {
      setError("❌ Password does not meet strength requirements.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/auth/users/reset_password_confirm/", {
        uid,
        token,
        new_password: password,
      });

      setSuccess(true);
      setTimeout(() => navigate("/auth"), 3000);
    } catch (err) {
      console.error("Reset error:", err.response?.data || err.message);
      setError(translateError(err));
    }
  };

  return (
    <Box maxWidth={420} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Reset Password</Typography>

      {success ? (
        <Alert severity="success">
          ✅ Password reset successful! Redirecting to login...
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm New Password"
            type={showConfirm ? "text" : "password"}
            fullWidth
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(prev => !prev)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* ✅ Password checklist */}
          <Typography variant="subtitle2" mt={2}>Password must include:</Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary={isStrong.length ? "✅ 8+ characters" : "❌ At least 8 characters"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={isStrong.upper ? "✅ Uppercase letter" : "❌ One uppercase letter"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={isStrong.lower ? "✅ Lowercase letter" : "❌ One lowercase letter"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={isStrong.digit ? "✅ A number" : "❌ One number"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={isStrong.symbol ? "✅ Special character" : "❌ One special character"}
              />
            </ListItem>
          </List>

          {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Reset Password
          </Button>
        </form>
      )}
    </Box>
  );
}
