import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function ShippingInfo() {
  return (
    <Box p={4} maxWidth={700} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={2} color="#f68b1e">
        Shipping Info
      </Typography>
      <Typography variant="body1" mb={2}>
        Farmlink partners with trusted logistics providers to ensure your products and livestock are delivered safely and on time. Shipping fees and delivery times vary depending on your location and the type of product.
      </Typography>
      <Typography variant="h6" fontWeight={700} color="#388e3c" mt={3} mb={1}>
        Delivery Details
      </Typography>
      <ul style={{ marginLeft: 24, color: "#333", fontSize: 18 }}>
        <li>Standard delivery: 2-5 business days</li>
        <li>Express delivery: 1-2 business days (where available)</li>
        <li>Track your order in your account dashboard</li>
      </ul>
      <Typography variant="body2" color="text.secondary" mt={3}>
        For shipping questions, contact us at <span style={{ fontWeight: 'bold' }}>connect@farmlink.com</span> or call <span style={{ fontWeight: 'bold' }}>0705600690</span>.
      </Typography>
    </Box>
  );
}
