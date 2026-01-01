const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/submit-feedback", (req, res) => {
    const { name, email, rating, feedback } = req.body;

    const data = `
Name: ${name}
Email: ${email}
Rating: ${rating}
Feedback: ${feedback}
Time: ${new Date().toLocaleString()}
------------------------------
`;

    fs.appendFile("feedback.txt", data, (err) => {
        if (err) {
            return res.status(500).json({ status: "error" });
        }
        res.json({ status: "success" });
    });
});

app.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
});
