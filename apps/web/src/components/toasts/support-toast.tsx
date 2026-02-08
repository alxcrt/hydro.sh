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

				<div className="min-w-0 flex-1">
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
