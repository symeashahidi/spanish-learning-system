/*
Group 6 DML.sql file
Group members: Sycamore Dennis and Syme Shahidi
*/

-- START OF VOCABTERMS PAGE

-- Select for VocabTerms table

SELECT * FROM VocabTerms;

-- Insert in VocabTerms table

INSERT INTO VocabTerms (vocabTerm, partOfSpeech, gender)
VALUES (:vocabTermEntry, :partsOfSpeechEntry, :genderEntry);

-- END OF VOCABTERMS PAGE

-- START OF DEFINITIONS PAGE

-- Select VocabTerm from dropdown 
-- This statement is also used in forms on the sentences page and practicelists page
SELECT vocabTermID, vocabTerm FROM VocabTerms;

-- Select for Definitions Table

SELECT definitionID, VocabTerms.vocabTerm, definition FROM Definitions
INNER JOIN VocabTerms ON VocabTerms.vocabTermID = Definitions.vocabTermID;

-- Insert Definition

INSERT INTO Definitions(vocabTermID, definition)
VALUES (:vocabTermDropDownEntry, :definitionEntry);

-- END OF DEFINITIONS PAGE

-- START OF EXAMPLESENTENCES PAGE

-- Select definition from dropdown 
SELECT definitionID, definition, vocabTerm FROM Definitions INNER JOIN VocabTerms ON VocabTerms.vocabTermID = Definitions.vocabTermID;

-- Select for Example Sentences Table

SELECT exampleSentenceID, Definitions.definition, exampleSentence FROM ExampleSentences
INNER JOIN Definitions ON Definitions.definitionID = ExampleSentences.definitionID;

-- Insert Example Sentence

INSERT INTO ExampleSentences(definitionID, exampleSentence)
VALUES (:definitionDropDownEntry, :exampleSentenceEntry);

-- END OF EXAMPLESENTENCES PAGE

-- START OF LEARNERS PAGE
-- Select for Learners table

SELECT * FROM Learners;

-- Insert in Learners table 

INSERT INTO Learners (username, email)
VALUES (:usernameEntry, :emailEntry);

-- END OF LEARNERS PAGE

-- START OF PRACTICELISTS PAGE
-- Select for Practice list details table

SELECT PracticeLists.practiceListID, Learners.username, PracticeLists.listName, PracticeLists.listLength FROM PracticeLists
LEFT JOIN Learners ON Learners.learnerID = PracticeLists.learnerID;

-- Select for Practice list contents table

SELECT ListHasTerms.listHasTermsID, PracticeLists.listName, VocabTerms.vocabTerm FROM ListHasTerms
INNER JOIN PracticeLists ON PracticeLists.practiceListID = ListHasTerms.practiceListID
INNER JOIN VocabTerms ON VocabTerms.vocabTermID = ListHasTerms.vocabTermID;

-- Select Username dropdown for the Insert PracticeLists form 
SELECT learnerID, username FROM Learners;

-- Insert in Practice list details table

INSERT INTO PracticeLists (learnerID, listName)
VALUES (:learnerDropDownEntry, :listNameEntry);

-- Select list dropdown for the Update Practice list details and Insert Practice list content forms

SELECT practiceListID, listName FROM PracticeLists;

-- Insert in Practice list contents table

INSERT INTO ListHasTerms (practiceListID, vocabTermID)
Values (:listDropDownEntry, :vocabTermDropDownEntry);

-- Update for Practice list details table

UPDATE PracticeLists
SET listName = :listNameEntry
WHERE practiceListID = :rowSelectedFromTable;

-- Select for anonymized dropdown 
SELECT practiceListID, listName FROM PracticeLists WHERE learnerID is not NULL

-- Update to anonymize learner for Practice list details table

UPDATE PracticeLists
SET learnerID = NULL
WHERE practiceListID = :rowSelectedFromTable

-- Delete row from Practice list details table

DELETE FROM PracticeLists 
WHERE practiceListID = :rowSelectedFromTable;

DELETE FROM ListHasTerms
WHERE practiceListID = :rowSelectedFromTable;

-- Delete row from Practice list content table

DELETE FROM ListHasTerms 
WHERE listHasTermsID = :rowSelectedFromTable;

-- END OF PRACTICELISTS PAGE
