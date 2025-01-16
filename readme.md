# Shamir's Secret Sharing (Simplified)

This project implements a simplified version of Shamir's Secret Sharing algorithm. It uses Lagrange Interpolation to calculate the constant term of a polynomial given some encoded roots.

## Overview

The goal of this project is to:
1. Decode values of the roots (given in different bases).
2. Use Lagrange Interpolation to calculate the constant term of the polynomial.

## How It Works

### Step 1: Decode the Roots
- Each root is given in a base (like binary, hexadecimal, etc.).
- The root is decoded from that base into a decimal number.

### Step 2: Use Lagrange Interpolation
- Lagrange Interpolation is used to calculate the constant term of the polynomial.
- We use the decoded roots to find the value of `c` (the constant term) for the polynomial.

### Step 3: Display the Results
- The results are displayed for multiple test cases when you visit the `/calculate` endpoint.

## How to Run

### 1. Clone the Repository

```bash
git clone <repository_url>
