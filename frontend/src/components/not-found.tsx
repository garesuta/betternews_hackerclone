import { Link, NotFoundRouteProps } from "@tanstack/react-router";
import { Button } from "./ui/button";


export default function NotFound(props: NotFoundRouteProps) {
  return (
    <div className="flex size-full items-center justify-center p-2 text-xl">
      <div className="flex flex-col items-center gap-4">
        <p className="text-4xl font-bold">404</p>
        <p className="text-lg">Page not Found</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}