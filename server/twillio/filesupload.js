const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const Lead = require("./models/Lead");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", public_id: `lead_files/${Date.now()}-${fileName}` },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return reject(new Error("Cloudinary Upload Failed"));
                }
                console.log("Cloudinary Upload Success:", result);
                resolve({ fileUrl: result.secure_url, filename: fileName, uploadedAt: new Date() });
            }
        );
        uploadStream.end(fileBuffer);
    });
};

const uploadFiles = async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        console.log("Received Files:", req.files);

        const { leadId } = req.body;
        if (!leadId) {
            return res.status(400).json({ error: "Lead ID is required" });
        }

        const files = req.files ? (Array.isArray(req.files.files) ? req.files.files : [req.files.files]) : [];
        if (files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        let uploadedFiles = [];
        for (const file of files) {
            const uploadedFile = await uploadToCloudinary(file.data, file.name);
            uploadedFiles.push(uploadedFile);
        }

        await Lead.findByIdAndUpdate(leadId, { $push: { files: { $each: uploadedFiles } } });

        res.status(200).json({ success: true, uploadedFiles });
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({
            error: error.message,
            stack: error.stack,
        });
    }
};

module.exports = { uploadFiles };
