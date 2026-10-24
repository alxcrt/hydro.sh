import { Slot } from "radix-ui";

import type { PolymorphicComponentProps } from "@/utils/polymorphic.ts";
import { tv, type VariantProps } from "@/utils/tv.ts";

const BUTTON_ROOT_NAME = "ButtonRoot";
const BUTTON_ICON_NAME = "ButtonIcon";

export const buttonVariants = tv({
	slots: {
		root: [
			// base
			"group relative inline-flex items-center justify-center whitespace-nowrap outline-none",
			"transition duration-200 ease-out",
			// focus
			"focus:outline-none",
			// disabled
			"disabled:pointer-events-none disabled:bg-(--bg-weak-50) disabled:text-(--text-disabled-300) disabled:ring-transparent",
		],
		icon: [
			// base
			"flex size-5 shrink-0 items-center justify-center",
		],
	},
	variants: {
		$type: {
			primary: {},
			neutral: {},
			error: {},
		},
		$style: {
			filled: {},
			stroke: {
				root: "ring-1 ring-inset",
			},
			lighter: {
				root: "ring-1 ring-inset",
			},
			ghost: {
				root: "ring-1 ring-inset",
			},
		},
		$size: {
			none: {
				root: "",
				icon: "-mx-1",
			},
			xxs: {
				root: "rounded-8 text-label-sm h-7 gap-2.5 px-2",
				icon: "-mx-1",
			},
			xs: {
				root: "rounded-8 text-label-sm h-8 gap-2.5 px-2.5",
				icon: "-mx-1",
			},
			sm: {
				root: "rounded-8 text-label-sm h-9 gap-3 px-3",
				icon: "-mx-1",
			},
			md: {
				root: "rounded-10 text-label-sm h-10 gap-3 px-3.5",
				icon: "-mx-1",
			},
		},
	},
	compoundVariants: [
		//#region variant=primary
		{
			$type: "primary",
			$style: "filled",
			class: {
				root: [
					// base
					"bg-primary text-white",
					// hover
					"hover:bg-primary-darker",
					// focus
					"focus-visible:shadow-button-primary-focus",
				],
			},
		},
		{
			$type: "primary",
			$style: "stroke",
			class: {
				root: [
					// base
					"text-primary ring-primary bg-(--bg-white-0)",
					// hover
					"hover:bg-primary-lightest hover:ring-transparent",
					// focus
					"focus-visible:shadow-button-primary-focus",
				],
			},
		},
		{
			$type: "primary",
			$style: "lighter",
			class: {
				root: [
					// base
					"bg-primary-lightest text-primary ring-transparent",
					// hover
					"hover:ring-primary hover:bg-(--bg-white-0)",
					// focus
					"focus-visible:shadow-button-primary-focus focus-visible:ring-primary focus-visible:bg-(--bg-white-0)",
				],
			},
		},
		{
			$type: "primary",
			$style: "ghost",
			class: {
				root: [
					// base
					"text-primary bg-transparent ring-transparent",
					// hover
					"hover:bg-primary-lightest",
					// focus
					"focus-visible:shadow-button-primary-focus focus-visible:ring-primary focus-visible:bg-(--bg-white-0)",
				],
			},
		},
		//#endregion

		//#region variant=neutral
		{
			$type: "neutral",
			$style: "filled",
			class: {
				root: [
					// base
					"bg-(--bg-strong-950) text-(--text-white-0)",
					// hover
					"hover:bg-(--bg-surface-800)",
					// focus
					"focus-visible:shadow-button-important-focus",
				],
			},
		},
		{
			$type: "neutral",
			$style: "stroke",
			class: {
				root: [
					// base
					"shadow-regular-xs bg-(--bg-white-0) text-(--text-sub-600) ring-(--stroke-soft-200)",
					// hover
					"hover:bg-(--bg-weak-50) hover:text-(--text-strong-950) hover:shadow-none hover:ring-transparent",
					// focus
					"focus-visible:shadow-button-important-focus focus-visible:text-(--text-strong-950) focus-visible:ring-(--stroke-strong-950)",
				],
			},
		},
		{
			$type: "neutral",
			$style: "lighter",
			class: {
				root: [
					// base
					"bg-(--bg-weak-50) text-(--text-sub-600) ring-transparent",
					// hover
					"hover:shadow-regular-xs hover:bg-(--bg-white-0) hover:text-(--text-strong-950) hover:ring-(--stroke-soft-200)",
					// focus
					"focus-visible:shadow-button-important-focus focus-visible:bg-(--bg-white-0) focus-visible:text-(--text-strong-950) focus-visible:ring-(--stroke-strong-950)",
				],
			},
		},
		{
			$type: "neutral",
			$style: "ghost",
			class: {
				root: [
					// base
					"bg-transparent text-(--text-sub-600) ring-transparent",
					// hover
					"hover:bg-(--bg-weak-50) hover:text-(--text-strong-950)",
					// focus
					"focus-visible:shadow-button-important-focus focus-visible:bg-(--bg-white-0) focus-visible:text-(--text-strong-950) focus-visible:ring-(--stroke-strong-950)",
				],
			},
		},
		//#endregion

		//#region variant=error
		{
			$type: "error",
			$style: "filled",
			class: {
				root: [
					// base
					"bg-state-error-base text-white",
					// hover
					"hover:bg-red-700",
					// focus
					"focus-visible:shadow-button-error-focus",
				],
			},
		},
		{
			$type: "error",
			$style: "stroke",
			class: {
				root: [
					// base
					"text-state-error-base ring-state-error-base bg-(--bg-white-0)",
					// hover
					"hover:bg-red-alpha-10 hover:ring-transparent",
					// focus
					"focus-visible:shadow-button-error-focus",
				],
			},
		},
		{
			$type: "error",
			$style: "lighter",
			class: {
				root: [
					// base
					"bg-red-alpha-10 text-state-error-base ring-transparent",
					// hover
					"hover:ring-state-error-base hover:bg-(--bg-white-0)",
					// focus
					"focus-visible:shadow-button-error-focus focus-visible:ring-state-error-base focus-visible:bg-(--bg-white-0)",
				],
			},
		},
		{
			$type: "error",
			$style: "ghost",
			class: {
				root: [
					// base
					"text-state-error-base bg-transparent ring-transparent",
					// hover
					"hover:bg-red-alpha-10",
					// focus
					"focus-visible:shadow-button-error-focus focus-visible:ring-state-error-base focus-visible:bg-(--bg-white-0)",
				],
			},
		},
		//#endregion
	],
	defaultVariants: {
		$type: "primary",
		$style: "filled",
		$size: "md",
	},
});

type ButtonSharedProps = VariantProps<typeof buttonVariants>;

export type ButtonRootProps = VariantProps<typeof buttonVariants> &
	React.ComponentPropsWithRef<"button"> & {
		asChild?: boolean;
	};

function ButtonRoot({
	children,
	$type,
	$style,
	$size,
	asChild,
	className,
	...rest
}: ButtonRootProps) {
	const Component = asChild ? Slot.Root : "button";
	const { root } = buttonVariants({ $type, $style, $size });

	return (
		<Component className={root({ class: className })} type="button" {...rest}>
			{children}
		</Component>
	);
}
ButtonRoot.displayName = BUTTON_ROOT_NAME;

function ButtonIcon<T extends React.ElementType>({
	$type,
	$style,
	$size,
	as,
	className,
	...rest
}: PolymorphicComponentProps<T, ButtonSharedProps>) {
	const Component = as || "div";
	const { icon } = buttonVariants({ $type, $style, $size });

	return <Component className={icon({ class: className })} {...rest} />;
}
ButtonIcon.displayName = BUTTON_ICON_NAME;

export { ButtonIcon as Icon, ButtonRoot as Root };
