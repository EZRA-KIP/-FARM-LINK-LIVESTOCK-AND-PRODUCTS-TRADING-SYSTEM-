import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError("");
        const response = await axios.get("http://127.0.0.1:8000/my-orders/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
        setOrders([]);
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setError("No token found. Please log in to view orders Report.");
      setLoading(false);
    }
  }, [token]);

  const handleDownloadOrderHistory = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/reports/my-orders/",
        {
          headers: { Authorization: `Token ${token}` },
          responseType: "blob", // Important for file download
        }
      );
      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "order_history.pdf"); // or .csv
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download order history. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto" mt={4} px={{ xs: 1, sm: 0 }}>
      <Typography variant="h4" gutterBottom>
        Orders Reports
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!error && orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : isMobile ? (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper key={order.id} sx={{ p: 2 }}>
              <Typography fontWeight="bold">
                Order #{order.id} — {order.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : "N/A"}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                <b>Name:</b> {order.customer_name || "N/A"}
              </Typography>
              <Typography variant="body2">
                <b>Email:</b> {order.customer_email || "N/A"}
              </Typography>
              <Typography variant="body2">
                <b>Phone:</b> {order.phone_number || "N/A"}
              </Typography>
              <Typography variant="body2">
                <b>Address:</b> {order.shipping_address || "N/A"}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography fontWeight="bold" sx={{ mb: 0.5 }}>
                Items:
              </Typography>
              <List dense>
                {(Array.isArray(order.items) ? order.items : []).map(
                  (item, idx) => (
                    <ListItem key={idx} sx={{ p: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={item.product_image}
                          alt={item.product_name}
                        >
                          {item.product_name ? item.product_name[0] : "?"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.product_name}
                        secondary={`Qty: ${item.quantity} | KES ${Number(
                          item.product_price
                        ).toLocaleString()}`}
                      />
                    </ListItem>
                  )
                )}
              </List>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                href={`http://127.0.0.1:8000/orders/${order.id}/receipt/`}
                target="_blank"
                rel="noopener"
                sx={{ mt: 1 }}
              >
                Download Receipt
              </Button>
            </Paper>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Receipt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>{order.customer_name || "N/A"}</TableCell>
                  <TableCell>{order.customer_email || "N/A"}</TableCell>
                  <TableCell>{order.phone_number || "N/A"}</TableCell>
                  <TableCell>{order.shipping_address || "N/A"}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <List dense>
                      {(Array.isArray(order.items) ? order.items : []).map(
                        (item, idx) => (
                          <ListItem key={idx} sx={{ p: 0 }}>
                            <ListItemAvatar>
                              <Avatar
                                variant="rounded"
                                src={item.product_image}
                                alt={item.product_name}
                              >
                                {item.product_name ? item.product_name[0] : "?"}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={item.product_name}
                              secondary={`Quantity: ${item.quantity} | Price: KES ${Number(
                                item.product_price
                              ).toLocaleString()}`}
                            />
                          </ListItem>
                        )
                      )}
                    </List>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      href={`http://127.0.0.1:8000/orders/${order.id}/receipt/`}
                      target="_blank"
                      rel="noopener"
                      aria-label={`Download receipt for order ${order.id}`}
                    >
                      Download Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadOrderHistory}
          disabled={loading}
          aria-label="Download all order history as PDF"
        >
          Download Order History
        </Button>
      </Box>
    </Box>
  );
};

export default OrderHistory;
