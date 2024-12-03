## INTRODUCTION
<h1 id="library-management-system">Library Management API utilizing JWT Tokens for Authorization</h1>
The Simple Library Management API is designed to manage a library system securely and efficiently, utilizing JWT-based authentication for user authorization. It offers full CRUD functionality for managing users, books, authors, and the relationships between books and authors. Users can create, read, update, and delete their accounts, with secure login functionality that provides a JWT token for accessing protected endpoints.

## <!TABLE OF CONTENTS >
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#library-management-system">About The API/Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installing">Installing</a></li>
      </ul>
    </li>
    <li><a href="#implementation">Implementation</a>
        <ul>
        <li><a href="#user-endpoints">User Endpoints</a></li>
        <li><a href="#author-endpoints">Author Endpoints</a></li>
        <li><a href="#book-endpoints">Book Endpoints</a></li>
        <li><a href="#book-author-relationship-endpoints">Book-Author Relationship Endpoints</a></li>
      </ul>
    </li>
    <li><a href="#token-management">Token Management</a></li>
    <li><a href="#project-information">Project Information</a></li>
    <li><a href="#contact-information">Contact Information</a></li>
  </ol>
</details>

## About the Project

The Library Management System offers secure and efficient management of books, authors, users, and associations of them, together with strong searching and cataloging features. It offers a complete CRUD (Create, Read, Update, Delete) on the management of users which comprises registering and authenticating as well as viewing, updating, and deleting user profiles while at the same time book management as well as author and association book-author. Users can quickly search for and catalog books and authors, giving easy access to information. Token-based authentication with validation and usage tracking ensures that only authorized users are able to carry out operations. The book-author relationship table increases flexibility by connecting books to their authors. This system is intended to simplify and secure library data management while maintaining high security standards.

<p align="right">(<a href="#library-management-system">back to top</a>)</p>

## Getting Started

### Prerequisites

- XAMPP
- SQLyog
- JWT PHP Library
- Node.js
- Composer
- PHP (version 7.2 or higher)
- Slim Framework
- ThunderClient

### Installing

1. **Clone the Repository**

   ```bash
   git clone https://github.com/github_username/Library4a.git
   cd /path/to/xampp/htdocs/Library4a

   ```

2. **Install Dependencies**

   - Use Composer to install PHP dependencies:

   ```bash
   composer install

   ```

3. **Set Up Database**

   - Open SQLyog or phpMyAdmin and create a new database called `library`.
   - Run the following SQL queries to create the required tables:

   ```sql
    CREATE TABLE users (
       userid INT NOT NULL AUTO_INCREMENT,
       username CHAR(255) NOT NULL,
       password TEXT NOT NULL,
       PRIMARY KEY (userid)
   );

    CREATE TABLE authors (
       authorid INT(9) NOT NULL AUTO_INCREMENT,
       name CHAR(255) NOT NULL,
       PRIMARY KEY (authorid)
     );

    CREATE TABLE books (
      bookid INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      authorid INT NOT NULL,
      FOREIGN KEY (authorid) REFERENCES authors(authorid)
    );

   CREATE TABLE book_authors (
      collectionid INT AUTO_INCREMENT PRIMARY KEY,
      bookid INT NOT NULL,
      authorid INT NOT NULL,
      FOREIGN KEY (bookid) REFERENCES books(bookid),
      FOREIGN KEY (authorid) REFERENCES authors(authorid)
    );

   CREATE TABLE tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      token VARCHAR(255) NOT NULL,
      userid INT NOT NULL,
      status ENUM('active', 'revoked', 'expired') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      used_at TIMESTAMP NULL,
      FOREIGN KEY (userid) REFERENCES users(userid)
    );
   ```

4. **Configure Database Connection**

   - Modify the connection details in the index.php file as specified :

   ```php
   <?php
   $servername = "localhost";
   $username = "root";
   $password = "";
   $dbname = "library";
   ?>
   ```

   Substitute these values with your actual database settings to establish a connection to the library database.

5. **Start XAMPP Server**

   - Make sure that both Apache and MySQL are active/running in the XAMPP control panel.

6. **Testing the Application**
   - You can now test the CRUD operations and authentication endpoints using API testing tools such as Postman or Thunder Client(default testing tool i used).

<p align="right">(<a href="#library-management-system">back to top</a>)</p>

## Implementation

<h3 id="user-endpoints">1. User Endpoints</h3>

**a. User Registration** - creates a new user account using a hashed password and a unique username.

- **Endpoint:** `/user/register`
- **Method:** `POST`
- **Sample Payload:**

  ```json
  {
    "username": "input username ",
    "password": "input password"
  }
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "data": null
    }
    ```

