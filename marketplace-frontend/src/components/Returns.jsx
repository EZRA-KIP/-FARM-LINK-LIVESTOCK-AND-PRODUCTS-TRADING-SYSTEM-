import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Returns() {
  return (
    <Box p={4} maxWidth={700} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={2} color="#f68b1e">
        Returns
      </Typography>
      <Typography variant="body1" mb={2}>
        At Farmlink, your satisfaction is our priority. If you are not satisfied with your purchase, you may request a return within 7 days of delivery. Please ensure the product is in its original condition and packaging.
      </Typography>
      <Typography variant="h6" fontWeight={700} color="#388e3c" mt={3} mb={1}>
        How to Request a Return
      </Typography>
      <ul style={{ marginLeft: 24, color: "#333", fontSize: 18 }}>
        <li>Contact our support team at <span style={{ fontWeight: 'bold' }}>connect@farmlink.com</span> or call <span style={{ fontWeight: 'bold' }}>0705600690</span>.</li>
        <li>Provide your order number and reason for return.</li>
        <li>We will guide you through the return process.</li>
      </ul>
      <Typography variant="body2" color="text.secondary" mt={3}>
        Please note: Some items (e.g., perishable goods) may not be eligible for return. See our full return policy for details.
      </Typography>
    </Box>
  );
}
