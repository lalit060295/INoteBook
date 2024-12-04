const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_TOKEN = "Laliteshcode";
var fetchuser = require('./middleware/fetchuser')

//Route 1 : create a user using using POST: 'api/auth/createuser' . no login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //check whether user with this email already exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry email with same user already exists" });
      }

      const salt = await bcryptjs.genSalt(10);
      const secPass = await bcryptjs.hash(req.body.password,salt);

      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data ={
        user:{
          id:user.id
        }
      }
      const authToken = jwt.sign(data, JWT_TOKEN);
      success = true;
      res.json({success,authToken});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);


//Route 2 :  create a user using using POST: 'api/auth/login' . no login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
     // if there are errors return bad request
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const {email, password} = req.body;
     try{
      let user = await User.findOne({email});
      if(!user){
        success = false;
        return res.status(400).json({error:"Please try to enter correct credentials"});
      }

      const compPassword = await bcryptjs.compare(password, user.password);
      if(!compPassword){
        success = false;
        return res.status(400).json({success,error:"Please try to enter correct credentials"});
      }

      const data ={
        user:{
          id:user.id
        }
      }
      const authToken = jwt.sign(data, JWT_TOKEN);
      success = true;
      res.json({success,authToken});


     }catch(error){
      console.error(error.message);
      res.status(500).send("Internal server error occurred");
     }
  }
)

//Route 2 :  create a user using using POST: 'api/auth/getLoggedInUser' . login required
router.post("/getLoggedInUser",fetchuser , async (req, res) => {
    try {
      userID = req.user.id;
      const user = await User.findById(userID).select("-password");
      res.send(user);
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occurred");
    }
  })

module.exports = router;
