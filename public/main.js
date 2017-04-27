/**
 * Created by iosdev on 29.3.2017.
 */
'use strict';
let dataArray = [];
let cardNameArray = [];

const postText = document.getElementById('forumPost');

const myRequest = new Request('data.json', {
    headers: new Headers({
        'Content-Type': 'text/json'
    })
});

// Fetch request from the data.json file
fetch(myRequest).then((response) => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('Network response was not ok.');
}).then((response) => {
    dataArray = response;
    searchFunction();
    populateNameArray();
}).catch(function (error) {
    console.log('Problem: ' + error.message);
});

// Search through all Cards
const searchFunction = (search) => {
    let allArrays = Object.values(dataArray[0]);
    for (let expansionArray of allArrays) {
        for (let item of expansionArray) {
            // Checks the name & type of the card, this makes sure that only correct card Images are returned.
            if (item.name == search && (item.type == 'Minion' || item.type == 'Enhancement' || item.type == 'Spell')) {
                document.getElementById('card').src = item.img;
            }
        }
    }
};

// Populates the list of Names to be used for Auto-complete
const populateNameArray = () => {
    let allArrays = Object.values(dataArray[0]);
    for (let expansionArray of allArrays) {
        for (let item of expansionArray) {
            if (item.type == 'Minion' || item.type == 'Enhancement' || item.type == 'Spell') {
                cardNameArray.push(item.name);
            }
        }
    }
    console.log('Card Names: ' + cardNameArray);
    // Awesomplete library used for Auto-complete search function
    new Awesomplete(document.getElementById('search'), {list: cardNameArray});
    new Awesomplete(postText, {list: cardNameArray});
};

document.getElementById('submitSearch').addEventListener('click', () => {
    searchFunction(document.getElementById('search').value);
});

postText.addEventListener('input', () => {
    // Get last typed character
    const lastChar = postText.value.substr(postText.value.length - 1);

    if (lastChar == '[') {
        // Implement Search functionality Here
    }

    if (lastChar == ']') {
        // End Search functionality
        console.log('Search Ended');
    }
});