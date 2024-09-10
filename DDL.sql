/*
 Project Step 2 SQL file for Group 6
 Group members: Sycamore Dennis and Syme Shahidi
*/

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

/*
Creation of VocabTerms
*/

DROP TABLE IF EXISTS VocabTerms;

CREATE OR REPLACE TABLE VocabTerms (
    vocabTermID int unique AUTO_INCREMENT,
    vocabTerm varchar(255) NOT NULL,
    partOfSpeech varchar(255) NOT NULL,
    gender varchar(255),
    PRIMARY KEY (vocabTermID)
);

INSERT INTO VocabTerms (
    vocabTerm,
    partOfSpeech,
    gender
)

VALUES (
    'bailar',
    'verb',
    NULL
),
(
    'la mesa',
    'noun',
    'feminine'
),
(
    'el libro',
    'noun',
    'masculine'
),
(
    'la naranja',
    'noun',
    'feminine'
),
(
    'naranja',
    'adjective',
    NULL
),
(
    'escribir',
    'verb',
    NULL
);

/*
Creation of Definitions
*/

DROP TABLE IF EXISTS Definitions;

CREATE OR REPLACE TABLE Definitions (
    definitionID int unique AUTO_INCREMENT,
    vocabTermID int NOT NULL,
    definition varchar(255) NOT NULL,
    PRIMARY KEY (definitionID),
    FOREIGN KEY (vocabTermID) REFERENCES VocabTerms(vocabTermID) ON DELETE CASCADE
);

INSERT INTO Definitions(
    vocabTermID,
    definition
)

VALUES (
    1,
    'to dance'
),
(
    2,
    'table'
),
(
    2,
    'plateau'
),
(
    3,
    'book'
),
(
    4,
    'orange (fruit)'
),
(
    5,
    'orange-colored'
),
(
    6,
    'to write'
);

/*
Creation of ExampleSentences
*/

DROP TABLE IF EXISTS ExampleSentences;

CREATE OR REPLACE TABLE ExampleSentences (
    exampleSentenceID int unique AUTO_INCREMENT,
    definitionID int NOT NULL,
    exampleSentence varchar(255) NOT NULL,
    PRIMARY KEY (exampleSentenceID),
    FOREIGN KEY (definitionID) REFERENCES Definitions(definitionID) ON DELETE CASCADE
);

INSERT INTO ExampleSentences (
    definitionID,
    exampleSentence
)

VALUES (
    1,
    'Le encanta bailar al son de todos los ritmos afroantillanos.'
),
(
    2,
    'La mesa y las sillas de mi comedor son de cedro.'
),
(
    3,
    'La altiplanicie mexicana se divide en: altiplanicie septentrional y mesa del centro.'
),
(
    1,
    'Yo quiero bailar toda la noche.'
);

/*
Creation of Learners
*/

DROP TABLE IF EXISTS Learners;

CREATE OR REPLACE TABLE Learners (
    learnerID int unique AUTO_INCREMENT,
    username varchar(255) unique NOT NULL,
    email varchar(255) unique NOT NULL,
    PRIMARY KEY (learnerID)
);

INSERT INTO Learners (
    username,
    email
)

VALUES (
    'hannah12',
    'hannah12@gmail.com'
),
(
    'maxsmith',
    'maxsmith@gmail.com'
),
(
    'tyler31',
    'ty31@yahoo.com'
),
(
    'harrypotter',
    'hpotter@gmail.com'
),
(
    'hermione62',
    'hermione62@outlook.com'
);

/*
Creation of PracticeLists
*/

DROP TABLE IF EXISTS PracticeLists;

CREATE OR REPLACE TABLE PracticeLists (
    practiceListID int unique AUTO_INCREMENT,
    learnerID int,
    listName varchar(255) NOT NULL,
    listLength int NOT NULL DEFAULT 0,
    PRIMARY KEY (practiceListID),
    FOREIGN KEY (learnerID) REFERENCES Learners(learnerID) ON DELETE CASCADE
);

INSERT INTO PracticeLists (
    learnerID,
    listName
)

VALUES (
    5,
    'Books'
),
(
    3,
    'Verbos'
),
(
    5,
    'Spanish 1 practice list'
),
(
    2,
    'Quiz review list'
);

/*
Creation of ListHasTerms
*/

DROP TABLE IF EXISTS ListHasTerms;

CREATE OR REPLACE TABLE ListHasTerms (
    listHasTermsID int unique AUTO_INCREMENT,
    practiceListID int NOT NULL,
    vocabTermID int NOT NULL,
    PRIMARY KEY (listHasTermsID),
    FOREIGN KEY (practiceListID) REFERENCES PracticeLists(practiceListID) ON DELETE CASCADE,
    FOREIGN KEY (vocabTermID) REFERENCES VocabTerms(vocabTermID) ON DELETE CASCADE,
    CONSTRAINT UniqueTerms UNIQUE (practiceListID, vocabTermID)
);

/*
Triggers to update PracticeList length attribute when terms are added/removed
Based on information from SQL Tutorial: SQL Triggers accessed 3/6/24 from https://www.sqltutorial.org/sql-triggers/
*/

DELIMITER //
CREATE OR REPLACE TRIGGER adjust_list_length_add AFTER INSERT
ON ListHasTerms FOR EACH ROW
BEGIN
UPDATE PracticeLists
SET PracticeLists.listLength = (SELECT COUNT(*) FROM ListHasTerms WHERE practiceListID = PracticeLists.practiceListID)
WHERE PracticeLists.practiceListID = NEW.practiceListID;
END //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER adjust_list_length_delete AFTER DELETE
ON ListHasTerms FOR EACH ROW
BEGIN
UPDATE PracticeLists
SET PracticeLists.listLength = (SELECT COUNT(*) FROM ListHasTerms WHERE practiceListID = PracticeLists.practiceListID)
WHERE PracticeLists.practiceListID = OLD.practiceListID;
END //
DELIMITER ;

INSERT INTO ListHasTerms (
    practiceListID,
    vocabTermID
)

VALUES (
    1,
    3
),
(
    1,
    6
),
(
    2,
    1
),
(
    2,
    6
),
(
    3,
    1
),
(
    3,
    2
),
(
    3,
    3
);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;