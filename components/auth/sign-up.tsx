"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { signUp } from "@/auth/client";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { convertImageToBase64 } from "@/lib/utils";
import { SocialProviders } from "./social-login";

const MAX_FILE_SIZE = 5000000; // 5 MB

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = [
  "image/gif",
  "image/jpeg",
  // "image/jpg",
  "image/png",
  "image/webp",
];

// This is a file validation with a few extra checks in the `superRefine`.
// The `refine` method could also be used, but `superRefine` offers better
// control over when the errors are added and can include specific information
// about the value being parsed.

export const SignUpSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z
      .string({ required_error: "email-required" })
      .min(1, { message: "Email is required." })
      .email({
        message: "Not a valid email.",
      }),
    password: z
      .string({ required_error: "password-required" })
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string({ required_error: "confirmPassword-required" })
      .min(8, { message: "Password must be at least 8 characters." }),
    image: z
      .union([
        z.instanceof(File).superRefine((f, ctx) => {
          if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                ", "
              )}] but was ${f.type}.`,
            });
            return false;
          }
          if (f.size > MAX_FILE_SIZE) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              type: "array",
              message: `The file must not be larger than ${
                MAX_FILE_SIZE / 1000000
              } MB: ${f.size}.`,
              maximum: MAX_FILE_SIZE,
              inclusive: true,
            });
            return false;
          }
          return true;
        }),
        z.string().regex(/^data:image\/(png|jpg|jpeg|gif|webp);base64,/),
        z.literal(""),
      ])
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof SignUpSchema>;

export function SignUp() {
  const [preview, setPreview] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof SignUpSchema>) {
    // const formData = {
    //   ...data,
    //   image: base64 ?? null,
    // };

    // toast.message("You submitted the following values:", {
    //   description: (
    //     <pre className="w-full rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });

    await signUp.email({
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`,
      image: data.image as string,
      callbackURL: "/dashboard",
      fetchOptions: {
        onResponse: () => {
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onError: (ctx) => {
          toast({
            title: "Error",
            description: ctx.error.message,
            variant: "destructive",
          });
        },
      },
    });
  }

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...signUpForm}>
            <form
              onSubmit={signUpForm.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={signUpForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input id="firstName" placeholder="Max" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          id="lastName"
                          placeholder="Robinson"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        id="password"
                        autoComplete="new-password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={signUpForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        id="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Profile Image */}
              <FormField
                control={signUpForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image (optional)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        {preview && (
                          <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                            <Image
                              src={preview}
                              alt="Profile preview"
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <Input
                            key={resetKey}
                            type="file"
                            accept={ACCEPTED_MIME_TYPES.join(",")}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const base64 = await convertImageToBase64(
                                    file
                                  );
                                  field.onChange(base64);
                                  setPreview(base64);
                                } catch (error) {
                                  console.error(
                                    "Failed to convert image",
                                    error
                                  );
                                  toast({
                                    title: "Error",
                                    description:
                                      "Failed to process image. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              }
                            }}
                          />
                        </div>
                        {preview && (
                          <X
                            className="cursor-pointer"
                            onClick={() => {
                              field.onChange(null);
                              setPreview(null);
                              setResetKey((prev) => prev + 1);
                            }}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Create an account"
                )}
              </Button>
            </form>
          </Form>
          <SocialProviders />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            Secured by <span className="text-orange-400">better-auth.</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
