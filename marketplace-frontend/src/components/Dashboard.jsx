import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // use the hook!
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

const Dashboard = () => {
  const { token } = useAuth(); // use the hook to get token
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://127.0.0.1:8000/api/analytics/sales-trends/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (!data.length)
    return <Typography mt={4}>No analytics data available.</Typography>;

  return (
    <Box maxWidth={700} mx="auto" mt={4} px={{ xs: 2, sm: 0 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Sales Trends & Price History
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total_sales"
              stroke="#f68b1e"
              name="Total Sales"
            />
            <Line
              type="monotone"
              dataKey="avg_price"
              stroke="#388e3c"
              name="Average Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;