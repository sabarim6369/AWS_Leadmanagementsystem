const telecallerSchema = require("../schema/telecallerschema");
const Lead = require("../schema/leadschema");
const {getDatabaseConnection} = require('../config/db'); 
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const express = require("express");
const app = express();
const mongoose = require('mongoose');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
const updateLeadResult = async (req, res) => {
    try {
        const { telecallerId, leadId, action, notes } = req.body;

        if (!telecallerId || !leadId || !action) {
            return res.status(400).json({ message: "Telecaller ID, Lead ID, and action are required." });
        }

        const telecaller = await req.db.Telecaller.findById(telecallerId);
        if (!telecaller) {
            return res.status(404).json({ message: "Telecaller not found." });
        }

        const lead = await req.db.Lead.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: "Lead not found." });
        }

        const validStatuses = ["unassigned", "warm", "cold", "hot", "fulfilled"];
        if (!validStatuses.includes(action)) {
            return res.status(400).json({ message: `Invalid action provided. Valid actions: ${validStatuses.join(", ")}.` });
        }

        lead.status = action;
        await lead.save();

        telecaller.history.push({
            leadId: lead._id,
            action,
            notes,
        });

        await telecaller.save();

        res.status(200).json({ message: "Lead result updated successfully.", lead });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating lead result.", error: err });
    }
};

const  getAssignedLeads = async (req, res) => {
    try {
        const { telecallerId } = req.params;
const Telecaller = req.db.model("Telecaller");
const telecaller = await Telecaller.findById(telecallerId).populate({
    path: "leads",
    select: "name mobilenumber status notes callbackTime files email address",
    populate: {
        path: "notes.telecallerId",
        model: "Telecaller", 
        select: "username",      
    },
});

        if (!telecaller) {
            return res.status(404).json({ message: "Telecaller not found." });
        }
        res.status(200).json({ leads: telecaller.leads });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching assigned leads.", error: err });
    }
};

