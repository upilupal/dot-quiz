"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { signInSchema, signUpSchema } from "@/lib/zod";
import LoadingButton from "@/components/loadingButton";
import { handleCredentialsSignin, handleSignUp } from "@/app/actions/authActions";
import { useState } from "react";
import ErrorMessage from "@/components/errorMessage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Register() {
  const [globalError, setGlobalError] = useState<string>("");
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
        const result: ServerActionResponse = await handleSignUp(values);
        if (result.success) {
            console.log("Account created successfully.");
            const valuesForSignin = {
                email: values.email,
                password: values.password,
            };
            await handleCredentialsSignin(valuesForSignin);
        } else {
            setGlobalError(result.message);
        }
    } catch (error) {
        setGlobalError("An unexpected error occurred. Please try again.");
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">Register your account</CardTitle>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {["name", "email", "password", "confirmPassword"].map((field) => (
                <FormField
                control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signUpSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                      <FormControl>
                        <Input type={field.includes("password") ? "password" : field === "email" ? "email" : "text"} placeholder={`Enter your ${field}`} {...fieldProps} autoComplete="off" />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton pending={form.formState.isSubmitting}>Sign Up</LoadingButton>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
        <p className="text-slate-400">
              Already have an account?{" "}
              <Link href={"/login"} className="underline hover:opacity-75 transition">
                Login
              </Link>{" "}
              here
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
