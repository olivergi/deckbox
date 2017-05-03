/**
 * Created by iosdev on 27.4.2017.
 */
'use strict';

let postData = [];

document.querySelector('#postForm').addEventListener('submit', (evt) => {
    evt.preventDefault();

    let obj = {
        title: document.querySelector('#title').value,
        postText: document.querySelector('#postText').value
    };

    console.log('Body Object: ' + JSON.stringify(obj));

    const url = '/post';

    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type' :  'application/json'
        },
        body: JSON.stringify(obj)
    }).then((resp)=> {
        console.log(resp);
        getData();
    });


});

const getData = () => {
    fetch('/posts')
        .then(response => {
            return response.json();
        })
        .then(response => {
           //console.log(JSON.stringify(response));
           postData = response.post;

           console.log('GET DATA');
            console.log(postData);
            populatePage(postData);
        });

};


const populatePage = (data) => {
    console.log(data.length);
    for (let i of data) {
        console.log('Loop');
        let html = `<div>
                    <h3>` + i.title + `</h3>
                    <br>
                    <p>` + i.postText + `</p>
                    </div>`;

        document.getElementById('forumPosts').innerHTML += html;
    }
};

getData();
