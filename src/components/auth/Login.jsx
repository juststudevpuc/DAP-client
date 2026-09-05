import { LoginForm } from "./components/login-form";

export const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
};