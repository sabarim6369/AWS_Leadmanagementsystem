// const mongoose = require("mongoose");
// const nodeCron = require("node-cron");
// const fs = require("fs");
// const PDFDocument = require("pdfkit");
// const nodemailer = require("nodemailer");

// const telecallerSchema = require("../schema/telecallerschema");
// const adminSchema = require("../schema/Adminschema");
// const leadSchema=require("../schema/leadschema")
// const superadminDb = mongoose.createConnection(process.env.MONGODB_SUPERADMINURI);
// const Admin = superadminDb.model("Admin", adminSchema);
// const generatePDF = async (admin, telecallersData) => {
//     return new Promise(async (resolve, reject) => {
//         const reportsDir = "./reports";
//         if (!fs.existsSync(reportsDir)) {
//             fs.mkdirSync(reportsDir, { recursive: true });
//         }

//         const doc = new PDFDocument({ margin: 50 });
//         const fileName = `${reportsDir}/${admin.databaseName}_${Date.now()}.pdf`;
//         const stream = fs.createWriteStream(fileName);
//         doc.pipe(stream);

//         // **Company Logo (Optional)**
//         const logoPath = "./logo.png";
//         if (fs.existsSync(logoPath)) {
//             doc.image(logoPath, { width: 100, align: "center" }).moveDown(1);
//         }

//         // **Report Title**
//         doc.font("Helvetica-Bold").fontSize(20).text(`Daily Call Report`, { align: "center" }).moveDown();
//         doc.font("Helvetica").fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" }).moveDown(2);

//         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(2);

//         for (const { telecaller, history, Lead } of telecallersData) {
//             // **Telecaller Information**
//             doc.font("Helvetica-Bold").fontSize(14).text(`Telecaller: ${telecaller.username}`, { underline: true }).moveDown();
//             doc.font("Helvetica").fontSize(12)
//                 .text(`Email: ${telecaller.email}`)
//                 .text(`Phone: ${telecaller.number || "N/A"}`)
//                 .moveDown(1);

//             doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

//             // **Call History**
//             for (const [index, entry] of history.entries()) {
//                 try {
//                     const lead = await Lead.findOne({ _id: entry.leadId });

//                     doc.font("Helvetica-Bold").text(`Call ${index + 1}:`, { continued: true })
//                         .font("Helvetica").text(`  (${new Date(entry.timestamp).toLocaleString()})`);

//                     if (lead) {
//                         doc.font("Helvetica-Bold").text("Lead Name: ", { continued: true }).font("Helvetica").text(lead.name || "N/A");
//                         doc.font("Helvetica-Bold").text("Mobile Number: ", { continued: true }).font("Helvetica").text(lead.mobilenumber || "N/A");
//                         doc.font("Helvetica-Bold").text("Address: ", { continued: true }).font("Helvetica").text(lead.address || "N/A");
//                     }

//                     doc.font("Helvetica-Bold").text("Lead ID: ", { continued: true }).font("Helvetica").text(entry.leadId);
//                     doc.font("Helvetica-Bold").text("Action: ", { continued: true }).font("Helvetica").text(entry.action);

//                     if (entry.notes) {
//                         doc.font("Helvetica-Bold").text("Notes: ", { continued: true }).font("Helvetica").text(entry.notes);
//                     }

//                     // **Line Separator**
//                     doc.moveDown();
//                     doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);
//                 } catch (error) {
//                     console.error(`Error fetching lead: ${entry.leadId}`, error);
//                 }
//             }

//             doc.moveDown(2);
//         }

//         doc.end();
//         stream.on("finish", () => resolve(fileName));
//         stream.on("error", reject);
//     });
// };


  
  

// const sendEmail = async (adminEmail, filePath, telecallerName) => {
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user:"sabarim6369@gmail.com",
//         pass:"uieq qvys aybv ldot",
//     },
//   });

//   let mailOptions = {
//     from: "sabarim6369@gmail.com",
//     to: adminEmail,
//     subject: `Daily Report - ${telecallerName}`,
//     text: "Attached is the daily call report.",
//     attachments: [{ filename: "DailyReport.pdf", path: filePath }],
//   };

//   return transporter.sendMail(mailOptions);
// };
// // nodeCron.schedule("0 22 * * *", async () => {

//     nodeCron.schedule("* * * * *", async () => {
//         console.log("Running Cron Job for Daily Reports");
      
//         try {
//           const admins = await Admin.find({});
      
//           for (const admin of admins) {
//             const adminDb = mongoose.createConnection(`${process.env.MONGODB_URIFORCRON}/${admin.databaseName}`);
//             const Telecaller = adminDb.model("Telecaller", telecallerSchema);
//             const Lead = adminDb.model("Lead", leadSchema);
      
