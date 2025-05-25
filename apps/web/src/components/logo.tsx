export function Logo(props: React.ComponentProps<"img">) {
	return (
		<img
			src="/logo.png"
			width={240}
			height={240}
			{...props}
			alt={props.alt ?? "Logo"}
		/>
	);
}
