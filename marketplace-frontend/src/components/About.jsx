import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorefrontIcon from '@mui/icons-material/Storefront';

export default function About() {
  return (
    <Box sx={{ background: '#fff9f4', py: { xs: 3, md: 6 }, minHeight: '100vh' }}>
      <Box maxWidth={900} mx="auto" px={{ xs: 1, sm: 2 }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={5}>
          <Typography variant="h3" fontWeight="bold" color="#f68b1e" gutterBottom sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}>
             Farmlink
          </Typography>
          <Typography variant="h6" color="#333" maxWidth={600} mx="auto" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
            Farm Link is a digital platform built to transform how livestock and agricultural products are traded.
          </Typography>
        </Box>
        {/* Mission Card */}
        <Grid container columns={12} columnSpacing={3} rowSpacing={3} sx={{ mb: 4 }} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card sx={{ borderLeft: '8px solid #f68b1e', background: '#fff3e0' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" color="#f68b1e" mb={1}>
                  Our <span style={{ fontWeight: 'bold' }}>mission</span>
                </Typography>
                <Typography color="#333">
                  To eliminate the barriers that small-scale farmers face by offering direct access to buyers, veterinarians, and transporters — all within a secure and transparent ecosystem.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Platform Features */}
        <Grid container columns={12} columnSpacing={3} rowSpacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <StorefrontIcon sx={{ color: '#f68b1e', fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="#388e3c" mb={1}>
                  Streamlined Trading
                </Typography>
                <Typography color="#333">
                  Farm Link streamlines livestock trading by eliminating unreliable pricing, middlemen, and service gaps. We offer a trusted platform with fair trade, verified reviews, and real-time support and delivery.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <SupportAgentIcon sx={{ color: '#f68b1e', fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="#388e3c" mb={1}>
                  Community & Support
                </Typography>
                <Typography color="#333">
                  Whether you're a farmer listing your animals, a buyer seeking quality products, or a vet offering consultation, Farm Link is here to bridge the gap and build a stronger, smarter agricultural community.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        {/* Why Choose Farmlink */}
        <Typography variant="h5" fontWeight={700} color="#388e3c" mb={2}>
          Why Choose Farmlink?
        </Typography>
        <Grid container columns={12} columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" alignItems="center" mb={1}>
              <CheckCircleIcon sx={{ color: '#f68b1e', mr: 1 }} />
              <Typography>Wide selection of livestock and farm produce from verified sellers</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" alignItems="center" mb={1}>
              <SecurityIcon sx={{ color: '#f68b1e', mr: 1 }} />
              <Typography>Secure payments and buyer protection</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" alignItems="center" mb={1}>
              <StorefrontIcon sx={{ color: '#f68b1e', mr: 1 }} />
              <Typography>Easy listing and management for sellers</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" alignItems="center" mb={1}>
              <LocalOfferIcon sx={{ color: '#f68b1e', mr: 1 }} />
              <Typography>Transparent pricing and no hidden fees</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" alignItems="center" mb={1}>
              <SupportAgentIcon sx={{ color: '#f68b1e', mr: 1 }} />
              <Typography>Dedicated customer support</Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        {/* Vision Section */}
        <Box textAlign="center" mt={5}>
          <Typography variant="h5" fontWeight={700} color="#388e3c" mb={1}>
            Our Vision
          </Typography>
          <Typography variant="body1" color="#333" maxWidth={600} mx="auto">
            To be the leading digital marketplace for agriculture in East Africa, driving prosperity for farmers and food security for all.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

