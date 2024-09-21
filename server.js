const fs = require('fs');
const express = require('express');
const path = require('path');
const uuid = require('uuid');
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, 'db', 'db.json')));
app.post('/api/notes', (req, res) => {
    const newNote = {
        id: uuid.v4(),
        title: req.body.title,
        text: req.body.text
    };
    const notes = fs.readFileSync('./db/db.json');
    const parsedNotes = JSON.parse(notes);
    parsedNotes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(parsedNotes))
    res.json(newNote);
})
app.delete('/api/notes/:id', (req, res) => {
    const notes = fs.readFileSync('./db/db.json');
    const parsedNotes = JSON.parse(notes);
    const found = parsedNotes.some(note => note.id === parseInt(req.params.id));
    if(found){
       res.json({mssg:'Note deleted', Notes: parsedNotes.filter(note => note.id !== parseInt(req.params.id))}) 
    }else{
        res.status(400).json({mssg: `there is no note by the ID ${req.params.id}`});
    }
})
app.listen(PORT, () => {
    console.log(`This server is listening on port ${PORT}`)
})