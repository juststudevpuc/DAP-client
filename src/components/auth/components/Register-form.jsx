import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../../validations/authSchema";
import { apiService } from "../../../services/api";
import useAuthStore from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

// shadcn UI Components
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function RegisterForm({ className, ...props }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      setAuth(response.user, response.token);
      navigate("/weekly-plan");
      alert("Registration successful!");
    } catch (error) {
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-sm border-gray-100">
        <CardContent className="grid p-0 md:grid-cols-2">
          
          {/* Left Side: Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 flex flex-col justify-center">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-balance text-muted-foreground">
                  Sign up for CheckinMe
                </p>
              </div>
              
              {/* Name */}
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </Field>
              
              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input 
                  id="password" 
                  type="password" 
                  {...register("password")}
                  className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </Field>

              {/* Confirm Password */}
              <Field>
                <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
                <Input 
                  id="password_confirmation" 
                  type="password" 
                  {...register("password_confirmation")}
                  className={errors.password_confirmation ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.password_confirmation && (
                  <p className="text-xs text-red-500 mt-1">{errors.password_confirmation.message}</p>
                )}
              </Field>

              {/* Root Errors */}
              {errors.root && (
                <div className="p-2 mt-2 text-sm text-red-600 bg-red-50 rounded-md text-center">
                  {errors.root.message}
                </div>
              )}
              
              <Field className="mt-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Sign Up"}
                </Button>
              </Field>
              
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-4">
                Or
              </FieldSeparator>
              
              <FieldDescription className="text-center mt-2">
                Already have an account? <a href="/login" className="underline text-blue-600">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          
          {/* Right Side: Image Panel */}
          <div className="relative hidden bg-muted md:block flex justify-center">
           <img
              src="/log2.png"
              alt="Dashboard Preview"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          
        </CardContent>
      </Card>
      
      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a>{" "}
        and <a href="#" className="underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}