# Hero Hub

A web application developed for SE 3316A Web Technologies Lab #4, leveraging React for the front-end and Node.js with Express for the back-end, hosted on AWS.

## Table of Contents
- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Security & Privacy](#security--privacy)
- [DMCA Policy](#dmca-policy)
- [Submission Instructions](#submission-instructions)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
Hero Hub is an enhanced web application that allows users to create, manage, and share lists of heroes. Authenticated users can create and edit their hero lists, add comments and ratings, while admins can manage user accounts and handle copyright-related tasks.

## Objectives
1. Apply knowledge of server-side and client-side scripting to create a complex web application.
2. Expose major functionality via a RESTful web API.
3. Develop a client application using React.
4. Implement an authentication protocol and provide different levels of functionality to authenticated vs. unauthenticated users.
5. Create a responsive user interface.
6. Ensure the application is resistant to malicious exploitation.
7. Develop security, privacy, and DMCA policies that are publicly accessible.

## Features
- **Authentication:**
  - Local authentication with email, password, and nickname.
  - Email verification and input validation.
  - Account management (update password, disable account).
- **Unauthenticated Users:**
  - View the start page with application info and login mechanism.
  - Search for heroes by name, race, power, or publisher.
  - View public hero lists and detailed hero information.
- **Authenticated Users:**
  - Create, edit, and delete hero lists.
  - Add comments and ratings to public hero lists.
- **Admin Functionality:**
  - Manage user accounts (grant manager privileges, disable accounts).
  - Handle DMCA requests and log entries.
  - Manage reviews (hide or restore reviews).

## Technologies Used
- **Front-End:** React, CSS, HTML
- **Back-End:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt
- **Hosting:** AWS

## Getting Started
### Prerequisites
- Node.js
- npm
- MongoDB
- AWS account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/se3316-xxx-lab4.git
   cd se3316-xxx-lab4
   ```

2. Install dependencies for the back-end:
   ```bash
   cd server
   npm install
   ```

3. Install dependencies for the front-end:
   ```bash
   cd ../client
   npm install
   ```

### Running the Application
1. Start the back-end server:
   ```bash
   cd server
   npm start
   ```

2. Start the front-end server:
   ```bash
   cd ../client
   npm start
   ```

3. Access the application at `http://localhost:3000`

## API Endpoints
### Public Endpoints
- `GET /api/open/heroes` - Search for heroes.
- `GET /api/open/lists` - View public hero lists.

### Secure Endpoints (Authenticated Users)
- `POST /api/secure/lists` - Create a new hero list.
- `PUT /api/secure/lists/:id` - Edit an existing hero list.
- `DELETE /api/secure/lists/:id` - Delete a hero list.
- `POST /api/secure/reviews` - Add a review to a hero list.

### Admin Endpoints
- `POST /api/admin/disable-user` - Disable a user account.
- `POST /api/admin/manage-reviews` - Manage reviews (hide/restore).

## Authentication
Authentication is handled using JWT. Users can create accounts, log in, and receive a token that must be included in the header of secure API requests.

## Security & Privacy
- **Security Policy:** [Link to security policy]
- **Privacy Policy:** [Link to privacy policy]

## DMCA Policy
- **DMCA Notice:** [Link to DMCA notice]
- **DMCA Takedown Procedure:** [Link to takedown procedure]

## Submission Instructions
1. Ensure your repository is named `se3316-xxx-lab4`.
2. Use a proper `.gitignore` file.
3. Submit the output of `git log` on Owl.
4. Download and submit your repository as a zip file on Owl.
5. Submit a completed test plan on Owl.
6. Demonstrate your application on a public URL before the demonstration deadline.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for review.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

