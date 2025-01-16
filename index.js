const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Helper: Decode y value from a given base
function decodeBase(base, value) {
  return parseInt(value, base);
}

// Helper: Lagrange Interpolation to calculate constant term c
function lagrangeInterpolation(points, k) {
  let constantTerm = 0;

  // Calculate Lagrange interpolation
  for (let i = 0; i < k; i++) {
    let xi = points[i].x;
    let yi = points[i].y;
    let li = 1;

    // Calculate L_i(0)
    for (let j = 0; j < k; j++) {
      if (i !== j) {
        li *= -points[j].x / (xi - points[j].x);
      }
    }

    constantTerm += yi * li;
  }

  return Math.round(constantTerm); // Round to nearest integer
}

// Endpoint to process JSON files and calculate constant term
app.get("/calculate", async (req, res) => {
  try {
    // Read both test cases
    const testCase1 = JSON.parse(fs.readFileSync("testcase1.json", "utf8"));
    const testCase2 = JSON.parse(fs.readFileSync("testcase2.json", "utf8"));

    // Process each test case
    const results = [testCase1, testCase2].map((testCase) => {
      const { n, k } = testCase.keys;
      const points = [];

      // Parse and decode points
      Object.entries(testCase)
        .filter(([key]) => !isNaN(key)) // Filter numeric keys (x values)
        .forEach(([x, { base, value }]) => {
          points.push({ x: parseInt(x), y: decodeBase(parseInt(base), value) });
        });

      // Sort points by x and pick the first k points
      points.sort((a, b) => a.x - b.x);
      const selectedPoints = points.slice(0, k);

      // Calculate the constant term c
      return lagrangeInterpolation(selectedPoints, k);
    });

    res.json({
      "Test Case 1": results[0],
      "Test Case 2": results[1],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing test cases.");
  }
});

// Start the server
app.listen(PORT);