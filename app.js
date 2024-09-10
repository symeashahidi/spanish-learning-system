/*
Date retrieved: 14 Jan 2024
Description: Setup for web app 
Source: Code copied from CS340 Activity 2 instructions
Source URL: https://canvas.oregonstate.edu/courses/1946034/assignments/9456203

Date retrieved: 27 Feb 2024
Description: CRUD operations
Source: Code based on example code from nodejs-starter-app repo, Steps 3, 4, 5, 6, 7, 8
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/
*/

/*
    SETUP (from Activity 2—citation above)
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.urlencoded({extended: true}));
PORT        = 8284;                 // Set a port number at the top so it's easy to change in the future

// Code copied from Step 3 (see citation above)
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database 
var db = require('./database/db-connector')

// Set up public folder
app.use(express.static(__dirname + '/public'));  // Allows use of public folder (CSS, other files)

/*
    ROUTES
*/

// LEARNERS PAGE

// Display Learners table (based on example code from Step 3 and 6—see citation above)
app.get('/', function(req, res)
    {
        res.render('index');
    }); 

app.get('/learners', function(req, res)
    {
        let query1 = "SELECT * FROM Learners";
        db.pool.query(query1, function(error, rows, fields){
            res.render('learners', {data: rows});
        })
    }); 

// "Add learner" form (based on example code from Step 5—see citation above)
app.post('/add-learner-form', function(req, res) {
    // Capture incoming data and parse it back to a JS object:
    let data = req.body;

    query1 = `INSERT INTO Learners (username, email) VALUES ('${data['input-username']}', '${data['input-email']}')`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            // Log error to terminal:
            console.log(error);
            return res.sendStatus(400);
        }
        // Otherwise, reload page:
        res.redirect('/learners');
    })
});

// PRACTICELISTS PAGE

// Display tables (based on example code from Steps 3 & 4—see citation above)
app.get('/practicelists', function(req, res)
    {
    // SELECT Practice Lists table
    let query1 = "SELECT PracticeLists.practiceListID, Learners.username, PracticeLists.listName, PracticeLists.listLength FROM PracticeLists LEFT JOIN Learners ON Learners.learnerID = PracticeLists.learnerID";

    // SELECT Practice List contents table
    let query2 = "SELECT ListHasTerms.listHasTermsID, PracticeLists.listName, VocabTerms.vocabTerm FROM ListHasTerms INNER JOIN PracticeLists ON PracticeLists.practiceListID = ListHasTerms.practiceListID INNER JOIN VocabTerms ON VocabTerms.vocabTermID = ListHasTerms.vocabTermID";

    // SELECT for learners dropdown
    let query3 = "SELECT learnerID, username FROM Learners";

    // SELECT for list dropdown
    let query4 = "SELECT practiceListID, listName FROM PracticeLists";

    // SELECT for vocabterms dropdown
    let query5 = "SELECT vocabTermID, vocabTerm FROM VocabTerms";

    // SELECT for anonymized dropdown
    let query6 = "SELECT practiceListID, listName FROM PracticeLists WHERE learnerID is not NULL";
       
    db.pool.query(query1, function(error, rows, fields){
        let practicelist = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let contents = rows;

            db.pool.query(query3, (error, rows, fields) =>{
                let learners = rows; // Save the learners
                    
                db.pool.query(query4, (error, rows, fields) => {
                    let practicelists = rows; // Save the practice lists
                        
                    db.pool.query(query5, (error, rows, fields) => {
                        let vocabterms = rows; // Save the practice lists
                            
                        db.pool.query(query6, (error, rows, fields) => {
                            let authoredlists = rows; // Save the practice lists
                                
                            return res.render('practicelists', {data: practicelist, contentsdata: contents, learners: learners, practicelists: practicelists, vocabterms: vocabterms, authoredlists: authoredlists});
                        })
                    })
                })
            })
        })
    })
}); 

// "Add practice list" form (based on example code from Step 5—see citation above)
app.post('/add-practicelist-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let learnerinput = parseInt(data['input-learner']);
    if (isNaN(learnerinput))
    {
        learnerinput = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO PracticeLists (learnerID, listName) VALUES (${learnerinput}, '${data['input-listname']}')`;
    db.pool.query(query1, function(error){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to the practice lists page
        else
        {
        res.redirect('/practicelists');
        }
    })
});

// "Add list contents" form (based on example code from Step 5—see citation above)
app.post('/add-listcontents-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO ListHasTerms (practiceListID, vocabTermID) VALUES ('${data['input-practicelist']}', '${data['input-vocabterm']}')`;
    db.pool.query(query1, function(error){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to the practice lists page
        else
        {
            res.redirect('/practicelists');
        }
    })
});

// "Update list name" form (based on example code from Step 5—see citation above)
app.post('/update-practicelist-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `UPDATE PracticeLists SET listName = '${data['input-updated-listname']}' WHERE practiceListID = '${data['input-practicelist']}'`;
    db.pool.query(query1, function(error){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back the practice lists page
        else
        {
        res.redirect('/practicelists');
        }
    })
});

