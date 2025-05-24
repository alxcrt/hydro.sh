import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
	const navigate = useNavigate();
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
