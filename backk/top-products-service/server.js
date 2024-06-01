const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Mock registration endpoint (simulated)
function registerWithCompanies() {
  // Simulate registration with all e-commerce companies
  console.log("Registered with all companies.");
}

// Cache to store products data with a timestamp
let productCache = {};

// Helper function to fetch products from e-commerce APIs
async function fetchProductsFromCompanies(category) {
  // Simulate API calls to fetch products from different e-commerce companies
  // In reality, replace this with actual API requests using axios
  return [
    { id: uuidv4(), name: "Product 1", rating: 4.5, price: 100, company: "Company A", discount: 10 },
    { id: uuidv4(), name: "Product 2", rating: 4.0, price: 150, company: "Company B", discount: 5 },
    // More products...
  ];
}

// Function to get products from cache or fetch fresh data
async function getProducts(category) {
  const cacheDuration = 10 * 60 * 1000; // 10 minutes
  const now = Date.now();
  
  if (!productCache[category] || (now - productCache[category].timestamp > cacheDuration)) {
    console.log(`Fetching fresh data for category: ${category}`);
    const products = await fetchProductsFromCompanies(category);
    productCache[category] = { timestamp: now, products };
  }
  
  return productCache[category].products;
}

// Endpoint to retrieve top N products within a category
app.get('/categories/:categoryname/products', async (req, res) => {
  const categoryname = req.params.categoryname;
  const n = parseInt(req.query.n) || 10;
  const page = parseInt(req.query.page) || 1;
  const sortBy = req.query.sort_by || 'rating';
  const order = req.query.order || 'desc';
  const minPrice = parseFloat(req.query.min_price) || 0;
  const maxPrice = parseFloat(req.query.max_price) || Infinity;

  try {
    let products = await getProducts(categoryname);

    // Filter products by price range
    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Sort products
    const reverseOrder = order === 'desc';
    products.sort((a, b) => {
      if (reverseOrder) {
        return (b[sortBy] || 0) - (a[sortBy] || 0);
      } else {
        return (a[sortBy] || 0) - (b[sortBy] || 0);
      }
    });

    // Pagination logic
    const start = (page - 1) * n;
    const end = start + n;
    const paginatedProducts = products.slice(start, end);

    res.json(paginatedProducts);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
});

// Endpoint to retrieve specific product details by ID
app.get('/categories/:categoryname/products/:productid', async (req, res) => {
  const categoryname = req.params.categoryname;
  const productid = req.params.productid;

  try {
    const products = await getProducts(categoryname);
    const product = products.find(p => p.id === productid);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the product details.' });
  }
});

// Register with companies on startup
registerWithCompanies();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
