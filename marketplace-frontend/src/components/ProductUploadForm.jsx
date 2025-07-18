// src/components/ProductUploadForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Autocomplete from "@mui/material/Autocomplete";

export default function ProductUploadForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/categories/")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
  };

  // For Autocomplete
  const handleCategoryChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      category: typeof newValue === "string" ? newValue : (newValue?.name || "")
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    try {
      await axios.post("http://127.0.0.1:8000/products/", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSnackbarMsg("✅ Product uploaded successfully!");
      setSnackbarOpen(true);
      setFormData({ name: "", description: "", price: "", stock: "", category: "", image: null });
    } catch (err) {
      console.error("Upload failed:", err);
      setSnackbarMsg("❌ Upload failed.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="linear-gradient(to bottom right, #e0f2fe, #f0fdf4)" py={6} px={2}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 700, borderRadius: 4, p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} color="success.main" align="center">
          Add New Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Stack spacing={2} flex={1}>
              <TextField
                label="Name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Stock"
                name="stock"
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                required
                fullWidth
              />
              <Autocomplete
                freeSolo
                options={categories}
                getOptionLabel={(option) => typeof option === "string" ? option : option.name}
                value={formData.category}
                onChange={handleCategoryChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    name="category"
                    placeholder="Type or select category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                )}
              />
            </Stack>
            <Stack spacing={2} flex={1} justifyContent="space-between">
              <TextField
                label="Description"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                fullWidth
                multiline
                minRows={4}
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 1 }}
              >
                Upload Product Image
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleChange}
                />
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                fullWidth
                sx={{ fontWeight: 'bold', fontSize: '1.1rem', borderRadius: 2, py: 1.5, mt: 2 }}
              >
                Upload Product
              </Button>
            </Stack>
          </Stack>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarMsg.startsWith('✅') ? 'success' : 'error'} sx={{ width: '100%' }}>
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
