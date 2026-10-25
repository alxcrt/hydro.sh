import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="h-9 w-24" />;
	}

	if (!session) {
		return (
			<Button asChild>
				<Link to="/login">Sign In</Link>
			</Button>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<span className="font-medium">{session.user.name}</span>
			<Button
				onClick={() => {
					authClient.signOut({
						fetchOptions: {
							onSuccess: () => {
								queryClient.clear();
								navigate({
									to: "/",
								});
							},
						},
					});
				}}
			>
				Sign Out
			</Button>
		</div>
	);
}
