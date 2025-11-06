import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { loginSchema } from "@/shared/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FieldInfo } from "@/components/field-info";
import { Button } from "@/components/ui/button";
import { postLogin, userQueryOptions } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const loginSearchSchema = z.object({
  redirect: z.string().optional().default("/"),
});

export const Route = createFileRoute("/login")({
  component: () => <Login />,
  validateSearch: zodSearchValidator(loginSearchSchema),
  beforeLoad: async ({ context, search }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());
    if (user) {
      throw redirect({ to: search.redirect });
    }
  },
});

function Login() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await postLogin(value.username, value.password);
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        router.invalidate();
        await navigate({
          to: search.redirect,
        });
        return null;
      } else {
        if (!res.isFormError) {
          toast.error("Login failed", { description: res.error });
        }
        return {
          form: res.isFormError ? res.error : "Unexpected error",
        };
      }
    },
  });

  return (
    <div className="w-full">
      <Card className="mx-auto mt-12 max-w-sm border-border/25">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your details below to login.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4">
              <form.Field name="username">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Username</Label>
                    <input
                      className="border border-gray-200 rounded-sm"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Password</Label>
                    <input
                      type="password"
                      className="border border-gray-200 rounded-sm"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
              <form.Subscribe selector={(state) => [state.errorMap.onSubmit]}>
                {([submitError]) =>
                  submitError ? (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {submitError}
                    </p>
                  ) : null
                }
              </form.Subscribe>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full"
                  >
                    {isSubmitting ? "..." : "Login"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
            <div className="mt-4 text-center text-sm">
              {" "}
              Dont have an account ?
              <Link to="/signup" search={{}} className="underline">
                Signup
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
