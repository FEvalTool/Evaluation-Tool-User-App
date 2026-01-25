# Evaluation-Tool-User-App
A user-facing application that provides authentication, account management, and SSO login interfaces for applications in the ecosystem.

# How to run service (Development)
1. Setup env file like .example.env.local (match the port with the user service)
2. Install package
```bash
npm install
```
3. Run the project (port 5173)
```bash
npm run dev
```

# How to run unit test
To run whole unit tests
```bash
npm run test
```

To run specific unit test file
```bash
npm run test <path to unit test file>
```
For example:
```bash
npm run test tests/src/pages/LoginPage.test.jsx
```

To run specific test
```bash
npm run test <path to unit test file>:<line index>
```