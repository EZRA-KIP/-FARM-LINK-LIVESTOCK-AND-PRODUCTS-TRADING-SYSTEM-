import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [snackbar, setSnackbar] = useState({ open: false, msg: '' });

  const categories = ['All', 'Cows', 'Goats', 'Sheep', 'Milk', 'Eggs', 'Poultry', 'Feeds'];
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/products/')
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    let updated = products;

    // Category filter: match if product name or category matches selectedCategory
    if (selectedCategory && selectedCategory !== 'All') {
      updated = updated.filter(product => {
        const catName = typeof product.category === 'string'
          ? product.category
          : product.category?.name;
        // Match if product name or category matches selectedCategory (case-insensitive)
        return (
          (catName && catName.toLowerCase() === selectedCategory.toLowerCase()) ||
          (product.name && product.name.toLowerCase().includes(selectedCategory.toLowerCase()))
        );
      });
    }

    // Search filter: match if name, description, or category contains search text
    if (search.trim() !== '') {
      updated = updated.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase()) ||
        (typeof product.category === 'string'
          ? product.category
          : product.category?.name
        )?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(updated);
  }, [search, selectedCategory, products]);

  // Handler for Add to Cart
  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbar({ open: true, msg: `${product.name} added to cart!` });
  };

  // Handler for closing snackbar
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: { xs: 1, sm: 2 } }}>
      {/* Sidebar for categories (hidden on mobile) */}
      <Paper
        elevation={3}
        sx={{
          width: 220,
          mr: 3,
          p: 2,
          display: { xs: 'none', md: 'block' },
          minWidth: 180
        }}
      >
        <Typography variant="h6" gutterBottom>Categories</Typography>
        <Divider sx={{ mb: 1 }} />
        <List>
          {categories.map((cat, index) => (
            <ListItem
              key={index}
              button
              onClick={() => setSelectedCategory(cat)}
              selected={selectedCategory === cat}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: selectedCategory === cat ? '#f68b1e' : 'transparent',
                color: selectedCategory === cat ? 'white' : 'inherit',
                fontWeight: selectedCategory === cat ? 700 : 400,
                '&:hover': {
                  bgcolor: '#f68b1e',
                  color: 'white'
                }
              }}
            >
              <ListItemText primary={cat} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Mobile category select */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
        <Select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2, bgcolor: '#fff' }}
        >
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* Main product area */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
          <TextField
            label="Search Products"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <Button onClick={() => setSearch('')} size="small">
                    <CloseIcon />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={{ xs: 1, sm: 2 }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
                  }}
                >
                  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        product.image
                          ? (product.image.startsWith('http')
                              ? product.image
                              : `http://127.0.0.1:8000/media/${product.image}`)
                          : '/placeholder.jpg'
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  </Link>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" noWrap>{product.name}</Typography>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Ksh {Number(product.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      Product Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  color: '#f68b1e',
                  fontWeight: 700,
                  fontSize: 22,
                  border: '2px dashed #f68b1e',
                  borderRadius: 3,
                  background: '#fff8f0'
                }}
              >
                No products found for <span style={{ color: '#222' }}>"{search}"</span>
                {selectedCategory && selectedCategory !== 'All' && (
                  <> in <span style={{ color: '#222' }}>"{selectedCategory}"</span> category</>
                )}
                .
              </Box>
            </Grid>
          )}
        </Grid>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {snackbar.msg}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ProductList;
