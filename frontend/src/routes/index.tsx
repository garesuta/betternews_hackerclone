import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  throw new Error("Test error");
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button>Click me</Button>
    </div>
  );
}
