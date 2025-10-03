import Test from "./pages/Test";
import AuthLayout from "./components/layout/AuthLayout";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/LoginPage";

const routes = [
	{
		path: "/test-auth",
		element: <Test />,
		layout: <AuthLayout />,
	},
	{
		path: "/login",
		element: <LoginPage />,
		layout: <AuthLayout />,
	},
	{
		path: "/test-main",
		element: <Test />,
		layout: <MainLayout />,
	},
];

export default routes;