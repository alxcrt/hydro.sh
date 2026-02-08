import { publicProcedure } from "@/lib/orpc";
import { stripe } from "@/lib/stripe";
import { env } from "@/utils/env";
import { CreateDonationSchema } from "@hydro.sh/schemas/donation";

export const stripeRouter = {
	createCheckoutSession: publicProcedure
		.input(CreateDonationSchema)
		.handler(async ({ input }) => {
			try {
				const session = await stripe.checkout.sessions.create({
					mode: "payment",
					line_items: [
						{
							price_data: {
								currency: "usd",
								product_data: {
									name: "Support Hydro.sh",
								},
								unit_amount: input.amount,
							},
							quantity: 1,
						},
					],
					success_url: `${env.CORS_ORIGIN}/donate-success`,
					cancel_url: `${env.CORS_ORIGIN}/donate-cancel`,
					metadata: {
						message: input.message ?? "",
					},
				});
				if (!session.url) {
					throw new Error("Stripe did not return a checkout URL");
				}
				return { url: session.url };
			} catch (error) {
				console.error(error);
				throw new Error("Failed to create checkout session");
			}
		}),
};
