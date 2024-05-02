# Login-Service

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
