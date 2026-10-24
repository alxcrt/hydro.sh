import { z } from "zod";

export const EmailSchema = z
	.string({
		error: (issue) =>
			issue.input === undefined ? "Email is required" : undefined,
	})
	.email({
		message: "Invalid email address",
	});

export const NewPasswordSchema = z
	.string({
		error: (issue) =>
			issue.input === undefined ? "Password is required" : undefined,
	})
	.min(8, {
		message: "Password must be at least 8 characters long",
	})
	.refine((password) => /[A-Z]/.test(password), {
		message: "Password must contain at least one uppercase letter",
	})
	.refine((password) => /[a-z]/.test(password), {
		message: "Password must contain at least one lowercase letter",
	})
	.refine((password) => /[0-9]/.test(password), {
		message: "Password must contain at least one number",
	})
	.refine((password) => /[.!@#$%^&*]/.test(password), {
		message: "Password must contain at least one special character (.!@#$%^&*)",
	});
