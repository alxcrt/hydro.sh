import Cancel01Icon from "virtual:icons/hugeicons/cancel-01";

import { toast } from "../ui/toast";

export function SupportToast({
	t,
	onSupport,
}: {
	t: string | number;
	onSupport: () => void;
}) {
	return (
		<div className="w-[360px] rounded-8 bg-(--bg-white-0) px-3.5 py-3 shadow-md ring-(--stroke-soft-200) ring-1 ring-inset">
			<div className="flex items-start gap-3">
				<div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] leading-none">
					💧
				</div>

				<div className="min-w-0 flex-1 space-y-1.5">
					<p className="text-(--text-strong-950) text-paragraph-sm">
						Hydro.sh is a solo project.{" "}
						<button
							type="button"
							onClick={() => {
								toast.dismiss(t);
								onSupport();
							}}
							className="font-medium text-(--color-blue-500) underline decoration-(--color-blue-200) underline-offset-2 transition-colors hover:text-(--color-blue-600) hover:decoration-(--color-blue-400)"
						>
							Consider supporting it
						</button>{" "}
						if you find it useful.
					</p>
					<p className="text-(--text-soft-400) text-paragraph-xs">
						<a
							href="https://github.com/alxcrt/hydro.sh"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 transition-colors hover:text-(--text-sub-600)"
						>
							<svg
								aria-hidden="true"
								className="size-3"
								viewBox="0 0 16 16"
								fill="currentColor"
							>
								<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
							</svg>
							Star on GitHub
						</a>
					</p>
				</div>

				<button
					type="button"
					onClick={() => toast.dismiss(t)}
					className="mt-0.5 shrink-0 text-(--text-soft-400) opacity-40 transition-opacity hover:opacity-100"
				>
					<Cancel01Icon className="size-4" />
				</button>
			</div>
		</div>
	);
}
