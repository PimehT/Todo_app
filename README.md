# TODO App

[Todo](https://66eb4430f0678f20a64e3411--guileless-pavlova-01b7ff.netlify.app/) is a modern, user-friendly task management app designed to help users efficiently organize their daily activities. With a clean and intuitive interface, Todo allows users to create, manage, and track tasks effortlessly.
With core features such as user authentication, task management, real-time updates, data synchronization, and notifications, Todo targets anyone looking to streamline their daily tasks, from professionals managing work projects to students organizing their study schedules.

---

![image](https://github.com/user-attachments/assets/3f9a71da-93fb-44a8-901c-bf21bcf07970)

---
# Frontend

Our website was built, compiled and then hosted on netlify.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Backend

![Backend_architecture](https://github.com/user-attachments/assets/0eb9bdb7-2b61-4653-86d2-fcabba3824fa)

* **Load Balancer**

We used [*HAProxy*](https://www.digitalocean.com/community/tutorials/an-introduction-to-haproxy-and-load-balancing-concepts) as the load balancer in this project. It was set up to serve requests to 2 servers using round-robin load balancing algorithm. Since only one server has MYSQL set up as the master in the replication, all requests that manipulate data are sent to server1.

* **Webserver**

We used [*NGINX*](https://nginx.org/en/docs/) to serve and respond to HTTP requests to/from clients. The webservers were set up to allow only a few headers, and handle [preflight requests](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request).
The webservers host static files such as html, css, and javascript files built using React. It also redirects all requests to the uri `/api/v1` to the virtual application server using gunicorn service running on port 5000 on the server.

* **Application server**

We used a [*gunicorn*](https://gunicorn.org/), a python WSGI HTTP server for UNIX. It was set up to run as a service listening on port 5000 on each server. It binds requests made to port 5000 to the flask application which incudes all the api endpoints. The flask application fetches data from the MYSQL database using mysqldb, and sqlalchemy.

### API end points exposed by the API `/api/v1`

NOTE: All endpoints except `/status`, `/stats`, and `/users/register` require the Authorization header with a Bearer Token for authentication.

* **GET /status**\
Checks if the server can respond to requests

* **GET /stats**\
Returns the count of all models stored in the database

* **GET /tasks**\
Returns all tasks of that user. This endpoint allows filtering params i.e `?status=Pending`, `?sort`, `?limit=3`, `order=asc|desc`

* **POST /tasks**\
Creates a task under that user

* **PUT /tasks/<task_id>**\
Updates the task with the task_id based on the sent data.

* **POST /tasks/search**\
Returns results based on the sent filter data. The sent data should be in the form below;

    ```python
    {
    "filters": {
        "condition": "OR | AND", # specifies how rules shall be matched
        "rules": [
            {
                "field": '<column>', # column to search
                "operator": 'eq|neq|like', # condition to match the value
                "value": '<value>' # value to match
            },
            ]
        }
    }
    ```

* **DELETE /tasks/<task_id>**\
Deletes the task with the provided task_id

* **POST /users/register**\
Creates a new user

* **GET /users_profile**\
Returns the data of the currently logged in user

* **PUT /update_user**\
Updates data of the current user based on the data sent


## Installation

1. First clone this repository.

2. Access the Todo App directory

3. Once the repository is cloned locate the "console.py" file and run it as follows:

    ```bash
    /AirBnB_clone$ ./console.py
    ```

4. When this command is run the following prompt should appear:

    ```bash
    (todo)
    ```

5. This prompt designates you are in the "Todo" console. There are a variety of commands available within the console program.

### Commands for console.py

* destroy - Destroys an object based on class and UUID

* show - Shows an object based on class and UUID

* all - Shows all objects the program has access to, or all objects of a given class

* update - Updates existing attributes an object based on class name and UUID

* quit - Exits the program (EOF will as well)

## Usage

Signup or login with Google, create, edit, delete or mark a task as complemted, and get notified when a task delays.

## Contributing

[Netlify](https://www.netlify.com/)
[draw.io](https://app.diagrams.net/)

## Licensing

GNU General Public License (GPLv3)

## Authors

* Joshua Kalule - [Github](https://github.com/joshuakalule) / [Twitter](https://twitter.com/KarlYoshua)
* Pimeh Tare-ere - [Github](https://github.com/PimehT) / [Twitter](https://twitter.com/pimehere)
* Arthur Apedo Justin - [Github](https://github.com/creeds-knight) / [Twitter](https://x.com/aped_o)
