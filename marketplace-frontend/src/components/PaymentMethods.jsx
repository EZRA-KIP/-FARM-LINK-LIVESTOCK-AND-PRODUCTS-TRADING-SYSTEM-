import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PaymentMethods() {
  return (
    <Box p={4} maxWidth={700} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={2} color="#f68b1e">
        Payment Methods
      </Typography>
      <Typography variant="body1" mb={2}>
        Farmlink offers secure and convenient payment options for all users. Choose the method that works best for you at checkout.
      </Typography>
      <Typography variant="h6" fontWeight={700} color="#388e3c" mt={3} mb={1}>
        Available Payment Options
      </Typography>
      <ul style={{ marginLeft: 24, color: "#333", fontSize: 18 }}>
        <li>Mobile Money (M-Pesa, Airtel Money)</li>
        <li>Cash on Delivery (selected locations)</li>
      </ul>
      <Typography variant="body2" color="text.secondary" mt={3}>
        For payment support, contact us at <span style={{ fontWeight: 'bold' }}>connect@farmlink.com</span> or call <span style={{ fontWeight: 'bold' }}>0705600690</span>.
      </Typography>
    </Box>
  );
}