**b. User Authentication** - creates a JWT token for session management and authenticates a user.

- **Endpoint:** `/user/auth`
- **Method:** `POST`
- **Sample Payload:**

  ```json
  {
    "username": "existing username",
    "password": "existing Password"
  }
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "token": "generated token is placed here",
    }
    ```

  - **Failure:**

    ```json
    {
      "status": "fail",
      "data": {
        "title": "Authentication Failed"
      }
    }
    ```

**c. Display Users** - obtains a list of every user in the system; a valid token is needed.

- **Endpoint:** `/users`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <Enter the jwtToken that was generated by the users here>`

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "data": [
        {
          "userid": 1,
          "username": "your_username"
        }
      ]
    }
    ```

**d. Update User Information** - updates the user's password and/or username; a working token is needed.

- **Endpoint:** `/user/edit/{userid}`
- **Method:** `PUT`
- **Sample Payload:**

  ```json
  {
    "username": "updated Username",
    "password": "new Password"
  }
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "data": null
    }
    ```

  - **Failure:** A suitable error notice will appear if the new username is already taken, if there is nothing to update, or if the token is invalid, expired, or already used.
    
**e. Delete User** - removes the verified user's account from the database; a working token is needed.

- **Endpoint:** `/user/{userid}`
- **Method:** `DELETE`
- **Sample Payload:**

  ```json
  {
    "Token": "place jwtToken Here",
    "userid": "place userid"
  }
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "Token": "generated token",
      "data": null
    }
    ```

  - **Failure:** If the user doesn’t exist, or if the token is invalid, expired, or already used, an appropriate error message.

<p align="right">(<a href="#library-management-system">back to top</a>)</p>

<h3 id="author-endpoints">2. Author Endpoints</h3>

**a. Register Author** - register/add a new author to the database.

- **Endpoint:** `/author/register`
- **Method:** `POST`
- **Sample Payload:**

  ```json
  {
    "Token":"input the generated jwtToken Here",
    "name": "Author_Name"
  }
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "token": "generated token",
      "data": null
    }
    ```

  - **Failure:** An suitable error message will be returned if the token is invalid, expired, already used, the name is empty, or the author is already known.

**b. Display Author** - shows the database's list of authors.

- **Endpoint:** `/author/show`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <insert generated jwtTokenHere from the users/authenticate>`

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "token": "generated token",
      "data": null
    }
    ```

**c. Update Author** -updates the database with an author's information.

- **Endpoint:** `/author/update`
- **Method:** `PUT`
- **Sample Payload:**

  ```json
  {
  "token": " input the generated JwtToken Here",
  "authorid": "4",
  "name": "Author_Name"
    }
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "token": "generated token",
      "data": null 
    }
    ```

**d. Delete Author** - Deletes an author from the database.

- **Endpoint:** `/author/{authorid}`
- **Method:** `DELETE`
- **Sample Payload:**

  ```json
   {
    "token": " input your generated JwtToken Here",
    "authorid": "4",
    }
  
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "Token": "Generated token",
      "data": null
    }
    ```

<p align="right">(<a href="#library-management-system">back to top</a>)</p>

<h3 id="book-endpoints">3. Book Endpoints</h3>

**a. Register Book** - Register/add a new book to the library.

- **Endpoint:** `/book/add`
- **Method:** `POST`
- **Sample Payload:**

  ```json
  {
    "token": "place your JwtToken Here",
    "title": "Book Title"
    "authorid": "4"
  }
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "Token": "generated token",
      "data": null
    }
    ```

  - **Failure:** An appropriate error message will be returned if the token is invalid, expired, already used, the title is empty, or the book already exists.

**b. Display Books** - presents a database list of books.

- **Endpoint:** `/books/show`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <insert generated jwtTokenHere from the users/authenticate>`

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "Token": "generated token",
      "data": [
        {
          "bookid": 1,
          "title": "Book Title"
        }
      ]
    }
    ```

**c. Update Book** - updates the database's information on a book.

- **Endpoint:** `/book/edit/{bookid}`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <insert generated jwtTokenHere from the users/authenticate>`
- **Sample Payload:**

  ```json
  {
    "token":" place your JwtToken Here",
    "bookid": 1,
    "title": "Updated Book Title",
    "authorid":"4"
  }
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "token": "generated token",
      "data": null
    }
    ```

**d. Delete Book** - removing a book from the database..

- **Endpoint:** `/book/{bookid}`
- **Method:** `DELETE`
- **Sample Payload:**

  ```json
  {
    "token": "place your JwtToken Here",
    "bookid": 4
  }
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "token": "generated token",
      "data": null
    }
    ```

<p align="right">(<a href="#library-management-system">back to top</a>)</p>

<h3 id="book-author-relationship-endpoints">4. Book-Author Relationship Endpoints</h3>

**a. Register Book-Author** - creates a new connection between a book and its author.

- **Endpoint:** `/books-authors`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <insert generated jwtTokenHere from the users/authenticate>`
- **Sample Payload:**

  ```json
  {
    "token": " place your JwtToken Here",
    "bookid": 5,
    "authorid": 3
  }
  ```

