/**
 * Created by iosdev on 27.4.2017.
 */
'use strict';

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
           console.log(JSON.stringify(response));
        });
};
