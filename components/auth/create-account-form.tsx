"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from '@/hooks/use-toast';
import { Button } from "../ui/button";
import { GitHubLogoIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Lock, Mail, User } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  name: z
  .string({ required_error: "Email is required" }),
  email: z
  .string({ required_error: "Email is required" })
  .email({ message: "Must be a valid email" }),
  password: z
  .string({ required_error: "Password is required" })
  .min(8, { message: "Password must have at least 8 characters" }),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateAccountForm() {
  const router = useRouter();
  const { toast } = useToast();
 
  const [loading, setLoading] = useState(false)
  const [loadingGitHub, setLoadingGitHub] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);

    try {
      const supabase = createClientComponentClient();
      const { email, password } = values;

      const { error, data: { user } } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (user) {
        form.reset(); 
        toast({
          title: "Success!",
          description: "Account created successfully. Please check your email to verify your account.",
          variant: "success",
        });
        router.refresh(); 
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an issue creating your account.",
        variant: "error",
      });
    } finally {
      setLoading(false); 
    }
  };

  const handleGitHubSignIn = async () => {
    setLoadingGitHub(true); 
    try {
      const supabase = createClientComponentClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
  
      if (error) throw new Error(error.message);
  
      setTimeout(() => {
        router.refresh(); 
        toast({
          title: 'Welcome!',
          description: 'User successfully logged in.',
          variant: 'success',
        });
        setLoadingGitHub(false); 
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with GitHub.",
        variant: "error",
      });
      setLoadingGitHub(false); 
    }
  };  

  return (
    <div className="flex flex-col justify-center items-center">
      <span className="text-lg">You will love it.</span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6 w-full px-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field}
                    icon={<User className="text-gray-500 w-4 h-4 mr-2" />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <Input placeholder="Password" {...field}
                    icon={<Lock className="text-gray-500 w-4 h-4 mr-2" />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full mt-8 mb-4">
            {loading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Create Account'
            )}
          </Button>
          <Button
            onClick={handleGitHubSignIn}
            disabled={loadingGitHub}
            className="flex items-center justify-center w-full mt-2"
          >
            {loadingGitHub ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <GitHubLogoIcon className="mr-2 h-4 w-4" />
                Sign in with GitHub
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
