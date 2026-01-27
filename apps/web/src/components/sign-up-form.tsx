import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const { isPending } = authClient.useSession();
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onSuccess: () => {
						toast.success(
							"Account created! Please check your email to verify your account.",
							{
								duration: 6000,
							},
						);
						onSwitchToSignIn();
					},
					onError: (error) => {
						toast.error(error.error.message);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				email: z.string().email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	// Only show loader after mount to prevent hydration mismatch
	// Server renders the form, client should initially match that
	if (hasMounted && isPending) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader />
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="mb-6">
				<h1 className="text-label-xl text-neutral-950">Create account</h1>
				<p className="mt-1 text-neutral-500 text-paragraph-sm">
					Start tracking your hydration
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					void form.handleSubmit();
				}}
				className="space-y-3"
			>
				<form.Field name="name">
					{(field) => (
						<div className="space-y-1">
							<Input
								id={field.name}
								name={field.name}
								placeholder="Name"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="w-full"
							/>
							{field.state.meta.errors.map((error) => (
								<p
									key={error?.message}
									className="text-paragraph-xs text-red-500"
								>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="email">
					{(field) => (
						<div className="space-y-1">
							<Input
								id={field.name}
								name={field.name}
								type="email"
								placeholder="Email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="w-full"
							/>
							{field.state.meta.errors.map((error) => (
								<p
									key={error?.message}
									className="text-paragraph-xs text-red-500"
								>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="password">
					{(field) => (
						<div className="space-y-1">
							<Input
								id={field.name}
								name={field.name}
								type="password"
								placeholder="Password"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="w-full"
							/>
							{field.state.meta.errors.map((error) => (
								<p
									key={error?.message}
									className="text-paragraph-xs text-red-500"
								>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Subscribe>
					{(state) => (
						<Button
							type="submit"
							$type="primary"
							$style="filled"
							className="w-full"
							disabled={!state.canSubmit || state.isSubmitting}
						>
							{state.isSubmitting ? "Creating account..." : "Create account"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="relative my-5">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-neutral-200 border-t" />
				</div>
				<div className="relative flex justify-center">
					<span className="bg-neutral-50 px-3 text-neutral-400 text-paragraph-xs">
						or
					</span>
				</div>
			</div>

			<button
				type="button"
				onClick={() => {
					authClient.signIn.social({
						provider: "google",
						callbackURL: `${window.location.origin}/dashboard`,
					});
				}}
				className="group flex w-full items-center justify-center gap-2.5 rounded-10 border border-neutral-200 bg-white px-4 py-2.5 text-label-sm text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50"
			>
				<svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						fill="#FBBC05"
					/>
					<path
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						fill="#EA4335"
					/>
				</svg>
				Continue with Google
			</button>

			<p className="mt-6 text-center text-neutral-500 text-paragraph-sm">
				Already have an account?{" "}
				<button
					type="button"
					onClick={onSwitchToSignIn}
					className="font-medium text-primary hover:underline"
				>
					Sign in
				</button>
			</p>
		</div>
	);
}