- **Expected Response:**

  - **Success:**

    ```json
    {
      "status": "success",
      "token" : "generated token",
      "data": null
    }
    ```
<p align="right">(<a href="#library-management-system">back to top</a>)</p>

## Token Management

**Token Validation**  
Using the secret key, the `validateToken` function decodes and verifies the token, returning `false` if it is invalid or expired.

```php
function validateToken($token) {
    global $key;
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "library";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT * FROM tokens WHERE token = :token AND status = 'active'";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            return $decoded->data->userid;
        } else {
            return false;
        }
    } catch (PDOException $e) {
        return false;
    }
}
```

**Mark Token As Used**  
The function `validateToken` marks the token that is generated as used by making use of a timestamp to mark it on the database

```php
function markTokenAsUsed($token) {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "library";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "UPDATE tokens SET status = 'revoked', used_at = NOW() WHERE token = :token";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
    } catch (PDOException $e) {
    }
}
```

**Token Status Update**  
The `updateTokenStatus` function connects to a database and updates the status of a specific token in the tokens table if its either used, expired or active.

```php
function markTokenAsUsed($token) {
    try {
        // Connect to the database
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prepare SQL query to update token status and set used_at timestamp
        $sql = "UPDATE tokens SET status = 'revoked', used_at = NOW() WHERE token = :token";
        $stmt = $conn->prepare($sql);

        // Bind token parameter and execute
        $stmt->bindParam(':token', $token);
        $stmt->execute();
    } catch (PDOException $e) {
        // Handle errors (optional logging can be added here)
    }
}
```
## Error Responses

### Access Denied

- **Status Code:** 403
- **Error Message:**

  ```json
  {
    "status": "fail",
    "data": {
    "Message": "Access denied, only admins can add authors."
    }
  }
  ```

### Invalid or Expired Token

- **Status Code:** 401
- **Error Message:**

  ```json
  {
    "status": "fail",
    "data": {
    "Message": "Invalid or Outdated Token."
    }
  }
  ```

### Database Error

- **Status Code:** 500
- **Error Message:**

  ```json
  {
    "status": "fail",
    "data": {
    "Message": "Database error message here."
    }
  }
  ```

  ## Code Excerpt

  Code shown below is an excerpt from `index.php` that shows how tokens are generated and validated:
  ```php
    function generateToken($userid) {
      global $key;

      $iat = time();
      $payload = [
          'iss' => 'http://library.org',
          'aud' => 'http://library.com',
          'iat' => $iat,
          'exp' => $iat + 3600,
          "data" => array(
              "userid" => $userid
          )
      ];
      $token = JWT::encode($payload, $key, 'HS256');

      $servername = "localhost";
      $username = "root";
      $password = "";
      $dbname = "library";

      try {
          $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
          $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

          $sql = "INSERT INTO tokens (token, userid, status) VALUES (:token, :userid, 'active')";
          $stmt = $conn->prepare($sql);
          $stmt->bindParam(':token', $token);
          $stmt->bindParam(':userid', $userid);
          $stmt->execute();
      } catch (PDOException $e) {

      }

      return $token;
  }

  function validateToken($token) {
      global $key;
      $servername = "localhost";
      $username = "root";
      $password = "";
      $dbname = "library";

      try {
          $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
          $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

          $sql = "SELECT * FROM tokens WHERE token = :token AND status = 'active'";
          $stmt = $conn->prepare($sql);
          $stmt->bindParam(':token', $token);
          $stmt->execute();
          $data = $stmt->fetch(PDO::FETCH_ASSOC);

          if ($data) {
              $decoded = JWT::decode($token, new Key($key, 'HS256'));
              return $decoded->data->userid;
          } else {
              return false;
          }
      } catch (PDOException $e) {
          return false;
      }
  }
  ```
## Project Information

This project is developed as part of a midterm requirement for the ITPC 115(System Integration and Architecture) subject, showcasing the ability to build secure API endpoints and manage tokens effectively.

## Contact Information
- **Name:** Justine Kelly Florendo
- **University:** Don Mariano Marcos Memorial State University (Mid-La Union Campus)
- **Email:** jflorendo09252@student.dmmmsu.edu.ph
- **Phone:** 09762385700

<p align="right">(<a href="#library-management-system">back to top</a>)</p>
