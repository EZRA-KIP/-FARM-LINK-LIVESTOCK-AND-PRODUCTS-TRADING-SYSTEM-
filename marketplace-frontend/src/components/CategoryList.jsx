import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default function CategoryList() {
  const categories = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
    { id: 3, name: "Category 3" },
  ]; // This is just sample data. Replace it with your actual data source.

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Category List Page
      </Typography>
      <Typography>This will show all product categories.</Typography>
      <Box mt={2}>
        {categories.map((category) => (
          <Typography key={category.id} variant="body1" gutterBottom>
            <Link to={`/categories/${category.id}`}>{category.name}</Link>
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
