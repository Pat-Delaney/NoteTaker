const express = require('express');
const router = express.Router();
var uniqid = require('uniqid'); 
const fs = require('fs');
const util = require('util');
const readFromFile = util.promisify(fs.readFile);
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

router.use(express.json())


router.get("/notes", (req, res)=>{
    console.info(`${req.method} request to get Notes`);

  readFromFile('../db/db.json').then((data) => res.json(JSON.parse(data)));
});

router.post("/notes",(req,res)=>{
    console.info(`${req.method} request to create new note`);
    console.log(req.body);
    const { title, text } = req.body;

    if (req.body) {
      const newNote = {
        title,
        text,
        id: uniqid(),
      };
  
      readAndAppend(newNote, '../db/db.json');
      res.json(`Note added with id ${newNote.id}`);
    } else {
      res.error('Error in adding note');
    }
})

module.exports = router