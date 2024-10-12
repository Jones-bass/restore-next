"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Lock, Mail } from "lucide-react";

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
  const [loading, setLoading] = useState(false)
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      console.log(data);

      setTimeout(() => {
        setSubmitResult("Form submitted successfully!");

        toast({
          title: 'Sucesso!',
          description: 'Login realizado com sucesso.',
          variant: 'success',
        });

        setLoading(false);

      }, 2000);

    } catch (error) {
      toast({
        title: 'Erro ao realizar o login',
        description: 'Por favor, verifique os dados e tente novamente.',
        variant: 'error',
      });
      setLoading(false);
    }
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
                  <Input placeholder="E-mail" {...field}
                    icon={<Mail className="text-gray-500 w-4 h-4 mr-2" />}
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
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field}
                    icon={<Lock className="text-gray-500 w-4 h-4 mr-2" />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full mb-4 ">
            {loading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Log In'
            )}
          </Button>

        </form>
      </Form>
    </div>
  );
}
