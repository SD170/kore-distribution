# Kore Distriution System

## _Description_

A simple Distriution System made using node/express/mongo. Can schedule a order with appropiate fields. Used Swagger for route/endpoint definitions Used TypeScript as the dev language [code is in `./src`], for `js` implementation look for `./dist` folder.

## Live at [heroku](https://kore-milk-distro.herokuapp.com/)

## Installation

#### 1) Clone the repository:
    git clone https://github.com/SD170/kore-distribution
#### 2) Install all the dependencies:
On the project root folder, run:
    
    npm install
#### 3) Start the MongoDB in your os:
Run MongoDB as a service, and make sure to know the port no (27017 by default).
For Ubuntu (in my case) to start MongoDB as a service run the following commands in a terminal:
```
sudo service mongod start
```
after that:
```
mongosh
```
this will start the service. So, let it keep running.

#### 4) Add a config.env file:
We have used MongoDB as our database. So, in order to connect to the local database, we'll need 3 values, and we've kept it in **config.env** in tha path-  **/config**:
    
- Create a file named **config.env** inside the folder, **/config**.
- Add 3 env variables eg:
    ```
    MONGOHOST=localhost
    MONGOPORT=27017
    MONGOUSER=<Your user>
    MONGOPASSWORD=<Your pass>
    DATABASENAME=<Your DB name>
    ```
#### 5) Start the project:
From the root folder, start the project by running:
   
    npm start
    
## Features and endpoints

Can be found in root `"/"` route. 
****

## Tech Stack

Our schedule management system backend has the following tech stack.

- [node.js](https://nodejs.org/en/) - For backend runtime.
- [Express.js](https://expressjs.com) - For easily creating the REST API.
- [MongoDB](https://www.mongodb.com) - As the Database. **mongoose** for object modeling in node.
- [TypeScript](https://www.typescriptlang.org/) - As the dev language.
- [Git](https://git-scm.com) - For source control.

## Miscellaneous
##### -> Live at [heroku](https://kore-milk-distro.herokuapp.com/)

****

#### Thanks for checking it out. Have a great day.