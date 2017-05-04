# Deckbox
Card game database University Node.js project.
The requirement of project was to build an application utilizing Node.js.
For my project I have create an application which acts as a database and discussion forum for the digital card game, Hearthstone.
I chose this as my target for the project as it provided me with a suitable challenge that matched the requirements of the project.


My initial Idea was to create a service that made it easier to learn about Hearthsone as a game for newer players. To allow experienced players to share
their knowledge on a platform for everyone.


I was required to utilize a database being able to Create, Read, Update and Remove from it. For this I have used MongoDB as it is well supported in Node.js.


Project dependencies are in the package.json.
The build is missing the .env and config.js files which the user is required to create themselves.
Examples of how the files are required to be structured are below.

### .env
```
   mashape= 'insert personal API key here'
   mongoDB= mongodb://'username here':'user password'@'Database URL'/'Collection Extension'
```

### config.js
```
   module.exports = {
       'mongodbHost' : mongodb://'username here':'user password'@'Database URL'/'Collection Extension'
   };
```

I have hosted the application on a Jelastic cloud server, which is provided to me by Metropolia University.

[Deckbox Jelastic](http://oliver-sssf.jelastic.metropolia.fi/)

## Deployment

After pulling the project, you will be required to install the dependencies of the application.
To install and deploy the application locally it is required to use the following npm commands:


```
    npm install
```

```
    node server.js
```



## Hearthstone API
For this project I have used an API which provides me with all the card data I require to be able to display the values in my application.

[Link to Hearthstone API](http://hearthstoneapi.com/)


## Conclusion
With only 3 weeks to conceptualize and implement this project, I feel I have achieved my goals. I have learnt all the technologies I have used from scratch and it
has been a challenge to do so. With more time, I would have liked to improve the UI of the application as well as extend the functionality of it.


I had hoped to be able to implement a way for the application to parse each post the users make and link the Hearthstone cards to corresponding text. Then have the image
be displayed when a reader hovers over the highlighted text in the user's post. I see that there is a use for this type of application to be applied to all sorts of games,
as there are a lot of different things for the players to remember in the modern games and a service like this would allow for a greater understanding of the game when a player
wishes to start a discussion or share their knowledge.


