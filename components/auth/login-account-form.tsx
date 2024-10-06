"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Must be a valid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(7, { message: "Password must have at least 7 characters" }),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginAccountForm() {
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: FormData) => {
    setSubmitResult("Form submitted successfully!");
    console.log(data);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <span className="text-lg">You will love it.</span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6 w-full px-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Log In</Button>
        </form>
      </Form>
    </div>
  );
}
