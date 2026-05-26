const express = require("express");
const router = express.Router();
const Signup = require("../model/Signup"); 
const passport = require("passport");

// GET: Render signup page
router.get("/signup", (req, res) => {
  
  const signupSuccess = req.query.success === "true";
  
  res.render("signup", { 
    signupSuccess: signupSuccess 
  });
});

// POST: Process signup form
router.post("/signup", async (req, res) => {
  const { fullname, email, phone, password } = req.body;
  
  try {
    const newUser = new Signup({ fullname, email, phone });

    await Signup.register(newUser, password);

    // SUCCESS: Redirects back to signup with the flag pinned to the end
    return res.redirect("/signup?success=true");

  } catch (error) {
    console.error("Signup Processing Error:", error);
    return res.render("signup", { 
      errorMessage: error.message || "Registration failed. Please try again.",
      signupSuccess: false 
    });
  }
});

// GET: Render login page
router.get("/login", (req, res) => {
  // If they are already logged in, skip the login screen and go to the dashboard
  if (req.isAuthenticated()) {
    return res.redirect("/afterlogin");
  }
  res.render("login"); // Renders your login view (pug/html)
});

// POST: Handle login authentication form submission
router.post("/login", passport.authenticate("local", {
  successRedirect: "/afterlogin", // If password matches, go here
  failureRedirect: "/login",      // If it fails, kick them back to log in again
}));

// GET: Protected dashboard page
router.get("/afterlogin", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("afterlogin"); // Renders your inventory dashboard page
  } else {
    res.redirect("/login"); // If not logged in, they must log in first
  }
});

module.exports = router;