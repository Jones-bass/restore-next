"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Importando ícones do Lucide
import { User, CreditCard, Settings, Users, LogOut } from 'lucide-react'

interface UserMetadata {
  avatar_url?: string;
  email?: string;
  full_name?: string;
  preferred_username?: string;
}

interface User {
  id: string;
  email?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
  };
  user_metadata: UserMetadata;
}

export function UserNav() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const getUser = async () => {
    const { data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.log("UserNav: ", error)
    } else {
      setUser(user as User)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh()
  }

  return (
    <>
      {!user && <Link href={"/"}>Login</Link>}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.user_metadata.avatar_url || "/default-avatar.png"}
                  alt={user.user_metadata.preferred_username || "User"}
                />
                <AvatarFallback>
                  {user.user_metadata.preferred_username ? user.user_metadata.preferred_username[0] : "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.user_metadata.full_name || "Unknown User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email || "No email"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> 
                Profile
                <DropdownMenuShortcut />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" /> 
                Billing
                <DropdownMenuShortcut />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> 
                Settings
                <DropdownMenuShortcut />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" /> 
                New Team
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
              <DropdownMenuShortcut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
