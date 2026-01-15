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

import { useState } from "react";
import { authService } from "@/services/auth.service";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const password = watch("password");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setLoading(true);
      setError(null);

      const { confirmPassword, ...payload } = data;

      const res = await authService.register(payload);

      console.log("Registration Sucessfull", res.data);
    } catch (error: any) {
      setError(error?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        {/* Name */}
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            placeholder="John Doe"
            {...register("name", {
              required: "Name is required",
            })}
          />
          <p className="text-sm text-destructive">{errors.name?.message}</p>
        </Field>
        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Johndoe@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          <p className="text-sm text-destructive">{errors.email?.message}</p>
          <FieldDescription className="text-sm text-destructive">
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        {/* password */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="********"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <p className="text-sm text-destructive">{errors.password?.message}</p>
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        {/* confirm password */}
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="********"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          <p className="text-sm text-destructive">
            {errors.confirmPassword?.message}
          </p>
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit" variant="outline" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="#">Log In</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
