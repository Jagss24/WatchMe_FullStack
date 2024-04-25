

# ![Logo](https://github.com/Jagss24/WatchMe_FullStack/blob/master/frontend/src/assets/watchme.png?raw=true)


## Description
**WatchMe** is an online platform for editors and photographers to show case their editing skills, photography skills and gain popularity,followers and an appearance for their talent.

It's a platform where editors and photographers engage to show case their skills and most specific an environment built just for them.

Users can post images which they have clicked or edited , they can follow another users if they liked their photography or editing skills which will motivate them to post more. They can also like, comment, download and can save image for any further use. 

If they want to message a specific user for some purpose they can sent messages also. Usually those peoples who are in a search of good photographers or editors can come and browse all types of photographers and can message whom they like. Messages will be sent on their mail. 




## Features
- When the user will signup he will receive an **OTP** ensuring that no user is fake.
- Users can post & delete photos.
- Only jpg & png file supported.
- Users can like,comment,downlaod & save the photos.
- Users can search for the photos.
- User can follow each other.
- User can message each other.
- User can update their profile.
- User is able to recover his password through **OTP.**
- If a user has not logged in, he can only browse & download images.
- User can also signup & login through modals if he/she clicked on like,save, comment or post a photo without logging in.





## Tech Stack

**Client:** React, TailwindCSS, DaisyUI

**Server:** Node, Express

**Datbase:** MongoDB Atlas

**External Libraries:** Nodemailer, multer, axios, cors, etc. There are many more you can check in package.json


## Run Locally

Clone the project

```bash
  git clone https://github.com/Jagss24/WatchMe_FullStack
```

Go to the project directory

```bash
  cd my-project
```

Install frontend dependencies

```bash
  cd frontend
  npm install
```

Install backend dependencies

```bash
  cd backend
  npm install
```

#### Create a .env file in backend folder

```javascript
GMAIL_ADDRESS = 'your gmail-address'
GMAIL_APP_PASSWORD = 'your gmail app password'
MONGO_URI = 'your mongo uri connection string'
```
#### In -> frontend\src\components\basePort

```javascript
// Replace this
const basePort = "https://watchme-fullstack.onrender.com";
export default basePort;

//To this
const basePort = "https://localhost:1000";
export default basePort;

```
Start the backend

```bash
  npm start
```

Start the frontend

```bash
  npm run start
```




## Deployments

**Backend deployment on render** [Render link](https://watchme-fullstack.onrender.com/)

**Fullstack(frontend) deployment on vercel** [Vercel link](https://watchme-lake.vercel.app/)

## Preview of the Project

[Video Link](https://drive.google.com/file/d/1po-PnaQHMSWGvj5HMMYNNvL08lcWf3tQ/view?usp=sharing)

## Supports

I have made this projects UI with the help of a yotube video link provided below


[YoutTube video Link](https://www.youtube.com/watch?v=8FjbqNt5rGw&t=21917s)

**The Backend is fully made by me and some frontend functionlaities for ex:- follow, message, like, update profile and OTP's.**


## Author

- [@Jagss24](https://github.com/Jagss24)

