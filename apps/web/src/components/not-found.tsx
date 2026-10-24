import ArrowLeft01Icon from "virtual:icons/hugeicons/arrow-left-01";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";

import { Link } from "@tanstack/react-router";

import { Button } from "./ui/button.tsx";

export function NotFound() {
	return (
		<section className="relative">
			<div className="container flex min-h-dvh flex-col items-center justify-center border-x bg-(--bg-white-0) py-32 lg:px-12">
				<div className="mx-auto text-center">
					<h1 className="text-h2 lg:text-h1 font-bold tracking-tight">
						404: Page Not Found
					</h1>

					<p className="lg:text-paragraph-lg mt-4 text-pretty text-(--text-sub-600)">
						Sorry, the page you are looking for could not be found.
					</p>

					<div className="mx-auto mt-12 grid max-w-xs gap-2">
						<Button
							asChild
							leadingIcon={ArrowLeft01Icon}
							leadingIconClassName="easy-out-in size-4 duration-300 group-hover:-translate-x-1"
						>
							<Link to="/">Go to Home</Link>
						</Button>
						<Button
							asChild
							$style="stroke"
							trailingIcon={ArrowRight01Icon}
							trailingIconClassName="easy-out-in size-4 duration-300 group-hover:translate-x-1"
						>
							<Link to="/login">Register</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
