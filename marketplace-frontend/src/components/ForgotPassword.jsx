import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/users/reset_password/", { email });
      setSent(true);
    } catch (err) {
      setError("Failed to send reset email.");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Forgot Password</Typography>
      {sent ? (
        <Alert severity="success">If this email exists, a reset link has been sent.</Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            margin="normal"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send Reset Link
          </Button>
        </form>
      )}
    </Box>
  );
}

