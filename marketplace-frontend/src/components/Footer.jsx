import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default function Footer() {
  return (
    <Box component="footer" sx={{
      bgcolor: '#131921',
      color: '#fff',
      pt: 6,
      pb: 2,
      px: 0,
      mt: 8,
      borderTop: '4px solid #f68b1e',
      fontFamily: 'Roboto, Arial, sans-serif',
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      overflowX: 'hidden',
    }}>
      <Box maxWidth="lg" mx="auto" px={{ xs: 2, md: 8 }} display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={4}>
        {/* About/Brand */}
        <Box flex={1} minWidth={200} mb={{ xs: 3, md: 0 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#f68b1e', letterSpacing: 1 }} gutterBottom>
            Farmlink
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
            Your trusted online marketplace for farm products, livestock, and more. Shop with confidence and convenience.
          </Typography>
          <Box mt={2}>
            {/* Download Our App section removed until mobile app is available */}
          </Box>
        </Box>
        {/* Quick Links */}
        <Box flex={1} minWidth={180}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#f68b1e' }} gutterBottom>
            Quick Links
          </Typography>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Link href="/about" color="inherit" underline="hover" sx={{ fontSize: { xs: 14, sm: 16 } }}>About Us</Link>
            <Link href="/contact" color="inherit" underline="hover" sx={{ fontSize: { xs: 14, sm: 16 } }}>Contact</Link>
            <Link href="/categories" color="inherit" underline="hover" sx={{ fontSize: { xs: 14, sm: 16 } }}>Categories</Link>
            <Link href="/faq" color="inherit" underline="hover" sx={{ fontSize: { xs: 14, sm: 16 } }}>FAQ</Link>
            <Link href="/seller-center" color="inherit" underline="hover" sx={{ fontWeight: 700, color: '#f68b1e', fontSize: { xs: 14, sm: 16 } }}>Seller Center</Link>
            <Link href="/vet-dashboard" color="inherit" underline="hover" sx={{ fontWeight: 700, color: '#f68b1e', fontSize: { xs: 14, sm: 16 } }}>Vet Dashboard</Link>
            <Link href="/privacy" color="inherit" underline="hover" sx={{ fontSize: { xs: 14, sm: 16 } }}>Privacy Policy</Link>
            <Link href="/terms" color="inherit" underline="hover" sx={{ fontSize: { xs: 14, sm: 16 } }}>Terms of Service</Link>
          </Box>
        </Box>
        {/* Customer Service */}
        <Box flex={1} minWidth={180}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#f68b1e' }} gutterBottom>
            Customer Service
          </Typography>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Link href="/help" color="inherit" underline="hover">Help Center</Link>
            <Link href="/returns" color="inherit" underline="hover">Returns</Link>
            <Link href="/shipping" color="inherit" underline="hover">Shipping Info</Link>
            <Link href="/payment" color="inherit" underline="hover">Payment Methods</Link>
          </Box>
        </Box>
        {/* Contact & Social */}
        <Box flex={1} minWidth={200}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#f68b1e' }} gutterBottom>
            Connect With Us
          </Typography>
          <Box display="flex" gap={1} mb={1}>
            <IconButton href="https://facebook.com" target="_blank" rel="noopener" color="inherit" size="large">
              <FacebookIcon />
            </IconButton>
            <IconButton href="https://twitter.com" target="_blank" rel="noopener" color="inherit" size="large">
              <TwitterIcon />
            </IconButton>
            <IconButton href="https://youtube.com" target="_blank" rel="noopener" color="inherit" size="large">
              <YouTubeIcon />
            </IconButton>
          </Box>
          <Typography variant="body2">Email: connect@farmlink.com</Typography>
          <Typography variant="body2">Phone: 0705600690</Typography>
        </Box>
      </Box>
      <Box mt={4} borderTop={1} borderColor="#333" pt={2} textAlign="center">
        <Typography variant="caption" sx={{ color: 'grey.400' }}>
          &copy; {new Date().getFullYear()} Farmlink. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
