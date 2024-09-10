/*
Date retrieved: 29 Feb 2024
Description: Supports delete functionality for PracticeLists entity
Source: Based on example from nodejs-starter-app repo, Step 7
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/
*/

function deletePracticeList(practiceListID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: practiceListID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-practicelist-ajax/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(practiceListID);
            // Refreshes the page after deletion
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(practiceListID){

    let table = document.getElementById("practicelist-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == practiceListID) {
            table.deleteRow(i);
            break;
       }
    }
}