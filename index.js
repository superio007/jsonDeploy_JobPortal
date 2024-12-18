const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load jobs data
const jobsFilePath = "./jobs.json";
let jobsData = JSON.parse(fs.readFileSync(jobsFilePath, "utf8"));

// Get all jobs
app.get("/jobs", (req, res) => {
  res.json(jobsData.jobs);
});

// Get a single job by ID
app.get("/jobs/:id", (req, res) => {
  const job = jobsData.jobs.find((j) => j.id === req.params.id);
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

// Add a new job
app.post("/jobs", (req, res) => {
  const newJob = req.body;
  newJob.id = (jobsData.jobs.length + 1).toString(); // Generate a new ID
  jobsData.jobs.push(newJob);
  fs.writeFileSync(jobsFilePath, JSON.stringify(jobsData, null, 2));
  res.status(201).json(newJob);
});

// Update a job
app.put("/jobs/:id", (req, res) => {
  const jobIndex = jobsData.jobs.findIndex((j) => j.id === req.params.id);
  if (jobIndex !== -1) {
    jobsData.jobs[jobIndex] = { ...jobsData.jobs[jobIndex], ...req.body };
    fs.writeFileSync(jobsFilePath, JSON.stringify(jobsData, null, 2));
    res.json(jobsData.jobs[jobIndex]);
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

// Delete a job
app.delete("/jobs/:id", (req, res) => {
  const jobIndex = jobsData.jobs.findIndex((j) => j.id === req.params.id);
  if (jobIndex !== -1) {
    const deletedJob = jobsData.jobs.splice(jobIndex, 1);
    fs.writeFileSync(jobsFilePath, JSON.stringify(jobsData, null, 2));
    res.json(deletedJob);
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
