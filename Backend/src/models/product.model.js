import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    images: {
        type: [{
            type: String
        }],
        validate: {
            validator: images => images.length <= 5,
            message: "A product can have at most 5 images"
        }
    },
    price: {
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
            enum: ["USD", "EUR", "INR"], // Add more currencies as needed
            default: "INR"
        }
    },
    sizes: [
        {
            size: {
                type: String,
                enum: ["XS", "S", "M", "L", "XL", "XXL"],
                required: true
            },
            stock: {
                type: Number,
                min: 0,
                default: 0
            }
        }
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    published: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
