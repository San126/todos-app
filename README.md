## Todos-App is an app to create and maintain the project todos and keep track of their progress easily

The project front-end part is done in Reactjs and back-end in Nodejs

once you import the git repository todos-app - https://github.com/San126/todos-app.git

do **`npm i`** in both client sub directory and in the route directory

- open two terminals

  in the first one do

  **`npm install`**

- in the route directory todos-app, and in the second do as follows

  **`cd client`**

  **`npm install`**

---

- Once the set up is done

  **`cd client`**

  **`npm start`**

will initialize the client part

and do **`npm start`** directly in the route directory will invoke the server.

---

- Also create Github personal access id so that can create gist

Steps to follow to create access token

1. Go to git profile on click of the profile at the end select > settings 
2. In the opened window on the side nav select Developer settings
3. in the window on the side nav click Generate Access Token Now

give proper permission and create access token and copy the value 

- Now got to the client sub directory create file `.env` paste the value with lable tsarting in **REACT_APP_** then save the value like
`REACT_APP_GITHUB_PERSONAL_TOKEN=personal_token_value_copid_now`

Now the setups are done you can work on the app demo
