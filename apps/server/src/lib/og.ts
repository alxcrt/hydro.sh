import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

export async function generateOGImage() {
	const [fontRegular, fontBold] = await Promise.all([
		fetch(
			"https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOM4nQ.ttf",
		).then((res) => res.arrayBuffer()),
		fetch(
			"https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_Re-Q4nQ.ttf",
		).then((res) => res.arrayBuffer()),
	]);

	const markup = {
		type: "div",
		props: {
			style: {
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#eff6ff",
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 100,
							height: 100,
							borderRadius: 24,
							background: "linear-gradient(135deg, #c084fc, #60a5fa, #22d3ee)",
							marginBottom: 32,
						},
						children: {
							type: "svg",
							props: {
								width: 48,
								height: 60,
								viewBox: "0 0 24 36",
								children: {
									type: "path",
									props: {
										d: "M12 0C12 0 0 14 0 24C0 30.627 5.373 36 12 36C18.627 36 24 30.627 24 24C24 14 12 0 12 0Z",
										fill: "white",
									},
								},
							},
						},
					},
				},
				{
					type: "div",
					props: {
						style: {
							fontSize: 64,
							fontWeight: 700,
							color: "#0f172a",
							letterSpacing: "-0.02em",
						},
						children: "hydro.sh",
					},
				},
				{
					type: "div",
					props: {
						style: {
							fontSize: 28,
							color: "#64748b",
							marginTop: 16,
						},
						children: "Track your hydration, effortlessly.",
					},
				},
			],
		},
	};

	const svg = await satori(markup as React.ReactNode, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: "Geist",
				data: fontRegular,
				weight: 400,
				style: "normal",
			},
			{
				name: "Geist",
				data: fontBold,
				weight: 700,
				style: "normal",
			},
		],
	});

	const resvg = new Resvg(svg, {
		fitTo: { mode: "width", value: 1200 },
	});

	return resvg.render().asPng();
}
