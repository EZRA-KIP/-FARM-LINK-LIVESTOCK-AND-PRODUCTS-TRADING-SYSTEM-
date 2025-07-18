import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SellerCenter() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
    tag_number: "",
    is_vaccinated: false,
    last_vaccination_date: "",
    health_certificate_url: "",
    vet_verified_by: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [myListings, setMyListings] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/categories/")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Fetch user's listings on mount and after submit
  const fetchMyListings = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get("http://127.0.0.1:8000/products/", {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => setMyListings(res.data))
      .catch(() => setMyListings([]));
  };
  useEffect(() => { fetchMyListings(); }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (files ? files[0] : value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      if (form.image) formData.append("image", form.image);
      formData.append("tag_number", form.tag_number);
      formData.append("is_vaccinated", form.is_vaccinated);
      formData.append("last_vaccination_date", form.last_vaccination_date);
      formData.append("health_certificate_url", form.health_certificate_url);
      formData.append("vet_verified_by", form.vet_verified_by);
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });
      setSnackbar({ open: true, msg: "Listing submitted!", severity: "success" });
      setForm({ name: "", description: "", price: "", stock: "", category: "", image: null, tag_number: "", is_vaccinated: false, last_vaccination_date: "", health_certificate_url: "", vet_verified_by: "" });
      fetchMyListings();
    } catch (err) {
      setSnackbar({ open: true, msg: "Failed to submit listing.", severity: "error" });
    }
    setLoading(false);
  };

  const handleImageUpload = async (e, listingId) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://127.0.0.1:8000/products/${listingId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });
      setSnackbar({ open: true, msg: "Image uploaded successfully!", severity: "success" });
      fetchMyListings();
    } catch (err) {
      setSnackbar({ open: true, msg: "Failed to upload image.", severity: "error" });
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc" display="flex" alignItems="center" justifyContent="center">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, minWidth: 340, maxWidth: 480, width: '100%' }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center" color="#f68b1e">
          Seller Center
        </Typography>
        <Typography variant="body1" mb={3} align="center">
          List your livestock and farm products for sale. Fill in the details below:
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price (KES)"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            fullWidth
            type="text"
            sx={{ mb: 2 }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9,]*' }}
            placeholder="e.g. 10,000"
          />
          <TextField
            label="Stock"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            fullWidth
            type="number"
            sx={{ mb: 2 }}
          />
          <Autocomplete
            freeSolo
            options={categories}
            getOptionLabel={option => typeof option === "string" ? option : option.name}
            value={form.category}
            onChange={(event, newValue) => {
              setForm(prev => ({
                ...prev,
                category: typeof newValue === "string" ? newValue : (newValue?.name || "")
              }));
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Category"
                name="category"
                placeholder="Type or select category"
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />
          {/* Animal Health Fields */}
          <Box display="flex" alignItems="center" mb={2}>
            <input
              type="checkbox"
              id="is_vaccinated"
              name="is_vaccinated"
              checked={form.is_vaccinated}
              onChange={handleChange}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="is_vaccinated">Vaccinated</label>
          </Box>
          <TextField
            label="Last Vaccination Date"
            name="last_vaccination_date"
            type="date"
            value={form.last_vaccination_date}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Health Certificate URL"
            name="health_certificate_url"
            value={form.health_certificate_url}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="Paste certificate link (optional)"
          />
          <TextField
            label="Vet Verified By"
            name="vet_verified_by"
            value={form.vet_verified_by}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="Vet name (optional)"
          />
          <TextField
            label="Animal Tag Number (Ear Tag)"
            name="tag_number"
            value={form.tag_number}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="e.g. 12345-AB"
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mb: 2, bgcolor: '#f68b1e', color: '#fff', fontWeight: 700 }}
          >
            Upload Image
            <input type="file" name="image" accept="image/*" hidden onChange={handleChange} />
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ fontWeight: 700, py: 1.2 }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Listing"}
          </Button>
        </form>
        {/* My Listings */}
        <Box mt={5}>
          <Typography variant="h6" fontWeight={700} mb={2} color="#f68b1e" align="center">
            My Listings
          </Typography>
          {myListings.length === 0 ? (
            <Typography variant="body2" align="center" color="text.secondary">
              No listings yet.
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {myListings.map(listing => (
                <Paper key={listing.id} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  {listing.image && (
                    <img src={listing.image} alt={listing.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                  )}
                  <Box>
                    <Typography fontWeight={700}>{listing.name}</Typography>
                    {listing.tag_number && (
                      <Typography variant="body2" color="info.main" fontWeight={700} sx={{ fontSize: { xs: 13, sm: 15 } }}>
                        Animal Tag: {listing.tag_number}
                        {(listing.sex || listing.sex_identity)
                          ? ((listing.sex || listing.sex_identity).toLowerCase().startsWith('m') ? '-M'
                            : (listing.sex || listing.sex_identity).toLowerCase().startsWith('f') ? '-F'
                            : '')
                          : ''}
                      </Typography>
                    )}
                    <Typography variant="body2">{listing.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {listing.price ? `KSh ${Number(listing.price).toLocaleString()}` : ''}
                    </Typography>
                    {/* Image upload button below animal tag */}
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      sx={{ mt: 1, mb: 1 }}
                    >
                      {listing.image ? 'Change Picture' : 'Add Picture'}
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        hidden
                        onChange={e => handleImageUpload(e, listing.id)}
                      />
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
