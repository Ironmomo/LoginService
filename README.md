# Login-Service

## Getting Started

### Clone the Repo
```bash
git clone https://github.com/Ironmomo/LoginService.git
```

### Initialize the Database

It is mandatory to setup a mysql database. To initialize use the following script: [init.sql](db/init.sql).

To make it more easy for you I recommend to set up a docker container with the following Dockerfile. Make shure to use the correct path to the init.sql script

```Dockerfile
#Dockerfile
# Use the official MySQL image as the base image
FROM mysql

# Set environment variables for MySQL root user password
ENV MYSQL_ROOT_PASSWORD=12345678

# Copy the init.sql script into the Docker container's /docker-entrypoint-initdb.d/ directory
# This directory is used by the MySQL Docker image to automatically initialize databases during container startup
COPY init.sql /docker-entrypoint-initdb.d/

# Expose port 3306 to allow external connections to the MySQL server
EXPOSE 3306
```

Start the docker container
```bash
# build the image
docker build . mysql_loginservice

# Start the container
docker run --name mysql_container -d -p 3306:3306 mysql_loginservice
```

### Setup the environment

Create a .env file in the root directory
```
#.env
# Express
PORT=5550

# DB
DB_USER=root
DB_HOST=localhost
DB_DATABASE=LoginDB
DB_PASSWORD=12345678
```

### Configs

There are a few configuration you can make before running the application. Let's give an overview about the different setttings:

**MAX_LOGIN_ATTEMPT:** 
Numeric value to set how many invalid login attempts to the same user can be made until the user gets locked for a defined amount of time. Default is 5

**LOGIN_THRESHOLD:**
Numeric value to set the amount of time in minutes to past until a locked user gets unlocked again. Default is 15 which means the account is locked for 15 minutes if the number of invalid login attempts reaches MAX_LOGIN_ATTEMPT.

**PWD_PAYLOAD_LIMIT:**
Numeric value to define the maximum size of the Request body in bytes. The payload for pwd is the username and password field. Therefore the maximum number of bytes of a valid payload would be 55. (username=<username(max 12)>&password=<password(max24)>)

**ENABLE_CORS:**
Boolean to enable (true) or disable (false) CORS. If enabled Cross-Origin-Resource-Policy header is set to *same-origin*

```
DefaultConfig = {
    // PWD Authentication
    MAX_LOGIN_ATTEMPT: number
    LOGIN_THRESHOLD: number

    // PWD Request Validation
    PWD_PAYLOAD_LIMIT: number

    // CORS
    ENABLE_CORS: boolean
}
```

### Build and Run the Project

```bash
npm run build

npm run start
```

## Functional

Please refer to the [API-Documentation](https://documenter.getpostman.com/view/16623785/2sA3JFAj75) for more insights into the API's behavior.

### Functional Requirements

1. Provide sign-up functionality to register a new user with a username and a password.

2. Provide sign-in functionality to authenticate a user using:
   - Username & password.
 

### Security Requirements

1. The system must enforce strong user passwords to prevent password guessing and cracking attacks.
2. The application must not directly access the underlying operating system (files, operating system commands).
3. Database access must be implemented securely to prevent SQL injection attacks.
4. All data received from users or other systems are considered untrusted and must first be validated before being processed further.
5. The payload size of the requests must be limited to prevent DoS attacks.
6. Authentication requests to the same user must be throttled down to prevent effective brute-forcing attacks.
7. Do not save any confidential user data (e.g., password) in plaintext to mitigate the risk of data breaches.
8. All communication with the outside world must be encrypted.
9. The system must not allow any information leakage to guess valid usernames (e.g., response time, HTML status code, error message).

### Security Design

1. To enforce strong user passwords, the following password constraints have been defined:
   - Password length: [8, 24]
   - Use at least one of the following characters: [!@#$*()_,.?-]

2. To prevent direct access to the underlying operating system, the following coding guidelines have been defined:
        Avoid executing shell commands by blacklisting the following functions: exec, spawn, execfile, child_process.
        Avoid direct file access by blacklisting the following library: fs and all its related libraries.

3. This project uses mysql2 to access the database; therefore, to prevent SQL injection attacks, use prepared statements.

4. To validate the payload in the password router, a middleware is executed which checks if the payload has the expected structure.

5. To prevent DoS attacks by sending large payloads, the password router enforces a payload limit.

6. To prevent brute-forcing the password of a valid user, a threshold has been set to define the maximum number of invalid login attempts. If the maximum number has been reached, any further login attempts will be blocked until a specified time has elapsed.

7. Passwords are stored using bcrypt, which stores the hash and a salt of the password.

9. If the username or the password is wrong, the same response object and status code must be sent. To enforce the same response time, a sleep function is implemented.
