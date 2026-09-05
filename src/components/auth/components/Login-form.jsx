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
import useAuthStore from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiService } from "@/services/api";
import { loginSchema } from "@/validations/authSchema";

export function LoginForm({ className, ...props }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiService.login(data);
      setAuth(response.user, response.token);
      navigate("/weekly-plan");
    } catch (error) {
      if (error.response?.status === 401) {
        setError("root", { message: "Invalid email or password" });
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 md:p-8 flex flex-col justify-center"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your CheckinMe account
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="text-sm underline-offset-2 hover:underline text-muted-foreground"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
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
              </Field>

              {errors.root && (
                <div className="p-2 mt-2 text-sm text-red-600 bg-red-50 rounded-md text-center">
                  {errors.root.message}
                </div>
              )}

              <Field className="mt-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Login"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-4"></FieldSeparator>

              <FieldDescription className="text-center mt-4">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline text-blue-600">
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Side Image Panel */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="/log2.png"
              alt="Dashboard Preview"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