// "Anonymize a practice list" form (set Learner FK to NULL to remove the relationship)
// (Based on example code from Step 5—see citation above)
app.post('/anonymize-practicelist-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `UPDATE PracticeLists SET learnerID = NULL WHERE practiceListID = '${data['input-anon-practicelist']}'`;
    db.pool.query(query1, function(error){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back the practice lists page
        else
        {
            res.redirect('/practicelists');
        }
    })
});

// Delete practice list, including its contents (based on example code from Step 7—see citation above)
app.delete('/delete-practicelist-ajax/', function(req,res,next){
        let data = req.body;
        let practiceListID = parseInt(data.id);
        let deleteFromListHasTerms= `DELETE FROM ListHasTerms WHERE practiceListID = ?;`;
        let deleteFromPracticeLists = `DELETE FROM PracticeLists WHERE practiceListID = ?;`;
      
        // Run the 1st query
        db.pool.query(deleteFromListHasTerms, [practiceListID], function(error, rows, fields){
            if (error) {
      
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
      
            else
            {
                // Run the second query
                db.pool.query(deleteFromPracticeLists, [practiceListID], function(error, rows, fields) {
      
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

// Delete row of ListHasTerms intersection table (based on example code from Step 7—see citation above)
app.delete('/delete-listcontents-ajax/', function(req,res,next){
    let data = req.body;
    let practiceListID = parseInt(data.id);
    let deleteFromListHasTerms= `DELETE FROM ListHasTerms WHERE listHasTermsID = ?;`;
  
    // Run the 1st query
    db.pool.query(deleteFromListHasTerms, [practiceListID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
  
        else {
            res.sendStatus(204);
        }
    })
});

// VOCABTERMS PAGE 

// Display Vocab Terms table (based on example code from Step 3—see citation above)
app.get('/vocabterms', function(req, res)
{
    let query1 = "SELECT * FROM VocabTerms";
    db.pool.query(query1, function(error, rows, fields){
        res.render('vocabterms', {data: rows});
    })
}); 

// "Add vocab term" form (based on example code from Step 5—see citation above)
app.post('/add-vocabterm-form', function(req, res) {
    
    // Capture incoming data and parse it back to a JS object:
    let data = req.body;

    query1 = `INSERT INTO VocabTerms (vocabTerm, partOfSpeech, gender) VALUES ('${data['input-vocabterm']}', '${data['input-partofspeech']}', '${data['input-gender']}')`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            // Log error to terminal
            console.log(error);
            return res.sendStatus(400);
        }
        res.redirect('/vocabterms');
    })
});

// DEFINITIONS PAGE

// Display Definitions table (based on example code from Step 3—see citation above)
app.get('/definitions', function(req, res)
{
    // SELECT for table
    let query1 = "SELECT definitionID, VocabTerms.vocabTerm, definition FROM Definitions INNER JOIN VocabTerms ON VocabTerms.vocabTermID = Definitions.vocabTermID;";

    // SELECT for add form dropdown
    let query2 = "SELECT vocabTermID, vocabTerm FROM VocabTerms;";

    db.pool.query(query1, function(error, rows, fields){

        let definition = rows;

        db.pool.query(query2, (error, rows, fields) => {
        
            // Save the vocab terms
            let vocabterms = rows;

        res.render('definitions', {data: definition, vocabterms: vocabterms});
        })
    })
}); 

// "Add definition" form (based on example code from Step 5—see citation above)
app.post('/add-definition-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Definitions(vocabTermID, definition) VALUES ('${data['input-vocabterm']}', '${data['input-definition']}')`;
    db.pool.query(query1, function(error){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to the definitions page
        else
        {
        res.redirect('/definitions');
        }
    })
});

// EXAMPLESENTENCES PAGE

// Display Example Sentences table (based on example code from Step 3—see citation above)
app.get('/sentences', function(req, res)
{
    let query1 = "SELECT exampleSentenceID, Definitions.definition, exampleSentence FROM ExampleSentences INNER JOIN Definitions ON Definitions.definitionID = ExampleSentences.definitionID;";
    let query2 = "SELECT vocabTermID, vocabTerm FROM VocabTerms;";
    let query3 = "SELECT definitionID, definition, vocabTerm FROM Definitions INNER JOIN VocabTerms ON VocabTerms.vocabTermID = Definitions.vocabTermID"

    db.pool.query(query1, function(error, rows, fields){

        let sentence = rows;

        db.pool.query(query2, (error, rows, fields) => {
        
            // Save the vocab terms
            let vocabterms = rows;

            db.pool.query(query3, (error, rows, fields) => {
        
                // Save the vocab terms
                let definitions = rows;
                res.render('sentences', {data: sentence, vocabterms: vocabterms, definitions: definitions});
            })
        })
    })
}); 

// "Add example sentence" form (based on example code from Step 5—see citation above)
app.post('/add-sentence-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO ExampleSentences(definitionID, exampleSentence) VALUES ('${data['input-definitions']}', '${data['input-sentence']}')`;
    db.pool.query(query1, function(error){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to the sentences page
        else
        {
        res.redirect('/sentences');
        }
    })
});

/*
    LISTENER (from Activity 2—citation above)
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});