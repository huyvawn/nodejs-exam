const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/nodejsexam')

// REST API to add new products
app.post('/api/products', async (req, res) => {
    try {
      // Convert dd/mm/yyyy format
      const parts = req.body.ProductDate.split('/');
      const productDate = new Date(parts[2], parts[1] - 1, parts[0]);
  
      const product = new Product({
        ProductCode: req.body.ProductCode,
        ProductName: req.body.ProductName,
        ProductDate: productDate,
        ProductOriginPrice: parseFloat(req.body.ProductOriginPrice.replace(/\./g, '')),
        Quantity: parseInt(req.body.Quantity),
        ProductStoreCode: req.body.ProductStoreCode
      });
  
      await product.save();
      res.status(201).json({ message: 'Product has been inserted!', product });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // REST API to delete products
app.delete('/api/products/:code', async (req, res) => {
try {
    const result = await Product.deleteOne({ ProductCode: req.params.code });
    if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'NO products were deleted.' });
    }
    res.json({ message: 'Product has been deleted!' });
} catch (err) {
    res.status(500).json({ message: 'Encountered problem.' });
}
});

// Show all products in descending order
app.get('/', async (req, res) => {
try {
    const products = await Product.find().sort({ ProductStoreCode: -1 });
    res.render('index', { products });
} catch (err) {
    res.send(err.message);
}
});
  
  //Insert Products
app.post('/products/create', async (req, res) => {
    try {
      const parts = req.body.ProductDate.split('/');
      const productDate = new Date(parts[2], parts[1] - 1, parts[0]);
  
      const product = new Product({
        ProductCode: req.body.ProductCode,
        ProductName: req.body.ProductName,
        ProductDate: productDate,
        ProductOriginPrice: parseFloat(req.body.ProductOriginPrice.replace(/\./g, '')),
        Quantity: parseInt(req.body.Quantity),
        ProductStoreCode: req.body.ProductStoreCode
      });
  
      await product.save();
      res.redirect('/');
    } catch (err) {
      res.send(err.message);
    }
  });
  
  // Delete products
app.post('/products/delete/:code', async (req, res) => {
try {
    await Product.deleteOne({ ProductCode: req.params.code });
    res.redirect('/');
} catch (err) {
    res.send(err.message);
}
});

// Start server
app.listen(3000, () => {
console.log('Server started on http://localhost:3000');
});