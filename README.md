# Social-Media-App
A RESTful social media backend built with Node.js, Express, and MongoDB.
It supports authentication, user management, posts, likes, follow/unfollow, and timeline feeds.

📌 Features
🔐 Authentication

Register new users

Login users

Password hashing using bcrypt

Prevent duplicate emails

👤 User Management

Update user

Delete user

Get a user profile

Follow and unfollow users

Admin support for updating/deleting any user

📝 Posts

Create a post

Update a post (only owner)

Delete a post (only owner)

Like / Dislike a post

Get a single post

📰 Timeline

Get user timeline (their posts + posts from followings)

Get all posts (public feed)

🛠️ Technologies Used

Node.js

Express.js

MongoDB & Mongoose

bcrypt for password hashing

🧱 Project Structure
📦 social-media-api
 ┣ 📂 models
 ┃ ┣ 📜 User.js
 ┃ ┗ 📜 Post.js
 ┣ 📂 routes
 ┃ ┣ 📜 auth.js
 ┃ ┣ 📜 users.js
 ┃ ┗ 📜 post.js
 ┣ 📜 server.js
 ┣ 📜 .env
 ┗ 📜 README.md

Server runs on:
👉 http://localhost:8000

🔑 API Endpoints
AUTH ROUTES
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
USER ROUTES
Method	Endpoint	Description
PUT	/api/users/:id	Update user
DELETE	/api/users/:id	Delete user
GET	/api/users/:id	Get user
PUT	/api/users/:id/follow	Follow a user
PUT	/api/users/:id/unfollow	Unfollow a user
POST ROUTES
Method	Endpoint	Description
POST	/api/posts/	Create a post
PUT	/api/posts/:id	Update post
DELETE	/api/posts/:id	Delete post
GET	/api/posts/:id	Get a post
PUT	/api/posts/:id/like	Like / Unlike post
GET	/api/posts/timeline/:userId	Get timeline posts
GET /api/posts/timeline/all Get all posts

# Deployment URL
https://social-media-app-vugq.onrender.com