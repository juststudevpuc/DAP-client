import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validations/authSchema";
import { apiService } from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  // 1. Setup global state
  const setAuth = useAuthStore((state) => state.setAuth);

  const navigate = useNavigate();

  // 2. Setup React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // 3. Handle the submission
  const onSubmit = async (data) => {
    try {
      const response = await apiService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      // Save user and token to Zustand (and localStorage automatically)
      setAuth(response.user, response.token);
      navigate("/weekly-plan");

      alert("Registration successful!");
    } catch (error) {
      // If Laravel rejects the registration (e.g., email already exists)
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        if (backendErrors.email) {
          setError("email", { message: backendErrors.email[0] });
        } else {
          setError("root", { message: "Validation failed on the server." });
        }
      } else {
        setError("root", {
          message: "Something went wrong. Please try again.",
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              type="text"
              {...register("name")}
              className={
                errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              {...register("email")}
              className={
                errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              {...register("password")}
              className={
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Password Confirmation Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              {...register("password_confirmation")}
              className={
                errors.password_confirmation
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {errors.password_confirmation && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          {/* API Error Message */}
          {errors.root && (
            <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
              {errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
};
