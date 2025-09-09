import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90 text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">BetterNews</Link>
          <nav className="hidden items-center space-x-4 md:flex">
            <Link className="hover:underline">New</Link>
            <Link className="hover:underline">Top</Link>
            <Link className="hover:underline">Submit</Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon" className="md:hidden" >
              <MenuIcon className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="mb-2">
            <SheetHeader>
              <SheetTitle>BetterNews</SheetTitle>
              <SheetDescription className="sr-only">Navigation</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col space-y-4">
              <Link className="hover:underline" to="/">Home</Link>
              <Link className="hover:underline" to="/new">New</Link>
              <Link className="hover:underline" to="/top">Top</Link>
              <Link className="hover:underline" to="/submit">Submit</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

    </header>
  )
}