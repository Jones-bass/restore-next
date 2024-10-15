
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { RedirectType } from "next/navigation";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

import UserAppHeader from "@/components/user-app/user-app-headers";

import { PlusCircleIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAppSidebar } from "@/components/user-app/user-app-sidebar";
import ImageUploadPlaceholder from "@/components/user-app/image-upload-placeholder";

export default async function UserApp() {
  let loggedIn = false;
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) loggedIn = true

  } catch (error) {
    console.log("UserApp", error);
  } finally {
    if (!loggedIn) redirect("/", RedirectType.replace)
  }

  return (
    <>
      <div className="md:block">
        <UserAppHeader />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <UserAppSidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="music" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="photo" className="relative">
                          Photos
                        </TabsTrigger>
                        <TabsTrigger value="document">Documents</TabsTrigger>
                        <TabsTrigger value="other" disabled>
                          Others
                        </TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <Button>
                          <PlusCircleIcon className="mr-2 h-4 w-4" />
                          Add Collection
                        </Button>
                      </div>
                    </div>
                    <TabsContent
                      value="photo"
                      className="border-none p-0 outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Listen Now
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Top picks for you. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ImageUploadPlaceholder />
                      </div>
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Made for You
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Your personal playlists. Updated daily.
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="document"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            New Episodes
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

