# Login-Service

## Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Functional](#functional)
    - [Functional Requirements](#functional-requirements)
    - [Security Requirements](#security-requirements)
    - [Security Design](#security-design)

## Introduction

The Login Service API provides authentication functionality via HTTP, allowing users to securely sign up and sign in using usernames and passwords. This document outlines the setup process, functional requirements, security measures, and design considerations of the API.

## Getting Started

### Clone the Repo
```bash
git clone https://github.com/Ironmomo/LoginService.git
```

### Initialize the Database

o set up a MySQL database, execute the [init.sql](src/db/sql/init.sql) script. You can use Docker to simplify this process by building and running a container with the provided Dockerfile.

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

Create a .env file in the root directory and configure environment variables for the Express server and database connection.

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

Customize the API behavior by modifying configuration settings such as maximum login attempts, login threshold, number of hashes, payload limit, and CORS settings.

**MAX_LOGIN_ATTEMPT:** 
Numeric value to set how many invalid login attempts to the same user can be made until the user gets locked for a defined amount of time. Default is 5

**LOGIN_THRESHOLD:**
Numeric value to set the amount of time in minutes to past until a locked user gets unlocked again. Default is 15 which means the account is locked for 15 minutes if the number of invalid login attempts reaches MAX_LOGIN_ATTEMPT.

**NUMBER_OF_HASHES:**
Numeric value to set the number of hash iteration when encrypting the password

**PWD_PAYLOAD_LIMIT:**
Numeric value to define the maximum size of the Request body in bytes. The payload for pwd is the username and password field. Therefore the maximum number of bytes of a valid payload would be 55. (username=<username(max 12)>&password=<password(max24)>)

**ENABLE_CORS:**
Boolean to enable (true) or disable (false) CORS. If enabled Cross-Origin-Resource-Policy header is set to *same-origin*

```
DefaultConfig = {
    // PWD Authentication
    MAX_LOGIN_ATTEMPT: number
    LOGIN_THRESHOLD: number
    NUMBER_OF_HASHES: number

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

Refer to the [API-Documentation](https://documenter.getpostman.com/view/16623785/2sA3JFAj75) for detailed insights into the API's behavior and endpoints.

### Functional Requirements

1. **Sign-up Functionality:** Allow users to register with a username and password.

2. **Sign-in Functionality:** Authenticate users using their username and password.
 

### Security Requirements

1. **Strong Password Enforcement:** Ensure strong passwords to prevent guessing and cracking attacks.
2. **Prevent Direct OS Access:** Avoid direct access to the operating system to enhance security.
3. **Secure Database Access:** Implement secure database access to prevent SQL injection attacks.
4. **Data Validation:** Validate all data received from users or other systems to mitigate security risks.
5. **Payload Size Limit:** Limit request payload size to prevent Denial of Service (DoS) attacks.
6. **Throttling:** Throttle authentication requests to prevent brute-forcing attacks.
7. **Prevent data breaches:** Do not save any confidential user data (e.g. password) in plaintext.
8. **Encrypted Communication:** Encrypt all communication with external systems to protect data.
9. **Information Leakage Prevention:** Prevent information leakage to enhance security.

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

8.  <None>

9.
    - If the username or the password is wrong, the same response object and status code must be sent.
    - To enforce the same response time, a sleep function is implemented.
