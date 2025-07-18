import React, { useState, useEffect } from "react"; // ⬅️ include useEffect
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ✅ Add this useEffect block
  useEffect(() => {
    const root = document.getElementById("root");
    if (root?.getAttribute("aria-hidden") === "true") {
      console.warn("⚠️ aria-hidden='true' found on #root — removing it to avoid a11y issues");
      root.removeAttribute("aria-hidden");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== reNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/auth/users/reset_password_confirm/", {
        uid,
        token,
        new_password: newPassword,
        re_new_password: reNewPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/auth"), 3000);
    } catch (err) {
      setError("❌ Password reset failed. The link may be invalid or expired.");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", paddingTop: "2rem" }}>
      <h2>Reset Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success ? (
        <p style={{ color: "green" }}>✅ Password reset successful! Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Confirm new password"
            value={reNewPassword}
            onChange={(e) => setReNewPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordConfirm;