//             let telecallersData = [];
      
//             for (const telecallerData of admin.telecallers) {
//               const telecaller = await Telecaller.findOne({ email: telecallerData.email });
      
//               if (telecaller) {
//                 const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
//                 const history = telecaller.history.filter(entry =>
//                   entry.timestamp.toISOString().startsWith(today)
//                 );
      
//                 if (history.length > 0) {
//                   telecallersData.push({ telecaller, history, Lead });
//                 }
//               }
//             }
//       console.log("😍😍😍😍😍",telecallersData.length);
//             if (telecallersData.length > 0) {
//               const pdfPath = await generatePDF(admin, telecallersData);
//               await sendEmail(admin.email, pdfPath, "All Telecallers");
//               console.log(`Report sent to ${admin.email} for all telecallers`);
//             }
      
//             await adminDb.close();
//           }
//         } catch (error) {
//           console.error("Error in cron job:", error);
//         }
//       });
      
const mongoose = require("mongoose");
const nodeCron = require("node-cron");
const fs = require("fs");
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");

const telecallerSchema = require("../schema/telecallerschema");
const adminSchema = require("../schema/Adminschema");
const leadSchema = require("../schema/leadschema");

const superadminDb = mongoose.createConnection(process.env.MONGODB_SUPERADMINURI);
const Admin = superadminDb.model("Admin", adminSchema);
const generateExcel = async (telecallers, Lead) => {
    return new Promise(async (resolve, reject) => {
        try {
            const reportsDir = "./reports";
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const fileName = `${reportsDir}/Admin_Report_${Date.now()}.xlsx`;
            const wb = xlsx.utils.book_new();
            const wsData = [];

            for (const telecaller of telecallers) {
                const today = new Date().toISOString().split("T")[0];
                const history = telecaller.history.filter(entry => entry.timestamp.toISOString().startsWith(today));

                if (history.length === 0) continue; // Skip if no calls today

                // Add space before telecaller details
                if (wsData.length > 0) {
                    wsData.push([]); // Empty row for spacing
                    wsData.push([]);
                }

                // **Telecaller Name as Section Heading**
                wsData.push([`${telecaller.username} ( ${telecaller.email} )`]);
                wsData.push([]); // Empty row after heading for spacing

                // Column Headers with spacing
                wsData.push(["Lead Name", "", "Lead Email", "", "Callback Scheduled", "", "Notes", "", "Call Timestamp"]);
                
                for (const entry of history) {
                    const lead = await Lead.findById(entry.leadId); // Fetch lead details
                    wsData.push([
                        lead ? lead.name || "N/A" : "N/A", "", 
                        lead ? lead.email || "N/A" : "N/A", "", 
                        entry.callbackScheduled ? entry.callbackTime.toLocaleString() : "No call back scheduled", "", 
                        entry.notes || "N/A", "", 
                        entry.timestamp.toLocaleString()
                    ]);
                }

                // Add an extra row for spacing before the next telecaller section
                wsData.push([]);
            }

            // Convert data to worksheet and append it to the workbook
            const ws = xlsx.utils.aoa_to_sheet(wsData);
            xlsx.utils.book_append_sheet(wb, ws, "Call History");

            // Write to file
            xlsx.writeFile(wb, fileName);
            resolve(fileName);
        } catch (error) {
            reject(error);
        }
    });
};



const sendEmail = async (adminEmail, filePath) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "sabarim6369@gmail.com",
            pass: "uieq qvys aybv ldot",
        },
    });

    let mailOptions = {
        from: "sabarim6369@gmail.com",
        to: adminEmail,
        subject: "Daily Report - All Telecallers",
        text: "Attached is the daily call report for all telecallers under your administration.",
        attachments: [{ filename: "DailyReport.xlsx", path: filePath }],
    };

    return transporter.sendMail(mailOptions);
};

// Schedule the cron job
nodeCron.schedule("0 22 * * *", async () => {
    console.log("Running Cron Job for Daily Reports");

    try {
        const admins = await Admin.find({});

        for (const admin of admins) {
            const adminDb = mongoose.createConnection(`${process.env.MONGODB_URIFORCRON}/${admin.databaseName}`);
            const Telecaller = adminDb.model("Telecaller", telecallerSchema);
            const Lead = adminDb.model("Lead", leadSchema);

            const telecallers = await Telecaller.find({ email: { $in: admin.telecallers.map(t => t.email) } });

            if (telecallers.length > 0) {
                const excelPath = await generateExcel(telecallers, Lead);
                await sendEmail(admin.email, excelPath);
                console.log(`Excel Report sent to ${admin.email} for all telecallers.`);
            }

            await adminDb.close();
        }
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});
