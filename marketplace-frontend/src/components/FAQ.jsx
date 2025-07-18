import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function FAQ() {
  return (
    <Box p={4} maxWidth={700} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={2} color="#f68b1e">
        Frequently Asked Questions (FAQ)
      </Typography>
      <Typography variant="h6" fontWeight={700} color="#388e3c" mt={3} mb={1}>
        How do I create an account on Farmlink?
      </Typography>
      <Typography variant="body1" mb={2}>
        Click the "Register" or "Sign Up" button on the homepage and fill in your details. You will receive a confirmation email to activate your account.
      </Typography>
      <Typography variant="h6" fontWeight={700} color="#388e3c" mt={3} mb={1}>
        How do I list a product or livestock for sale?
      </Typography>
      <Typography variant="body1" mb={2}>
        Log in to your account, go to the Seller Center, and use the "Add Product" form to upload details and images of your product or livestock.
      </Typography>
      <Typography variant="h6" fontWeight={700} color="#388e3c" mt={3} mb={1}>
        What payment methods are accepted?
      </Typography>
      <Typography variant="body1" mb={2}>
        We accept Mobile Money (M-Pesa, Airtel Money), bank transfer, credit/debit cards, and cash on delivery (in selected locations).
      </Typography>
      <Typography variant="h6" fontWeight={700} color="#388e3c" mt={3} mb={1}>
        How do I contact customer support?
      </Typography>
      <Typography variant="body1" mb={2}>
        You can email us at <span style={{ fontWeight: 'bold' }}>connect@farmlink.com</span> or call <span style={{ fontWeight: 'bold' }}>0705600690</span> for assistance.
      </Typography>
    </Box>
  );
}
