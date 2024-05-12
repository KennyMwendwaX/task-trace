import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(5, { message: "Name must be greater than 5 characters long" })
    .max(20, { message: "Name must be less than 20 characters long" }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email address")
    .min(1, { message: "Required" }),
  emailVerified: z.date().nullable(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, { message: "Password must be greater than 8 characters long" })
    .refine((value) => !/\s/.test(value), "Invalid Password"),
  image: z.string().nullable(),
  createdAt: z.date(),
});

export const signupSchema = userSchema
  .omit({
    id: true,
    emailVerified: true,
    image: true,
    createdAt: true,
  })
  .extend({
    confirm_password: z.string({
      required_error: "Password confirmation is required",
      invalid_type_error: "Password confirmation must be a string",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const signinSchema = userSchema.omit({
  id: true,
  name: true,
  emailVerified: true,
  role: true,
  image: true,
  createdAt: true,
});

export type User = z.infer<typeof userSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type SigninValues = z.infer<typeof signinSchema>;
