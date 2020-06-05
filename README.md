# Project Proposal: Eradicate The Vape
By Ashmann Syngle, Shray Arora and Sarah West

![EradicateTheVape](img/eradicatethevapelogo.jpg)

## Project Pitch
For our project, our target audience is people struggling with addictive substances, such as nicotine. 
Quitting nicotine is hard, especially when you lack support. Groups like Alcoholics Anonymous exist for people with alcoholism, but there aren’t very many groups for people addicted to nicotine products, such as vaping or smoking. There are also people who don’t know where to start with the whole process of quitting. Most addicts are unaware that there exist certain patterns or trends in their addiction behaviour. Our project aims to help nicotine addicts notice these patterns through the use of a 'sobriety clock' in order to prevent possible relapses. 

The 'sobriety clock' requires the user to clock-in everyday they don't use nicotine. For every day that they clock-in, the users are awarded some points which can be thought of as a 'currency' to our website's marketplace. The marketplace will include badges that the user can pin to their profile in a similar way to how people in Alcoholics Anonymous recieve badges for  milestones achieved in the quitting process.

Additionally, our platform will allow users struggling with nicotine addiction to connect with one another to exchange advice and offer support. It will be forum-based, with various threads that people can search for and respond to. Users can also create new threads about a variety of subjects regarding addiction. 

This site can serve as an alternative to reddit or facebook as it reduces the need to create “throwaway accounts” to have anonymity when discussing sensitive subjects. Furthermore, the progress and incentive features allows our site to be more engaged and focused on our user's goals and motivation, unlike the aforementioned cites.

## Technical Description
### Endpoints
#### Users
* /v1/users
    * **POST**: Create a new user
        * 201: User successfully created
        * 400: Status Bad Request (invalid user information sent by client)
        * 405: Status Method Not Allowed
        * 415: Unsupported Media Type
