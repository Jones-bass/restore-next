import CreateAccountForm from "@/components/auth/create-account-form"
import LoginAccountForm from "@/components/auth/login-account-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation"; 
import { cookies } from "next/headers";
import { RedirectType } from "next/navigation";

export default async function Home() {
  let loggedIn = false;
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) loggedIn = true

  } catch (error) {
    console.log("Home", error);
  } finally {
    if (loggedIn) redirect("/user-app", RedirectType.replace)
  }

  return (
    <div className="flex flex-col h-screen w-full justify-center items-center">
      <Tabs defaultValue="create-account" className="w-96 botder rounded-md pb-4 shadow-2xl">
        <TabsList className="flex justify-around items-center rounded-b-none h-14">
          <TabsTrigger className="transition-all delay-150 w-full h-full" value="create-account">Account</TabsTrigger>
          <TabsTrigger className="transition-all delay-150 w-full h-full" value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="create-account">

          <CreateAccountForm />
        </TabsContent>
        <TabsContent value="login">
          <LoginAccountForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

