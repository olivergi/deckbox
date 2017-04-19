/**
 * Created by iosdev on 29.3.2017.
 */
'use strict';
let dataArray = [];
let cardNameArray = [];

const myRequest = new Request('data.json',{
    headers: new Headers({
        'Content-Type': 'text/json'
    })
});

// Fetch function
fetch(myRequest).then((response) => {
    if(response.ok) {
        return response.json();
    }
    throw new Error('Network response was not ok.');
}).then((response) => {
    dataArray = response;
    searchFunction('Majordomo Executus');
    populateNameArray();
}).catch(function(error) {
    console.log('Problem: ' + error.message);
});

const searchFunction = (search) => {
    let allArrays = Object.values(dataArray[0]);
    console.log(allArrays);
    for (let expansionArray of allArrays) {
        for (let item of expansionArray) {
            if (item.name.includes(search)) {
                document.getElementById('card').src = item.img;
            }
        }
    }
};

const populateNameArray = () => {
    let allArrays = Object.values(dataArray[0]);
    console.log(allArrays);
    for (let expansionArray of allArrays) {
        for (let item of expansionArray) {
            cardNameArray.push(item.name);
        }
    }
    console.log('Card Names: ' + cardNameArray);
    new Awesomplete(document.getElementById('search'), { list: cardNameArray });
};

document.getElementById('submitSearch').addEventListener('click', () => {
    searchFunction(document.getElementById('search').value);
});


