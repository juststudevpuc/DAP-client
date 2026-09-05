import { RegisterForm } from "./components/Register-form";

export const Register = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <RegisterForm />
      </div>
    </div>
  );
};