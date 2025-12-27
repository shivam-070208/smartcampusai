"use client";
import Container from "@/components/common/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/components/providers/auth-context";
import { Separator } from "@/components/ui/separator";

const LoginFormValues = z.object({
  email: z.email("A valid email is required for submission"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type SignupFormSchema = z.infer<typeof LoginFormValues>;

const SignUpFrom = () => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const {signup,googleAuth} = useAuth();
  const form = useForm<SignupFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginFormValues),
    mode: "onTouched",
  });

  const onSubmit = async (values: SignupFormSchema) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      await signup(values.email, values.password);
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMessage(
        error?.message || "An unknown error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
    await googleAuth();
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMessage(error?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="flex justify-center items-center min-h-dvh">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your email and password to create an account.
          </CardDescription>
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium mt-2">
              {errorMessage}
            </div>
          )}
        </CardHeader>
        <Separator />
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              autoComplete="off"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={submitting}
              >
                {submitting ? "Logging in..." : "Login"}
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={onGoogle}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  <>
                    <FcGoogle />
                    Continue with Google
                  </>
                )}
              </Button>
              <p className="text-xs font-semibold">have an account?</p>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignUpFrom;