const Product = require('../models/product');
const slugify = require("slugify");

// create product
exports.createProduct = async (req, res) => {
    try {

        const {
            title,
            description,
            price,
            category,
            images,
        } = req.body;

        // Generate slug from title
        const slug = slugify(title, { lower: true, strict: true });

        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) return res.status(400).json({ message: "Product with this title already exists." });

        const product = await Product.create({
            title,
            slug,
            description,
            price,
            category,
            images,
        });

        res.status(201).json({ message: "Product created successfully", product });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// get all products
exports.getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;

        // Filter conditions
        const filter = {};
        if (category) filter.category = category;
        if (search)
            filter.title = { $regex: search, $options: "i" }; // case-insensitive search

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get single product by slug
exports.getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//  Update product

exports.updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // If title is updated, regenerate slug
        if (updateData.title) {
            updateData.slug = slugify(updateData.title, { lower: true, strict: true });
        }

        const product = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            updateData,
            { new: true }
        );

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};