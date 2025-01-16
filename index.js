const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Helper: Decode y value from a given base
function decodeBase(base, value) {
  return parseInt(value, base); // Convert the value from base to base 10
}

// Helper: Lagrange Interpolation to calculate constant term c
function lagrangeInterpolation(points, k) {
  let constantTerm = 0;

  // Loop through each point to calculate Lagrange interpolation
  for (let i = 0; i < k; i++) {
    let xi = points[i].x;
    let yi = points[i].y;
    let li = 1;

    // Calculate L_i(0) (Lagrange basis polynomial)
    for (let j = 0; j < k; j++) {
      if (i !== j) {
        li *= -points[j].x / (xi - points[j].x);
      }
    }

    // Add the value of L_i(0) to the constant term
    constantTerm += yi * li;
  }

  return Math.round(constantTerm); // Round the result to nearest integer
}

// Endpoint to process JSON files and calculate constant term
app.get("/calculate", async (req, res) => {
  try {
    // Read the JSON test case files
    const testCase1 = JSON.parse(fs.readFileSync("testcase1.json", "utf8"));
    const testCase2 = JSON.parse(fs.readFileSync("testcase2.json", "utf8"));

    // Process each test case
    const results = [testCase1, testCase2].map((testCase) => {
      const { n, k } = testCase.keys;
      const points = [];

      // Convert the points (x, y) by decoding the base values
      Object.entries(testCase)
        .filter(([key]) => !isNaN(key)) // Only keep numeric keys
        .forEach(([x, { base, value }]) => {
          points.push({ x: parseInt(x), y: decodeBase(parseInt(base), value) });
        });

      // Sort the points by x value and select the first k points
      points.sort((a, b) => a.x - b.x);
      const selectedPoints = points.slice(0, k);

      // Calculate the constant term c using Lagrange interpolation
      return lagrangeInterpolation(selectedPoints, k);
    });

    // Send the results back as JSON
    res.json({
      "Test Case 1": results[0],
      "Test Case 2": results[1],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing test cases.");
  }
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
