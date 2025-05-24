import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto flex-1 px-5">
			<div className="mt-48 flex flex-col items-center">
				<h1 className="max-w-3xl text-balance text-center text-text-strong-950 text-title-h3">
					Quick Starter AlignUI Template with Next.js & Typescript
				</h1>

				<div className="mt-6 flex gap-4">
					<Button asChild>
						<a href="https://github.com/alignui/alignui-nextjs-typescript-starter">
							Give a star
						</a>
					</Button>

					<Button asChild>
						<a href="https://alignui.com/docs">Read our docs</a>
					</Button>
				</div>

				<div className="mt-12">
					<h2 className="font-semibold text-lg text-text-primary">
						What&apos;s Included:
					</h2>
					<ul className="mt-3 ml-6 flex list-disc flex-col gap-2 font-medium font-mono text-paragraph-sm text-text-sub-600">
						<li>Tailwind setup with AlignUI tokens.</li>
						<li>
							Base components are stored in{" "}
							<code className="rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950">
								/components/ui
							</code>{" "}
							folder.
						</li>
						<li>
							Utils are stored in{" "}
							<code className="rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950">
								/utils
							</code>{" "}
							folder.
						</li>
						<li>
							Custom hooks are stored in{" "}
							<code className="rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950">
								/hooks
							</code>{" "}
							folder.
						</li>
						<li>Dark mode setup.</li>
						<li>Inter font setup.</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