* /v1/users/**{userID}** _or_ **‘me’**
    * **GET**: Get a user
        * 200: User successfully retrieved
        * 401: Status Unauthorized
        * 404: User Not Found
        * 405: Status Method Not Allowed
    * **PATCH**: Update a user
        * 200: User successfully updated
        * 403: Status Forbidden
        * 405: Status Method Not Allowed
        * 415: Unsupported Media Type
#### The Marketplace
* v1/marketplace
    * **GET**: Gets all badges in the Marketplace
        * 200: Badges successfully retrieved
        * 401: Status Unauthorized
        * 405: Status Method Not Allowed
        * 500: Internal Server Error
* v1/marketplace/**{BadgeID/UserID}**
    * **GET**: Gets all badges for specific user
        * 200: Badges successfully retrieved
        * 400: Status Bad Request (invalid user id sent by client)
        * 401: Status Unauthorized
        * 405: Status Method Not Allowed
        * 500: Internal Server Error (if there is some error in the SQL scan)
    * **PATCH**: Updates current user with recently bought badge
        * 200: Item successfully added to user’s profile
        * 400: Status Bad Request (invalid badge id sent by client)
        * 401: Status Unauthorized
        * 405: Status Method Not Allowed
        * 500: Internal Server Error (if there is some error in the SQL scan)
    * **DELETE**: Delete the item from the users profile
        * 200: Item successfully deleted
        * 401: Status Unauthorized
        * 403: Status Forbidden
        * 405: Status Method Not Allowed
        * 500: Internal Server Error (if there is some error in the SQL scan)

#### The Threads Itself 
* /v1/threads
    * **GET**: Get most recent threads 
        * 200: Return list of the latest threads (if any)
        * 400: Status Bad Request (invalid badge id sent by client)
        * 401: Status Unauthorized
        * 500: Internal Server Error (if there is any error in SQL or encoding response)
    * **POST**: Creates a new thread
        * 201: Thread successfully created
        * 400: Status Bad Request (invalid thread creation request by client)
        * 401: Status Unauthorized
        * 500: Internal Server Error (if there is any error in encoding response)
* /v1/threads/**{ThreadID}**
    * **GET**: Thread with inputted thread ID
        * 200: Returns list of posts in chronological order that were made in that specific thread
        * 400: Status Bad Request (invalid user in header)
        * 401: Status Unauthorized
        * 500: Internal Server Error (if there is any error in encoding response)
    * **POST**: Adds newly submitted post to the end of the thread
        * 201: Post successfully created and added to end of thread
        * 400: Status Bad Request (invalid user in header)
        * 401: Status Unauthorized
        * 404: Thread for specific post not found
        * 500: Internal Server Error (if there is any error in encoding response)
    * **DELETE**: Deletes thread 
        * 200: Thread is successfully deleted
        * 400: Status Bad Request (invalid user in header)
        * 401: Status Unauthorized
        * 404: Thread to delete not found
        * 500: Internal Server Error (if there is any error in deleting the thread)
* /v1/posts/**{PostID}**
    * **PATCH**: User edits post in a thread
        * 200: Post successfully updated
        * 400: Status Bad Request (invalid user in header)
        * 401: Status Unauthorized (invalid user in header)
        * 404: Post to update not found
        * 415: Unsupported Media Type
        * 500: Internal Server Error (if there is any error in the SQL or encoding response)
    * **DELETE**: User deletes post in a thread
        * 200: Post successfully deleted
        * 400: Status Bad Request (invalid user in header)
        * 401: Status Unauthorized (invalid user in header)
        * 404: Post to delete not found
        * 415: Unsupported Media Type
        * 500: Internal Server Error (if there is any error in the SQL)

#### The Session Store (Redis) 
* /v1/sessions
    * **POST**: Begin a new session using an existing user's credentials.
        * 201: New session successfully created
        * 401: Status Unauthorized
        * 405: Status Method Not Allowed
        * 415: Unsupported Media Type
* /v1/sessions/mine
    * **DELETE**: Ends the current user’s session
        * 200: Session successfully ended
        * 403: Status Forbidden
        * 405: Status Method Not Allowed

#### The User Progress 
* /v1/progress
    * **GET**: Get progress of current user (also creates a progress tracker if first time logging in)
        * 200: Successully gets the progress information of current user
        * 400: Status Bad Request (invalid user in header)
        * 500: Internal Server Error (if there is any error in SQL insertion)
    * **PATCH**: Updates current user progress
        * 200: Successully updated the progress of current user
        * 400: Status Bad Request (invalid user in header or invalid request by client)
        * 500: Internal Server Error (if there is any error in SQL updating)
* /v1/progress/
    * **POST**: Updates points of current user (for threads and post creation)
        * 200: Successully updates the points of current user
        * 400: Status Bad Request (invalid user in header)
        * 401: Status Unauthorized
        * 405: Status Method Not Allowed
        * 500: Internal Server Error (if there is any error in SQL insertion)

### User Cases and Priority

|  Priority | User  | Description  | Technical Implementation  |
|---|---|---|---|
| P0  | Registered User  | I want to be able to create my own threads  | User will send a **POST request** to the /v1/threads endpoint, which will lead to the Threads microservice. This will insert a new row into the **Threads table of the database**. All the most recent threads, including this new one, can now be retreieved by sending   **GET request** to the same endpoint.  |
| P0  | Registered User  | I want to be able to make posts in other threads  | User will send a **POST request** to the /v1/threads/{threadID} endpoint, which will lead to the Threads microservice. This will then insert a row into the **Posts table of the database** with the respective threadID, which will symbolizes a new post to the thread that has that threadID.  |
| P0  | Registered User | I want to be able to view all threads  | User will send a **GET request** to /v1/threads endpoint, which will lead to the Threads microservice, which will return a list of all the threads (ordered by most recent). In order to get the user and badge information, the client code sends a **GET request** to /v1/users/{userID} which will retrive the user informtion for each creator of each thread. It will also send a **GET request** to /v1/marketplace/{userID} to get the badges for all the creators of the threads.|
| P0  | Registered User | I want to be able to view all posts in a thread  | User will send a **GET request** to /v1/threads/{threadID} endpoint, which will lead to the Threads microservice, which will return a list of all the posts in that thread. In order to get the user and badge information, the client code sends a **GET request** to /v1/users/{userID} which will retrive the user informtion for each creator of each post. It will also send a **GET request** to /v1/marketplace/{userID} to get the badges for all the creators of the posts.|
| P0  | Registered User  | I want to be able to buy Badges from the Marketplace  | User will send a **PATCH request** to the /v1/marketplace/{badgeID} endpoint, which will lead to the Marketplace microservice. This will then insert a row into the **Badges table of the database** with the respective badgeID and the current user ID, which will symbolizes a new badge on the user's profile. It will also update the current user's points after deducting for the specific badge bought. |
| P0  | Registered User  | I want to be able to log in my progress into the sobrierty clock (assuming user has done it once before) | On a new date from the last log, user will send a **PATCH request** to the /v1/progress endpoint, which will lead to the Progress microservice. This will then update the 'daysSober' field in the respective row of the **Progress table of the database** with the incremented days sober. It will also update the current user's points by adding 100 points for the new day logged. |
| P1  | Registered | I want to be able to view my Profile  | User will send a **GET request** to /v1/users/{userID} to find information about the current user. The client code also sends a **GET request** to /v1/marketplace/{userID} to get the badges for the user and show it on the Profile page |
| P1  | Registered | I want to be able to edit my Profile  | User will send a **PATCH request** to /v1/users/{userID} to update the information of the current user. |
| P1  | Registered User  | I want to keep track of my progress on my goal towards sobriety  | User will send a **GET request** to /v1/progress endpoint, which will lead to the Progress microservice. This will get the daysSober for that particular user. |
| P1  | Registered User  | I want to stay anonymous when making a thread/post  | User will send a **POST request** to the /v1/threads (or /v1/threads/{threadID}) endpoint, which will lead to the Threads microservice. This will insert a new row into the **Threads/Posts table of the database** with the 'anon' field set to true. |
| P1  | Registered User  | I want to be able to log in my progress into the sobrierty clock for the first time | User will send a **GET request** to the /v1/progress endpoint, which will lead to the Progress microservice. Since this is the first tine, the server will create a new row in the **Progress table of the database** with the days sober as 1. It will also update the current user's points by adding 100 points for the new day logged. |
| P2  | Unregistered User  | I want to sign up  | User would locate the sign-up page in the web client. Then, they would send a **POST request** to /v1/users endpoint, with their inputted information (email, password, etc.) to create their account. This will create a new row in the **Users table of the database** |
| P2  | Registered User  | I want to edit my posts  | User will send a **PATCH request** to the /v1/posts/{PostID} endpoint, which will lead to the Threads microservice. This will update the respective row in the **Posts table of the database** with the updated content. |
| P2  | Registered User  | As creator of one of the threads, I want to delete a post that I do not like  | User would send a **DELETE request** to /v1/posts/{postID} endpoint, which would lead to Post microservice. The server will check that they are the creator of the channel that post is a part of and delete the respective row from the **Posts table of the database** |
| P2  | Registered User  | I want to see all the badges in the marketplace  | User would send a **GET request** to /v1/marketplace endpoint, which will lead to the Marketplace microservice. This will return the list of all badges in the marketplace from the **Marketplace table of the database**  |
| P2  | Registered User  | I want to delete the post I made  | User would send a **DELETE request** to /v1/posts/{postID} endpoint, which would lead to Post microservice. This will delete the respective post from the **Posts table of the database** |
| P2  | Registered User  | I want to delete the thread I made  | User would send a **DELETE request** to /v1/threads/{threadID} endpoint, which would lead to Threads microservice. This will delete the respective thread from the **Threads table of the database**  |

### Architectural Diagram

![our architectural diagram](img/INFO_441_Architectual_Diagram.png)

When the user makes a request to our website, the gateway server first authenticates the user and verifies the session token provided against the redis store. Based on this request, the reverse proxy will redirect the request to either the ‘Threads’ microservice, the 'Marketplace' microservice or the ‘Progress’ microservice. The Threads microservice will render a page that will show the threads and posts stored in our main database. The 'Marketplace' Microservice will render a page that will show information about the badges from our marketplace. The 'Progress' Microservice will render a page that will show information about the user progress from our database. Finally, database will contain specific user data and information from all our microservices.


### Appendix

#### Database Schemas

* **Users**:
  * **id** int primary key auto_increment not null,
  * **email** varchar(80) not null,
  * **passHash** char(60) not null,
  * **username** varchar(255) not null,
  * **firstName** varchar(64) not null,
  * **lastName** varchar(128) not null,
  * **bio** varchar(500) not null,
  * **points** int not null,
  * **photoUrl** varchar(255) not null
  
* **Progress**:
  * **progressID** int primary key auto_increment not null,
  * **daysSober** int not null,
  * **userID** int not null,
  * foreign key (userID) references Users(id)

* CREATE UNIQUE INDEX email_index ON Users (email);

* CREATE UNIQUE INDEX username_index ON Users (username);

* **Marketplace**:
  * **badgeID** int primary key auto_increment not null,
  * **cost** int not null
  * **badgeName** varchar(30) not null
  * **badgeDescription** varchar(255) not null
  * **imgURL** varchar(255) not null
  
* **Badges**:
  * **badgeID** int not null,
  * **userID** int not null,
  * foreign key (badgeID) references Marketplace(badgeID)
  * foreign key (userID) references Users(id)

* CREATE UNIQUE INDEX badge_index ON Badges (badgeID, userID);

* **Threads**:
  * **threadID** int primary key auto_increment not null
  * **threadName** varchar(80) not null
  * **threadDescription** varchar(500)
  * **userWhoCreatedID** int not null
  * **anon** bool default false not null
  * **timeCreated** datetime not null
  * **editedAt** datetime not null
  * foreign key (userWhoCreatedID) references Users(id)

* CREATE UNIQUE INDEX thread_index ON Threads (threadName);

* **Posts**:
  * **postID** int primary key auto_increment not null
  * **threadID** int not null
  * **content** varchar (1500) not null
  * **userWhoCreatedID** int not null
  * **anon** bool default false not null
  * **timeCreated** datetime not null
  * **editedAt** datetime not null
  * foreign key (userWhoCreatedID) references Users(id)
  * foreign key (threadID) references Threads(threadID)
