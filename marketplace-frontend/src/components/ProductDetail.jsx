import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React from "react";

function ProductReviews({ reviews }) {
  return (
    <div>
      <h3>Reviews</h3>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map((r) => (
        <div key={r.id} style={{ marginBottom: 12 }}>
          <strong>Rating:</strong> {r.rating} / 5
          <br />
          <strong>Comment:</strong> {r.comment}
          <br />
          <small>{new Date(r.created_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}

function AddReview({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/products/${productId}/add-review/`,
        { rating, comment },
        { headers: { Authorization: `Token ${token}` } }
      );
      setRating(5);
      setComment("");
      onReviewAdded();
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to add review"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add a Review</h4>
      <label>
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { addToCart } = useCart();

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch reviews
  const refreshReviews = () => {
    setReviewsLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}/reviews/`)
      .then((res) => setReviews(res.data))
      .finally(() => setReviewsLoading(false));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/products/${id}/`);
        setProduct(res.data);
        fetchRelated(res.data.category);
      } catch (err) {
        console.error("Failed to fetch product details", err);
      }
    };

    const fetchRelated = async (category) => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/products/");
        const filtered = res.data.filter(
          (p) => p.category === category && p.id !== parseInt(id)
        );
        setRelated(filtered.slice(0, 3)); // Show top 3 related
      } catch (err) {
        console.error("Failed to fetch related products", err);
      }
    };

    fetchProduct();
    refreshReviews(); // Fetch reviews when product loads
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      setSnackbarOpen(true);
    }
  };

  // --- Tag Suffix Logic ---
  let tagSuffix = "";
  if (product) {
    const sexValue = product.sex || product.sex_identity;
    if (sexValue) {
      if (sexValue.toLowerCase().startsWith("m")) tagSuffix = "-M";
      else if (sexValue.toLowerCase().startsWith("f")) tagSuffix = "-F";
    }
  }

  if (!product) return <Box p={4}>Loading...</Box>;

  return (
    <Box maxWidth="lg" mx="auto" p={{ xs: 2, md: 6 }}>
      <Paper
        elevation={3}
        sx={{ borderRadius: 4, p: { xs: 2, md: 4 }, mb: 6 }}
      >
        <Grid
          container
          columns={12}
          columnSpacing={4}
          rowSpacing={4}
          alignItems="flex-start"
        >
          <Grid gridColumn={{ xs: "span 12", md: "span 6" }}>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: 340,
                  objectFit: "cover",
                  borderRadius: 3,
                }}
              />
            )}
          </Grid>
          <Grid gridColumn={{ xs: "span 12", md: "span 6" }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h4" fontWeight={700}>
                {product.name}
              </Typography>
              {product.tag_number && (
                <Typography
                  variant="body2"
                  color="info.main"
                  fontWeight={700}
                  sx={{ fontSize: { xs: 15, sm: 17 } }}
                >
                  Animal Tag: {product.tag_number}
                  {tagSuffix}
                </Typography>
              )}
              <Typography variant="body1" color="text.secondary">
                {product.description}
              </Typography>
              <Typography
                variant="h5"
                color="success.main"
                fontWeight={600}
                sx={{ mb: 2 }}
              >
                Ksh {product.price}
              </Typography>
              {/* Animal Health & Vaccination Info */}
              {typeof product.is_vaccinated !== "undefined" && (
                <Box mt={2}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color={
                      product.is_vaccinated ? "success.main" : "warning.main"
                    }
                  >
                    {product.is_vaccinated
                      ? "✅ Vaccinated"
                      : "⚠️ Not Vaccinated"}
                  </Typography>
                  {product.last_vaccination_date && (
                    <Typography variant="body2" color="text.secondary">
                      Last Vaccination: {product.last_vaccination_date}
                    </Typography>
                  )}
                  {product.health_certificate_url && (
                    <Typography variant="body2" color="primary">
                      <a
                        href={product.health_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Health Certificate
                      </a>
                    </Typography>
                  )}
                  {product.vet_verified_by && (
                    <Typography variant="body2" color="info.main">
                      Verified by: {product.vet_verified_by}
                    </Typography>
                  )}
                </Box>
              )}
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                mt={2}
                sx={{ flexWrap: "wrap" }}
              >
                <Typography>Quantity:</Typography>
                <TextField
                  type="number"
                  size="small"
                  inputProps={{ min: 1 }}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  sx={{ width: 80 }}
                />
                <Button
                  onClick={handleAddToCart}
                  variant="contained"
                  color="warning"
                  sx={{ fontWeight: 700, boxShadow: 2 }}
                >
                  Add to Cart
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      {/* Related Products */}
      <Box mt={6}>
        <Typography variant="h6" fontWeight={700} mb={3}>
          Related Products
        </Typography>
        <Grid container columns={12} columnSpacing={3} rowSpacing={3}>
          {related.map((item) => (
            <Grid gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }} key={item.id}>
              <Card
                component={Link}
                to={`/products/${item.id}`}
                sx={{
                  textDecoration: "none",
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                {item.image && (
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{
                      height: 140,
                      objectFit: "cover",
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                    }}
                  />
                )}
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 1 }}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    KES {item.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      {reviewsLoading ? (
        <Typography>Loading reviews...</Typography>
      ) : (
        <ProductReviews reviews={reviews} />
      )}
      {product && (
        <AddReview productId={product.id} onReviewAdded={refreshReviews} />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
}
