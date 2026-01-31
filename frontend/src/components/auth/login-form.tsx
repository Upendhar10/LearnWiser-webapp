import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { authService } from "@/services/auth.service";
import { useState } from "react";

import { useAppDispatch } from "@/reduxTK/hooks";
import { loginSuccess, logoutSuccess } from "@/reduxTK/slices/authSlice";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      setError(null);

      const res = await authService.login(data);

      localStorage.setItem("authToken", res?.data.token);

      dispatch(
        loginSuccess({
          token: res.data.token,
        })
      );

      navigate("/dashboad");

      console.log("Login Successfull", res.data);
      {
        error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        );
      }
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  // logout handler
  function handleLogout() {
    dispatch(logoutSuccess());
    authService.logout();
    navigate("/login");
  }

  return (
    <form
      noValidate
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="johndoe@example.com"
            {...register("email", {
              required: true,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          <p className="text-sm text-destructive">{errors.email?.message}</p>
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: true,
              minLength: {
                value: 4,
                message: "Password should be more than 4 characters!",
              },
            })}
          />
          <p className="text-sm text-destructive">{errors.password?.message}</p>
        </Field>

        <Field>
          <Button type="submit" variant="outline" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/forgot-password" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
