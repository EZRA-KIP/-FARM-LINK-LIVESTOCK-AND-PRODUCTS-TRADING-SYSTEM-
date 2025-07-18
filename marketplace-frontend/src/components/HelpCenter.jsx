import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function HelpCenter() {
  return (
    <Box p={4} maxWidth={700} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={2} color="#f68b1e">
        Help Center
      </Typography>
      <Typography variant="body1" mb={2}>
        Welcome to the Farmlink Help Center! Here you can find answers to common questions, tips for using our platform, and guidance on buying, selling, and account management.
      </Typography>
      <Typography variant="h6" fontWeight={700} color="#388e3c" mt={3} mb={1}>
        Frequently Asked Questions
      </Typography>
      <ul style={{ marginLeft: 24, color: "#333", fontSize: 18 }}>
        <li>How do I create an account?</li>
        <li>How do I list a product or livestock?</li>
        <li>How do I contact a seller or buyer?</li>
        <li>How do I reset my password?</li>
      </ul>
      <Typography variant="body2" color="text.secondary" mt={3}>
        Can't find what you're looking for? Contact our support team at <span style={{ fontWeight: 'bold' }}>connect@farmlink.com</span> or call <span style={{ fontWeight: 'bold' }}>0705600690</span>.
      </Typography>
    </Box>
  );
}
