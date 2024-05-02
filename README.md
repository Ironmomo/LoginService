# Login-Service

## Functional

Please see the [API-Documentation](https://documenter.getpostman.com/view/16623785/2sA3JFAj75) to get more insights about the API behaviour.

### Functional Requirements
1. Provide Sign-up functionality to register a new user with a username and a password.

2. Provide Sign-in functionality to authenticate a user using: 
    - username & password
 

### Security Requirements

1. The system must enforce strong user passwords to prevent password guesing and cracking attacks

2. The Application must not directly access the underlying operating system (files, operating system commands)

3. Database access must be implemented securely to prevent SQL injection attacks

4. All data received from users or other systems are considered non-thrusted and must first be validated before processed further

5. The payload size of the requests must be limited to prevent DOS attacks

6. Authentication requests to the same user must be throttled down to prevent effective brute-forcing attacks.

7. Do not save any confidential user data (e.g. password) in plaintext to mitigate the risk of data breaches.

8. All communication with the outside must be encrypted.

9. The system must not allow any information leakage to guess valid usernames (e.g. Response Time, HTML Status Code, Error Message)
