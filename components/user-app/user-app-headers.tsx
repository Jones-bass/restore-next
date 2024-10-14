"use client";

import { UserNav } from "../common/user-nav";

export default function UserAppHeader() {
  return (
    <header>
      <nav className="flex justify-between items-center m-4">
        <span className="font-extralight">
          dash<span className="font-extrabold">Store</span>
        </span>
        <UserNav />
      </nav>
    </header>
  )
}
