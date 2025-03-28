const express = require("express");
const {
  updateLeadResult,
  getAssignedLeads,
  getTelecallerHistory,
  login,
  addnotestotelecallerandlead,
  addfiles,
  getTodaysCallbacks,
  addLeadsFromTelecaller
} = require("../controller/telecaller");

const router = express.Router();
router.post("/login",(req,res)=>login(req,res,req.db));
router.post("/update-lead", (req, res) => updateLeadResult(req, res, req.db));
router.get("/leads/:telecallerId", (req, res) => getAssignedLeads(req, res, req.db));
router.get("/history/:telecallerId", (req, res) => getTelecallerHistory(req, res, req.db));
router.get("/getTodaysCallbacks/:telecallerId", (req, res) => getTodaysCallbacks(req, res, req.db));
router.post("/addnotes",(req,res)=>addnotestotelecallerandlead(req,res,req.db));
router.post("/addfiles",(req,res)=>addfiles(req,res,req.db));
router.post("/addLeadsFromTelecaller", (req, res) => addLeadsFromTelecaller(req, res, req.db));

module.exports = router;
