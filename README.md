![image](https://github.com/user-attachments/assets/ab586cda-4073-43a1-b643-f4690ba1306e)

# TransWorld Bank App - A Secure Customer International Payments Portal
## Description
The TransWorld Bank Customer Portal is a secure app for making international payments. It protects passwords by hashing and salting them and ensures that all user input is safe by validating it with RegEx patterns. The app uses SSL to keep data secure during transactions and is protected against common cyber-attacks. A video showing how everything works will be recorded and uploaded for review.

## Features In Our Payment Portal
- **Register Feature:** Allows new users to create an account by providing their personal information, ensuring that user data is securely stored.
- **Login Feature:** Users can log into the TransWorld Banking Portal using their credentials, ensuring secure authentication and access to account and payment services.
- **Payment Feature:** The core functionality where users can initiate international payments, choose currencies, and ensure transactions are processed safely.
- **Dashboard Feature:** Provides users an overview of their account, showing recent transactions, payment history, and important notifications, serving as the main control center for managing payments and tracking financial activity.

## Detailed Breakdown Of Each Feature
### Registration Page

![image](https://github.com/user-attachments/assets/519d8538-74fc-418a-accb-a3be1987f018)

- The registration page collects and securely registers new users for the TransWorld Bank Customer Portal.
- It starts with the **Full Name** field for users to input their legal name.
- The **ID Number** field captures a government-issued ID, validated with a RegEx pattern to ensure correct format.
- The **Account Number** links the user to their TransWorld Bank account.
- Users create a strong password in the **Password** and **Confirm Password** fields, which are hashed and salted for security.
- The **Register** button submits the form after verifying all fields are correctly filled. If errors occur, users are prompted to correct them. A **Login** link offers a quick path for returning users.

### Login Page

![image](https://github.com/user-attachments/assets/06911331-ddaa-4ce9-ae75-49140d2fc5b4)

- The Login page provides a straightforward interface for users to access their accounts.
- It begins with the **Full Name** field, validated to ensure consistency with registered details.
- The **Account Number** field links the login attempt to the user’s specific bank account.
- The **Password** field is encrypted using hashing and salting techniques before transmission to the server.
- The **Login** button submits the form and verifies all inputs, prompting users to correct any errors.

### Payment Form

![image](https://github.com/user-attachments/assets/cb8a7b87-d3e3-4988-be1e-41e32c3e91ad)

- The payment form requires users to enter several critical details to complete an international payment.
- Users enter the transfer amount, select the currency, input the recipient’s name, account number, bank name, and SWIFT code.
- Validation ensures all fields are filled out correctly before finalizing the payment.

### Dashboard

![image](https://github.com/user-attachments/assets/de57fa6a-1219-4c65-93fe-da8fb0d0b46d)

![image](https://github.com/user-attachments/assets/4d336278-648e-4f30-ab89-aa75511f66d7)

- The dashboard allows users to track and manage payments, displaying transaction details such as amount, recipient name, bank name, verification status, and date/time.
- Users can easily verify transaction details and maintain an accurate history.

## Non-Functional Requirements
- **Security:** Passwords are stored using a strong hashing algorithm, with salting applied.
- **Privacy:** Adherence to data privacy policies to safeguard user information.
- **Usability:** Intuitive and user-friendly interface for easy navigation.
- **Performance:** System responds within 2 seconds under normal load conditions.

## Usage
1. To begin, users must register for an account by tapping the **Register** button and filling in essential personal information.
2. After registering, users can log in by tapping the **Login** button and entering their credentials.
3. The dashboard provides an overview of recent transactions and features a **New Payment** button to initiate an international transaction.
4. Users fill in key details on the payment form and tap the **Pay Now** button to process the transaction.

## Security Features
- **Express Brute:** Middleware that limits requests from a single IP address to prevent brute force attacks.
- **Helmet:** Enhances security by setting HTTP headers, guarding against vulnerabilities like XSS and clickjacking.
- **Morgan:** Logs HTTP request details for monitoring and debugging.
- **Express-rate-limit:** Controls request rates to specific routes to protect against abuse.
- **Express-validator:** Validates and sanitizes user input to prevent injection attacks.
- **CORS:** Manages cross-origin requests to prevent unauthorized access.
  
## Password Security
- Passwords are securely stored using hashing and salting techniques.
- User input is validated using RegEx and whitelisted for enhanced security.
- Express Validator middleware sanitizes incoming data, ensuring clean and secure inputs.

## Testing
- We are using Postman to test the registration and login functionalities of the TransWorld Bank app. Postman allows us to easily send HTTP requests to the API, ensuring that the registration and login endpoints work as expected.
- By testing these features in Postman, we can verify that user data is properly handled, and authentication is securely processed.

## Technology Used
- **Frontend:** Built with Visual Studio Code using React Native, providing a user interface to interact with the banking platform.
- **Backend API:** Built using Node.js, providing RESTful API endpoints for user registration, login, and payment processing.
- **Database:** MongoDB securely stores user information and logs international payments, ensuring performance and scalability.

##  Continuous Integration and Code Quality
## Pipeline
- The TransWorld Bank App utilizes a robust CI/CD pipeline to automate the process of building, testing, and deploying the application.
- This pipeline ensures that every change made to the codebase is automatically tested and validated, maintaining high code quality and reducing the risk of introducing bugs.
- The pipeline is set up to trigger builds on every commit to the repository, allowing for seamless integration and deployment of updates.
- Postman tests are integrated into the pipeline to automatically verify the registration and login endpoints. These tests ensure that user inputs are correctly handled and that the expected responses are returned for both valid and invalid login attempts. If any test fails, the pipeline halts, preventing the deployment of broken code and ensuring the application's stability and security.

![image](https://github.com/user-attachments/assets/1cf3274d-31f7-4a0f-9a79-402735df66c1)

## SonarQube
- To maintain and improve code quality, we have integrated SonarQube into our development workflow.
- SonarQube analyses the codebase for potential vulnerabilities, code smells, and maintainability issues.
- It provides valuable feedback to developers, helping them identify areas for improvement and ensuring that our code adheres to industry best practices.
- By continuously monitoring code quality, SonarQube plays a crucial role in maintaining the reliability and security of the TransWorld Bank App.

Demonstration Video: [YouTube Link](https://youtu.be/3v1lowCuwt0)


