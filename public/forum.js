/**
 * Created by iosdev on 27.4.2017.
 */
'use strict';

let postData = [];

document.querySelector('#postForm').addEventListener('submit', (evt) => {
    evt.preventDefault();

    let obj = {
        title: document.querySelector('#title').value,
        postText: document.querySelector('#postText').value,
    };

    createCard(obj);

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
    });


});

const getData = () => {
    fetch('/posts')
        .then(response => {
            return response.json();
        })
        .then(response => {
           postData = response.post;

           console.log('GET DATA');
            console.log(postData);
            populatePage(postData);
        });

};

const deletePost = (postID) => {
    fetch('/deletePost', {
        method: 'delete',
        headers: {
            'Content-Type' :  'application/json'
        },
        body: JSON.stringify({
            postId: postID
        })
    }).then(response => {
        if(response.status){
            window.location.reload();
        }
    })
};

const editPost = (postID, postTitle, postText) => {
    console.log('CLIENT POST ID');
    console.log(postID);
    fetch('/editPost', {
        method: 'post',
        headers: {
            'Content-Type' :  'application/json'
        },
        body: JSON.stringify({
            postId: postID,
            newPost: {
                title: postTitle,
                postText: postText
            }
        })
    }).then(response => {
        if(response.status) {
            window.location.reload();
        }
    })
};

const createCard = (post, integerID) => {
    let html = `<div class="forumPostBox">
                    <div class="forumPostTitleBox">
                    <h3>` + post.title + `</h3>
                    </div>
                    <br>
                    <p>` + post.postText + `</p>
                    <p hidden id="hiddenID">` + post._id + `</p>
                    <button data-toggle="collapse" href="#editSection` + integerID +`"> Edit</button>
                    <div class="collapse" id="editSection`+ integerID +`">
                    <form>
                        <div class="form-group">
                            <br>
                            <input id="titleText`+ integerID +`" type="text" class="form-control"
                                   value="` + post.title +`" required>
                        </div>
                        <div class="form-group">
                            <br>
                            <textarea id="editText`+ integerID + `" rows="4" cols="50" required>`+ post.postText +`</textarea>
                        </div>
                        <Button onclick="savePost('` + post._id + `',` + integerID + `)" value="Save">Save</Button>
                        <Button onclick="deletePost('`+ post._id +`')">Delete</Button>
                    </form>
                    </div>
                    </div>`;

    document.getElementById('forumPosts').innerHTML += html;
};

const savePost = (postID, integerID) => {
    let postTitle = document.getElementById('titleText' + integerID).value;
    let postText = document.getElementById('editText' + integerID).value;

    editPost(postID, postTitle, postText);
};


const populatePage = (data) => {
    let IntegerID = 0;
    console.log(data.length);
    for (let i of data) {
        console.log('Loop: ' + IntegerID);
        createCard(i, IntegerID);
        IntegerID++;
    }
};

getData();
