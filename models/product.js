const mongoose = require('mongoose');
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            unique: true,
            index: true
        }, // for SEO / URLs

        description: String,

        price: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            trim: true
        },

        images: [
            {
                url: String,
                public_id: String
            }
        ],

        rating: {
            type: Number,
            default: 0
        },

        reviewsCount: {
            type: Number,
            default: 0
        },

    },
    { timestamps: true }
);

// ✅ Automatically generate slug from title before saving
productSchema.pre('save', function (next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});


const Product = mongoose.model("Product", productSchema);
module.exports = Product;