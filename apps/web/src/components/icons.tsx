import SodaIcon from "virtual:icons/hugeicons/soda-can-stroke-rounded";

export const Icons = {
	soda: SodaIcon,
	bluetooth: (props: React.SVGProps<SVGSVGElement>) => (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={24}
			height={24}
			color={props.color || "#338AFF"}
			fill="none"
			{...props}
		>
			<path
				d="M11.9994 12V6.66586C11.9994 4.80386 11.9994 3.87286 12.5847 3.578C13.17 3.28313 13.9092 3.84173 15.3877 4.95893L16.0935 5.49234C17.1288 6.27468 17.6465 6.66586 17.6465 7.19927C17.6465 7.73268 17.1288 8.12386 16.0935 8.9062L11.9994 12ZM11.9994 12V17.3341C11.9994 19.1961 11.9994 20.1271 12.5847 20.422C13.17 20.7169 13.9092 20.1583 15.3877 19.0411L16.0935 18.5077C17.1288 17.7253 17.6465 17.3341 17.6465 16.8007C17.6465 16.2673 17.1288 15.8761 16.0935 15.0938L11.9994 12ZM11.9994 12L5.64648 7.19927M11.9994 12L5.64648 16.8007"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M18.9998 12H19.0088"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4.99981 12H5.00879"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	waterDroplet: (props: React.SVGProps<SVGSVGElement>) => (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={24}
			height={24}
			color={props.color || "#7ed321"}
			fill="none"
			{...props}
		>
			<path
				d="M3.5 13.678C3.5 9.49387 7.08079 5.35907 9.59413 2.97222C10.9591 1.67593 13.0409 1.67593 14.4059 2.97222C16.9192 5.35907 20.5 9.49387 20.5 13.678C20.5 17.7804 17.2812 22 12 22C6.71878 22 3.5 17.7804 3.5 13.678Z"
				stroke={props.color || "#7ed321"}
				strokeWidth="1.5"
			/>
			<path
				d="M16 14C16 16.2091 14.2091 18 12 18"
				stroke={props.color || "#7ed321"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	sync: (props: React.SVGProps<SVGSVGElement>) => (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={24}
			height={24}
			color={props.color || "#338AFF"}
			fill="none"
			{...props}
		>
			<path
				d="M20.5 5.5H9.5C5.78672 5.5 3 8.18503 3 12"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M3.5 18.5H14.5C18.2133 18.5 21 15.815 21 12"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M18.5 3C18.5 3 21 4.84122 21 5.50002C21 6.15882 18.5 8 18.5 8"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M5.49998 16C5.49998 16 3.00001 17.8412 3 18.5C2.99999 19.1588 5.5 21 5.5 21"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	syncAll: (props: React.SVGProps<SVGSVGElement>) => (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={24}
			height={24}
			color={props.color || "#338AFF"}
			fill="none"
			{...props}
		>
			<path
				d="M19 9H6.65856C5.65277 9 5.14987 9 5.02472 8.69134C4.89957 8.38268 5.25517 8.01942 5.96637 7.29289L8.21091 5"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M5 15H17.3414C18.3472 15 18.8501 15 18.9753 15.3087C19.1004 15.6173 18.7448 15.9806 18.0336 16.7071L15.7891 19"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	plus: (props: React.SVGProps<SVGSVGElement>) => (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={24}
			height={24}
			color={props.color || "#338AFF"}
			fill="none"
			{...props}
		>
			<path
				d="M12 5V19M5 12H19"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	minus: (props: React.SVGProps<SVGSVGElement>) => (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={24}
			height={24}
			color={props.color || "#338AFF"}
			fill="none"
			{...props}
		>
			<path
				d="M5 12H19"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	bottle: (props: React.SVGProps<SVGSVGElement>) => (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={24}
			height={24}
			color={props.color || "#338AFF"}
			fill="none"
			{...props}
		>
			<path
				d="M9 3H15V7C15 7 17 8 17 10L16 20C16 21 15 21 14 21H10C9 21 8 21 8 20L7 10C7 8 9 7 9 7V3Z"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M9 11H15"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M9 14H15"
				stroke={props.color || "#338AFF"}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	),
};
