import Product from "../models/product.model.js";
import { uploadFile } from "../Services/storage.services.js";

export const createProduct = async (req, res, next) => {
    try {
        const filesUrls = [];
        for (const file of req.files ?? []) {
            const response = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            });
            filesUrls.push(response.url);
        }

        const product = await Product.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            sizes: req.body.sizes,
            images: filesUrls,
            seller: req.user.id,
            published: true
        });

        res.status(201).json({
            message: "Product created successfully",
            data: { product }
        });
    } catch (error) {
        console.error("Error creating product:", error);
        next(error);
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ published: true })
        res.status(200).json({
            message: "Products fetched successfully",
            data: {
                products
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching products",
            error: error.message
        })
    }
}

export const getProductDetail = async (req, res) => {

    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product || !product.published) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product detailed by id",
            data: {
                product
            }
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching a product",
            error: error.message
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { ...data } = req.body;
        const product = await Product.findByIdAndUpdate(id, data,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating a product",
            error: error.message
        })
    }
}

export const deleteProduct= async (req,res) => {
    try {
        const {id}=req.params;
        await Product.findByIdAndDelete(id);

        res.status(200).json({
            message:"Product Successfully Deleted"
        })
    } catch (error) {
         res.status(500).json({
            message: "Error deleting a product",
            error: error.message
        })
    }
}
