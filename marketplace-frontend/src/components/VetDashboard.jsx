import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import axios from "axios";

export default function VetDashboard() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/products/");
        setAnimals(res.data);
      } catch (err) {
        setError("Failed to fetch animal records");
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, []);

  return (
    <Box p={4} maxWidth={1100} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={3} color="#f68b1e">
        Vet Dashboard
      </Typography>
      <Typography variant="body1" mb={3}>
        View and manage animal vaccination and health records. Only healthy, vaccinated animals should be marked as "Vet Verified" for sale.
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error.main">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Animal Tag</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Vaccinated</TableCell>
                <TableCell>Last Vaccination</TableCell>
                <TableCell>Health Certificate</TableCell>
                <TableCell>Vet Verified By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {animals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>
                    {animal.tag_number && (
                      <span style={{ fontWeight: 700, color: '#1976d2' }}>
                        {animal.tag_number}
                        {(animal.sex || animal.sex_identity)
                          ? ((animal.sex || animal.sex_identity).toLowerCase().startsWith('m') ? '-M'
                            : (animal.sex || animal.sex_identity).toLowerCase().startsWith('f') ? '-F'
                            : '')
                          : ''}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{animal.name}</TableCell>
                  <TableCell>{animal.category}</TableCell>
                  <TableCell>
                    {animal.is_vaccinated ? (
                      <Chip label="Vaccinated" color="success" />
                    ) : (
                      <Chip label="Not Vaccinated" color="warning" />
                    )}
                  </TableCell>
                  <TableCell>{animal.last_vaccination_date || "-"}</TableCell>
                  <TableCell>
                    {animal.health_certificate_url ? (
                      <a href={animal.health_certificate_url} target="_blank" rel="noopener noreferrer">View</a>
                    ) : "-"}
                  </TableCell>
                  <TableCell>{animal.vet_verified_by || "-"}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" color="primary" disabled>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
