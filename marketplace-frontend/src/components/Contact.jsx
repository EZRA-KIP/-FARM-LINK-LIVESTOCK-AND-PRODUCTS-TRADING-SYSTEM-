import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Contact() {
  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Contact
      </Typography>
      <Typography>
        Email:{" "}
        <span style={{ fontWeight: "bold" }}>connect@farmlink.co.ke</span>
      </Typography>
      <Typography>
        Phone:{" "}
        <span style={{ fontWeight: "bold" }}>0705600690</span>
      </Typography>
    </Box>
  );
}
