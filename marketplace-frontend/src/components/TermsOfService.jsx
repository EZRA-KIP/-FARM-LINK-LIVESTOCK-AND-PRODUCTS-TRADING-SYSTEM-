import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function TermsOfService() {
  return (
    <Box p={4} maxWidth={700} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={2} color="#f68b1e">
        Terms of Service
      </Typography>
      <Typography variant="body1" mb={2}>
        By using Farmlink, you agree to our terms and conditions. We strive to provide a safe, fair, and transparent marketplace for all users. Please read the following terms carefully before using our platform.
      </Typography>
      <Typography variant="h6" fontWeight={700} color="#388e3c" mt={3} mb={1}>
        Key Terms
      </Typography>
      <ul style={{ marginLeft: 24, color: "#333", fontSize: 18 }}>
        <li>All users must provide accurate information during registration and transactions.</li>
        <li>Prohibited items and fraudulent activity are not tolerated and will result in account suspension.</li>
        <li>Disputes are handled by our support team; our decision is final in all cases.</li>
        <li>We reserve the right to update these terms at any time.</li>
      </ul>
      <Typography variant="body2" color="text.secondary" mt={3}>
        For the full terms of service or any questions, contact us at <span style={{ fontWeight: 'bold' }}>connect@farmlink.com</span>.
      </Typography>
    </Box>
  );
}
