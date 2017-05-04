# Deckbox
Card game database University Node.js project.
The requirement of project was to build an application utilizing Node.js.
For my project I have create an application which acts as a database and discussion forum for the digital card game, Hearthstone.
I chose this as my target for the project as it provided me with a suitable challenge that matched the requirements of the project.


I was required to utilize a database being able to Create, Read, Update and Remove from it. For this I have used MongoDB as it is well supported in Node.js.


Project dependencies in package.json.
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

To deploy the application locally it is required to use the following npm command:

```
    node server.js
```



## Hearthstone API
For this project I have used an API which provides me with all the card data I require to be able to display the values in my application.

[Link to Hearthstone API](http://hearthstoneapi.com/)