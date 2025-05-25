// import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_home/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<HeroSection />
			{/* <FeaturesSection /> */}
		</>
	);
}
