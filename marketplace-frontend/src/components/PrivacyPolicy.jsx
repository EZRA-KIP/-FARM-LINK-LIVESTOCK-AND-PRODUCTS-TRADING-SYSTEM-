import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PrivacyPolicy() {
  return (
    <Box p={4} maxWidth={700} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={2} color="#f68b1e">
        Privacy Policy
      </Typography>
      <Typography variant="body1" mb={2}>
        At Farmlink, we value your privacy and are committed to protecting your personal information. We collect only the data necessary to provide our services, such as your name, contact details, and transaction history. Your information is never sold to third parties and is used solely to improve your experience on our platform.
      </Typography>
      <Typography variant="h6" fontWeight={700} color="#388e3c" mt={3} mb={1}>
        Your Rights
      </Typography>
      <ul style={{ marginLeft: 24, color: "#333", fontSize: 18 }}>
        <li>Access and update your personal information at any time.</li>
        <li>Request deletion of your account and data.</li>
        <li>Contact us for any privacy-related concerns at <span style={{ fontWeight: 'bold' }}>connect@farmlink.com</span>.</li>
      </ul>
      <Typography variant="body2" color="text.secondary" mt={3}>
        For more details, please review our full privacy policy or contact our support team.
      </Typography>
    </Box>
  );
}
