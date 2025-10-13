// Debug script to test authentication
const jwt = require("jsonwebtoken");

// Test token verification
const testToken = (token) => {
  try {
    const decoded = jwt.verify(token, "Guru_Resource", { ignoreExpiration: true });
    console.log("Token decoded successfully:");
    console.log("- User ID:", decoded.userId);
    console.log("- Expiry:", new Date(decoded.exp * 1000));
    console.log("- Is Expired:", Date.now() > decoded.exp * 1000);
    return decoded;
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return null;
  }
};

// Test with a sample token (replace with actual token from frontend)
const sampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVkYjQ4YzQ0YzQ0YzQ0YzQ0YzQ0YzQiLCJpYXQiOjE3MzQ5NjQ4MDAsImV4cCI6MTczNDk2ODQwMH0.example";

console.log("Testing token verification...");
testToken(sampleToken);

console.log("\nTo test with your actual token:");
console.log("1. Open browser console on frontend");
console.log("2. Run: localStorage.getItem('token')");
console.log("3. Copy the token and replace 'sampleToken' in this script");
console.log("4. Run: node debug-auth.js");


