const express = require("express");
const router = express.Router();
var fetchuser = require('./middleware/fetchuser');
const { body, validationResult } = require("express-validator");
const Notes = require("../models/Notes");

//Route 1 : fetch notes of user Get: 'api/notes/fetchnotes'. no login required
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
});
  
//Route 2 : Add notes of user Get: 'api/notes/addNotes' .  login required
router.post(
  "/addNotes",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      console.log(req);
      // if there are errors return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savenotes = await notes.save();
      res.json(savenotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occurred");
    }
  }
);


//Route 2 : Update notes of user Get: 'api/notes/updateNotes:id' .  login required
router.put("/updateNotes/:id",fetchuser,async (req, res) => {
      try {
        const { title, description, tag } = req.body;
        const newNotes = {};

        if(title){newNotes.title = title};
        if(description){newNotes.description = description};
        if(tag){newNotes.tag = tag};

        //Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);

        if(!note){
            return res.status(404).send("Not found");
        }

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNotes},{new:true})
        res.json(note);

      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
      }
    }
  );


  //Route 3 : delete notes of user Get: 'api/notes/deleteNotes:id' .  login required
router.delete("/deleteNotes/:id",fetchuser,async (req, res) => {
    try {
      const { title, description, tag } = req.body;
     
      //Find the note to be updated and update it
      let note = await Notes.findById(req.params.id);

      if(!note){
          return res.status(404).send("Not found");
      }

      if(note.user.toString() !== req.user.id){
          return res.status(401).send("Not allowed");
      }

      note = await Notes.findByIdAndDelete(req.params.id);
      res.json({"Success":"Note has been deleted" , note:note});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occurred");
    }
  }
);

module.exports = router;
