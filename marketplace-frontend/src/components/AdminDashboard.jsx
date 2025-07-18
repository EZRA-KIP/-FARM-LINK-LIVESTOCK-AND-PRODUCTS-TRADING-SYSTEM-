import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.is_staff) {
    return (
      <Box p={4}>
        <Typography color="error" variant="h6">
          Access denied. Admins only.
        </Typography>
      </Box>
    );
  }

  const downloadReport = (endpoint, filename) => {
    const token = localStorage.getItem("token");
    fetch(endpoint, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  return (
    <Box p={4} maxWidth={900} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={2} color="#388e3c">
        Admin Dashboard
      </Typography>
      <Typography variant="body1" mb={3}>
        Welcome, admin! Manage reports and system features below.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" mb={2}>Download Reports</Typography>
      <Button
        variant="outlined"
        color="primary"
        sx={{ mr: 2, mb: 2 }}
        onClick={() =>
          downloadReport("http://127.0.0.1:8000/api/reports/sales/", "sales_report.csv")
        }
      >
        Download Sales Report (CSV)
      </Button>
      <Button
        variant="outlined"
        color="success"
        sx={{ mr: 2, mb: 2 }}
        onClick={() =>
          downloadReport("http://127.0.0.1:8000/api/reports/inventory/", "inventory_report.csv")
        }
      >
        Download Inventory Report (CSV)
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 3 }}
        onClick={() => navigate("/admin-orders")}
      >
        Manage Orders
      </Button>
      {/* Add more admin actions here as needed */}
    </Box>
  );
}