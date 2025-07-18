import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Cart() {
  const {
    cart,
    clearCart,
    error,
    loading,
    removeFromCart,
    subtotal,
    tax,
    total,
    updateQuantity,
  } = useCart();
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const cartRef = useRef(null);

  useEffect(() => {
    if (cartRef.current) {
      cartRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    updateQuantity(id, newQty);
    setSnackbarMsg("Quantity updated");
    setSnackbarOpen(true);
  };

  const handleRemove = (id, name) => {
    removeFromCart(id);
    setSnackbarMsg(`${name} removed from cart`);
    setSnackbarOpen(true);
  };

  const handleClearCart = () => {
    clearCart();
    setSnackbarMsg("Cart cleared");
    setSnackbarOpen(true);
  };

  return (
    <Box
      maxWidth="md"
      mx="auto"
      p={3}
      ref={cartRef}
      sx={{
        px: { xs: 1, sm: 3 },
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        sx={{ fontSize: { xs: 24, sm: 32 } }}
      >
        🛒 Your Cart
      </Typography>
      {loading ? (
        <Typography color="text.secondary">Loading cart...</Typography>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : cart.length === 0 ? (
        <Box textAlign="center" color="text.secondary">
          <Typography sx={{ fontSize: { xs: 16, sm: 20 } }}>
            Your cart is empty.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            sx={{
              mt: 2,
              fontSize: { xs: 14, sm: 16 },
              px: { xs: 2, sm: 4 },
            }}
            fullWidth={true}
          >
            ← Continue shopping
          </Button>
        </Box>
      ) : (
        <Box>
          <Stack spacing={2}>
            {cart.map((item) => (
              <Paper
                key={item.id}
                elevation={2}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  p: 2,
                  gap: 2,
                  borderRadius: 2,
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                {item.image && (
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: { xs: 64, sm: 80 },
                      height: { xs: 64, sm: 80 },
                      objectFit: "cover",
                      borderRadius: 2,
                      mr: { xs: 0, sm: 2 },
                      mb: { xs: 1, sm: 0 },
                    }}
                  />
                )}
                <Box flex={1} minWidth={0} sx={{ width: "100%" }}>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{ fontSize: { xs: 16, sm: 20 } }}
                  >
                    {item.name}
                  </Typography>
                  {item.tag_number && (
                    <Typography
                      variant="body2"
                      color="info.main"
                      fontWeight={700}
                      sx={{ fontSize: { xs: 13, sm: 15 } }}
                    >
                      Animal Tag: {item.tag_number}
                      {item.sex || item.sex_identity
                        ? (item.sex || item.sex_identity)
                            .toLowerCase()
                            .startsWith("m")
                          ? "-M"
                          : (item.sex || item.sex_identity)
                              .toLowerCase()
                              .startsWith("f")
                          ? "-F"
                          : ""
                        : ""}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: 14, sm: 16 } }}
                  >
                    Ksh {item.price}
                  </Typography>
                  {/* Animal Health & Vaccination Info */}
                  {typeof item.is_vaccinated !== "undefined" && (
                    <Box mt={1}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color={
                          item.is_vaccinated
                            ? "success.main"
                            : "warning.main"
                        }
                        sx={{ fontSize: { xs: 13, sm: 15 } }}
                      >
                        {item.is_vaccinated
                          ? "✅ Vaccinated"
                          : "⚠️ Not Vaccinated"}
                      </Typography>
                      {item.last_vaccination_date && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: 12, sm: 14 } }}
                        >
                          Last Vaccination: {item.last_vaccination_date}
                        </Typography>
                      )}
                      {item.health_certificate_url && (
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ fontSize: { xs: 12, sm: 14 } }}
                        >
                          <a
                            href={item.health_certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Health Certificate
                          </a>
                        </Typography>
                      )}
                      {item.vet_verified_by && (
                        <Typography
                          variant="body2"
                          color="info.main"
                          sx={{ fontSize: { xs: 12, sm: 14 } }}
                        >
                          Verified by: {item.vet_verified_by}
                        </Typography>
                      )}
                    </Box>
                  )}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    mt={1}
                    sx={{ flexWrap: "wrap" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      sx={{ minWidth: 32, px: 1, fontSize: { xs: 14, sm: 16 } }}
                    >
                      −
                    </Button>
                    <TextField
                      type="number"
                      size="small"
                      inputProps={{
                        min: 1,
                        style: { textAlign: "center", width: 40 },
                      }}
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      sx={{ width: 60, mx: 1, fontSize: { xs: 14, sm: 16 } }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      sx={{ minWidth: 32, px: 1, fontSize: { xs: 14, sm: 16 } }}
                    >
                      +
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemove(item.id, item.name)}
                      sx={{ ml: 2, fontSize: { xs: 13, sm: 15 } }}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={2}
          >
            <Box>
              <Typography sx={{ fontSize: { xs: 15, sm: 17 } }}>
                Subtotal:{" "}
                <b>
                  Ksh{" "}
                  {typeof subtotal === "number" && !isNaN(subtotal)
                    ? subtotal.toFixed(2)
                    : "0.00"}
                </b>
              </Typography>
              <Typography sx={{ fontSize: { xs: 15, sm: 17 } }}>
                Tax (16%):{" "}
                <b>
                  Ksh{" "}
                  {typeof tax === "number" && !isNaN(tax)
                    ? tax.toFixed(2)
                    : "0.00"}
                </b>
              </Typography>
              {/* Remove or implement shipping if needed */}
              {/* <Typography sx={{ fontSize: { xs: 15, sm: 17 } }}>
                Shipping: <b>Ksh 0.00</b>
              </Typography> */}
              <Typography
                variant="h6"
                mt={1}
                sx={{ fontSize: { xs: 17, sm: 20 } }}
              >
                Total:{" "}
                Ksh{" "}
                {typeof total === "number" && !isNaN(total)
                  ? total.toFixed(2)
                  : "0.00"}
              </Typography>
            </Box>
            <Box
              display="flex"
              gap={2}
              flexDirection={{ xs: "column", sm: "row" }}
              width={{ xs: "100%", sm: "auto" }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearCart}
                sx={{
                  fontSize: { xs: 14, sm: 16 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Clear Cart
              </Button>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={() => navigate("/checkout")}
                sx={{
                  fontSize: { xs: 15, sm: 17 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      <Snackbar
        open={snackbarOpen || Boolean(error)}
        autoHideDuration={2200}
        onClose={() => {
          setSnackbarOpen(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={error ? "error" : "info"}
          sx={{ width: "100%" }}
        >
          {error ? error : snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

