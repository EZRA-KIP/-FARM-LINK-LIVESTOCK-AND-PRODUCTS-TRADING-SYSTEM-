import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    phone_number: "",
    shipping_address: ""
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });
  const [orderId, setOrderId] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      return setSnackbar({ open: true, msg: "🛒 Cart is empty!", severity: "warning" });
    }

    const { phone_number } = form;
    if (!phone_number.startsWith("2547") || phone_number.length !== 12) {
      return setSnackbar({ open: true, msg: "Enter valid Safaricom number e.g. 254712345678", severity: "warning" });
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Step 1: Trigger STK Push
      const stk = await axios.post(
        "http://127.0.0.1:8000/api/mpesa/stk-push/",
        { phone: phone_number },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (stk.data.ResponseCode === "0") {
        // Step 2: Save the order after STK prompt
        const orderData = {
          ...form,
          items: cart.map((item) => ({
            product: item.id,
            quantity: item.quantity
          }))
        };
        const orderResponse = await axios.post(
          "http://127.0.0.1:8000/orders/",
          orderData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        // FIX: Get orderId from orderResponse.data.order.id
        const newOrderId = orderResponse.data.order?.id;

        if (!newOrderId) {
          throw new Error("Order creation failed: No order ID returned.");
        }

        setOrderId(newOrderId); // Set the new order ID here

        // Step 3: Create the payment record
        const paymentData = {
          order: newOrderId,
          amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          status: "pending",
          transaction_id: stk.data.CheckoutRequestID || "",
          payment_method: "mpesa",
        };
        await axios.post(
          "http://127.0.0.1:8000/payments/",
          paymentData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        setSnackbar({ open: true, msg: "✅ STK Push sent and order submitted!", severity: "success" });
        clearCart();
        localStorage.removeItem("cart");
        setPaymentSuccess(true); // Set payment success to true
      } else {
        setSnackbar({ open: true, msg: "❌ STK Push failed: " + stk.data.errorMessage, severity: "error" });
      }
    } catch (err) {
      // Show real backend error if available
      let msg = "❌ Failed to process order. Try again.";
      if (err.response?.data) {
        msg = typeof err.response.data === "string"
          ? err.response.data
          : JSON.stringify(err.response.data);
      }
      setSnackbar({ open: true, msg, severity: "error" });
      console.error("Error during payment or order:", err);
    }
    setLoading(false);
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="linear-gradient(to bottom right, #f0fdf4, #e0f2fe)" py={6} px={2}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 500, borderRadius: 4, p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} color="success.main" align="center">
          Checkout
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              name="customer_name"
              placeholder="Your Name"
              value={form.customer_name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="customer_email"
              type="email"
              placeholder="Email Address"
              value={form.customer_email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Phone Number"
              name="phone_number"
              type="tel"
              placeholder="254712345678"
              value={form.phone_number}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Shipping Address"
              name="shipping_address"
              placeholder="Shipping Address"
              value={form.shipping_address}
              onChange={handleChange}
              required
              fullWidth
              multiline
              minRows={3}
            />
            <Paper variant="outlined" sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 2 }}>
              <Typography fontWeight="bold" mb={1} color="text.secondary">
                Order Summary
              </Typography>
              {cart.length === 0 ? (
                <Typography color="text.disabled">Your cart is empty.</Typography>
              ) : (
                <Stack divider={<Divider />} spacing={1}>
                  {cart.map((item) => (
                    <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography color="text.primary">
                        {item.name} <Typography component="span" color="text.secondary" fontSize="small">x {item.quantity}</Typography>
                      </Typography>
                      <Typography fontWeight="bold" color="success.main">
                        Ksh {item.price * item.quantity}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
              {cart.length > 0 && (
                <Box mt={2} display="flex" justifyContent="space-between" fontWeight="bold" fontSize="large" borderTop={1} pt={2} borderColor="divider">
                  <span>Total:</span>
                  <span style={{ color: '#15803d' }}>Ksh {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
                </Box>
              )}
            </Paper>
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ fontWeight: 'bold', fontSize: '1.1rem', borderRadius: 2, py: 1.5, mt: 1 }}
            >
              {loading ? "Processing..." : "Pay & Place Order"}
            </Button>
          </Stack>
        </form>

        {paymentSuccess && orderId && (
          <div style={{ marginTop: 24 }}>
            <Typography variant="h6" fontWeight="medium" color="success.main" align="center">
              Thank you for your purchase!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href={`http://127.0.0.1:8000/orders/${orderId}/receipt/`}
              target="_blank"
              rel="noopener"
              size="large"
              sx={{ borderRadius: 2, py: 1.5, mt: 2 }}
            >
              Download Receipt (PDF)
            </Button>
          </div>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