const getTelecallerHistory = async (req, res) => {
    try {
        const { telecallerId } = req.params;
        const today = new Date().toISOString().split("T")[0];
        console.log(telecallerId)
        const Telecaller = req.db.model("Telecaller");

        const telecaller = await Telecaller.findById(telecallerId).populate("history.leadId");
        if (!telecaller) {
            return res.status(404).json({ message: "Telecaller not found." });
        }
        const dailyStats = telecaller.dailyStats.find(stat => stat.date === today);
        console.log("Today's Daily Stats:", dailyStats);

        // console.log(telecaller)
        res.status(200).json({ history: telecaller.history,telecallerdetails:telecaller, dailyStats: dailyStats || {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching telecaller history.", error: err });
    }
};

const getTodaysCallbacks = async (req, res) => {
    try {
        console.log("Fetching today's callbacks...");
        const { telecallerId } = req.params;
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        
        const Telecaller = req.db.model("Telecaller");

        const telecaller = await Telecaller.findById(telecallerId).populate("history.leadId");
        if (!telecaller) {
            return res.status(404).json({ message: "Telecaller not found." });
        }

        // Filter only today's callbacks
        const todaysCallbacks = telecaller.history.filter(entry => 
            entry.callbackTime && entry.callbackTime.toISOString().split("T")[0] === today
        );
console.log(todaysCallbacks.length)
        res.status(200).json({ callbacks: todaysCallbacks, telecallerDetails: telecaller });
    } catch (err) {
        console.error("Error fetching today's callbacks:", err);
        res.status(500).json({ message: "Error fetching today's callback schedule.", error: err });
    }
};

const login = async (req, res) => {
    const { email, password,rememberMe } = req.body;
    console.log("😎😎",req.body);

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    try {
        const Admin = req.db.model('Admin');
        const admin = await Admin.findOne({ "telecallers.email": email });

        if (!admin) {
            return res.status(401).json({ message: "Admin not found." });
        }
        if (admin.status === "paused") {
            return res.status(403).json({ message: "Your branch's account has been paused. Please wait until your admin reaches out to the superadmin for resolution." });
        } 
        if (admin.status === "inactive") {
            return res.status(403).json({ message: "Your branch's account has been deleted." });
        }
        const telecaller = admin.telecallers.find(tc => tc.email === email);

        if (!telecaller) {
            return res.status(401).json({ message: "Telecaller not found." });
        }

        const adminDbConnection = await getDatabaseConnection(admin.databaseName);

        const TelecallerModel = adminDbConnection.model('Telecaller', telecallerSchema);

        const foundTelecaller = await TelecallerModel.findOne({ email });

        if (!foundTelecaller) {
            return res.status(401).json({ message: "Telecaller not found in admin's database." });
        }

        const isMatch = await bcrypt.compare(password, foundTelecaller.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const databaseName = admin.databaseName;

        console.log("Database Name:", databaseName);

        const token = jwt.sign({ telecallerId: foundTelecaller._id, adminId: admin._id, databaseName, role: "telecaller" }, process.env.JWT_SECRET, { expiresIn:rememberMe?'30d':'1d' });

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in", error: err });
    }
};
const addnotestotelecallerandlead = async (req, res) => {
    console.log(req.body);
    const { telecallerId, leadId, note, status, callbackTime, answered } = req.body;
    const Telecaller = req.db.model("Telecaller");
    const Lead = req.db.model("Lead");
    
    try {
        const telecaller = await Telecaller.findById(telecallerId);
        if (!telecaller) {
            return res.status(404).json({ message: "Telecaller not found." });
        }

        const lead = await Lead.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: "Lead not found." });
        }

        let statusChangeNote = "";
        if (status && lead.status !== status) {
            statusChangeNote = `Status changed from '${lead.status}' to '${status}'.`;
            lead.status = status;
        }

        const newNote = {
            note: statusChangeNote ? `${note} (${statusChangeNote})` : note,
            telecallerId: telecallerId,
        };

        lead.notes.push(newNote);

        const newHistory = {
            leadId,
            action: "Added a note",
            notes: statusChangeNote ? `${note} (${statusChangeNote})` : note,
        };

        if (callbackTime) {
            const lastNoteIndex = lead.notes.length - 1;
            if (lastNoteIndex >= 0) {
                lead.notes[lastNoteIndex].callbackTime = new Date(callbackTime);
                lead.notes[lastNoteIndex].callbackScheduled = true;
            }
            newHistory.callbackTime = new Date(callbackTime);
            newHistory.callbackScheduled = true;
        }
        telecaller.history.push(newHistory);
        telecaller.totalcalls += 1;
        if (answered) {
            telecaller.answeredcalls += 1;
        } else {
            telecaller.notansweredcalls += 1;
        }
        if (status === "fulfilled") {
            telecaller.confirmed += 1;
        }
        const today = new Date().toISOString().split('T')[0];
        let todayStats = telecaller.dailyStats.find(stat => stat.date === today);

        if (!todayStats) {
            todayStats = {
                date: today,
                totalcalls: 0,
                answeredcalls: 0,
                notansweredcalls: 0,
                confirmed: 0
            };
            telecaller.dailyStats.push(todayStats);
        }

        todayStats.totalcalls += 1;
        if (answered) todayStats.answeredcalls += 1;
        else todayStats.notansweredcalls += 1;
        if (status === "fulfilled") todayStats.confirmed += 1;

        await telecaller.save();
        await lead.save();

        res.status(200).json({
            message: "Note added, status updated, and call counted.",
            lead: lead,
        });
    } catch (error) {
        console.error("Error while adding note and updating status:", error);
        res.status(500).json({
            message: "Error while adding note and updating status.",
            error: error.message,
        });
    }
};

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
const addfiles=async(req,res)=>{
     try {
            console.log("Received Data:", req.body);
            console.log("Received Files:", req.files);
    
            const { leadId } = req.body;
            const Lead = req.db.model("Lead");
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
    console.log("😎😎😎😎😎")
            res.status(200).json({ success: true, uploadedFiles });
        } catch (error) {
            console.error("Error uploading files:", error);
            res.status(500).json({
                error: error.message,
                stack: error.stack,
            });
        }
}

const addLeadsFromTelecaller = async (req, res) => {
    try {
        console.log(req.body);
        const { leadsData, adminid, telecallerId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(adminid)) {
            return res.status(400).json({ message: "Invalid Admin ID" });
        }

        if (!mongoose.Types.ObjectId.isValid(telecallerId)) {
            return res.status(400).json({ message: "Invalid Telecaller ID" });
        }

        if (!Array.isArray(leadsData) || leadsData.length === 0) {
            return res.status(400).json({ message: "No data provided or invalid format." });
        }

        const Leads = req.db.model("Lead");

        // Extract emails and phone numbers from incoming leads
        const emails = leadsData.map(lead => lead.Email).filter(email => email);

        // Check for existing leads with the same email or phone number
        const existingLeads = await Leads.find({
            $or: [{ email: { $in: emails } }]
        });

        // Filter out duplicate leads
        const newLeads = leadsData.filter(
            lead => !existingLeads.some(
                existing => existing.email === lead.Email || existing.mobilenumber === lead.Phone
            )
        );

        if (newLeads.length === 0) {
            return res.status(409).json({ message: "Leads with these details already exist." });
        }

        // Map and insert new leads
        const leadsToInsert = newLeads.map((lead) => ({
            name: lead.Name,
            mobilenumber: lead.Phone,
            address: lead.City || "",
            gender: lead.Gender || "",
            country: lead.Country || "",
            age: lead.Age || null,
            date: lead.Date || "",
            id: lead.Id || null,
            email: lead.Email,
            assignedTo: [telecallerId],
            adminId: adminid,
            status: "assigned"
        }));

        const insertedLeads = await Leads.insertMany(leadsToInsert);

        console.log(`Inserted ${insertedLeads.length} new leads`);

        // Update admin and telecaller counts
        const superAdminDbURI = process.env.MONGODB_SUPERADMINURI;
        const superAdminConnection = await mongoose.createConnection(superAdminDbURI).asPromise();

        const AdminModel = superAdminConnection.model("Admin", require("../schema/Adminschema"));
        await AdminModel.updateOne({ _id: adminid }, { $inc: { leads: insertedLeads.length } });

        const TelecallerModel = superAdminConnection.model("Telecaller", require("../schema/telecallerschema"));
        await TelecallerModel.updateOne(
            { _id: telecallerId },
            { $inc: { assignedLeads: insertedLeads.length } }
        );

        // Assign Leads to Telecaller
        const Telecaller = req.db.model("Telecaller");
        const telecaller = await Telecaller.findById(telecallerId);
        if (!telecaller) {
            return res.status(404).json({ message: "Telecaller not found." });
        }

        telecaller.leads.push(...insertedLeads.map(lead => lead._id));
        telecaller.pending += insertedLeads.length;
        await telecaller.save();

        res.status(201).json({
            message: `${insertedLeads.length} new leads added successfully.`,
            totalLeadsInserted: insertedLeads.length
        });

    } catch (err) {
        console.error("Error uploading leads:", err);
        res.status(500).json({ message: "Error uploading leads", error: err.message });
    }
};




module.exports = {
    updateLeadResult,
    getAssignedLeads,
    getTelecallerHistory,
    login,
    addnotestotelecallerandlead,
    addfiles,
    getTodaysCallbacks,
    addLeadsFromTelecaller
};
