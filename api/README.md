## Backend

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
