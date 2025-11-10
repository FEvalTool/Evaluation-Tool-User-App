// import { render, screen, waitFor } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import App from "../src/App";

// describe("App routing", () => {
//     test("renders LoginPage when visiting /auth/login", async () => {
//         render(
//             <MemoryRouter initialEntries={["/auth/login"]}>
//                 <App />
//             </MemoryRouter>
//         );

//         // Wait for lazy-loaded component
//         await waitFor(() =>
//             expect(screen.getByText(/login/i)).toBeInTheDocument()
//         );
//     });

//     test("renders ForgotPasswordPage when visiting /auth/forgot-password", async () => {
//         render(
//             <MemoryRouter initialEntries={["/auth/forgot-password"]}>
//                 <App />
//             </MemoryRouter>
//         );

//         await waitFor(() =>
//             expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
//         );
//     });

//     test("renders TestPage under MainLayout", async () => {
//         render(
//             <MemoryRouter initialEntries={["/test"]}>
//                 <App />
//             </MemoryRouter>
//         );

//         await waitFor(() =>
//             expect(screen.getByText(/testing page/i)).toBeInTheDocument()
//         );
//     });
// });
