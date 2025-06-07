import * as React from "react";
import {
	Input as AriaInput,
	getColorChannels,
	parseColor,
} from "react-aria-components";
import type { ColorSpace } from "react-aria-components";

import * as Button from "@/components/ui/button";
import * as ColorPicker from "@/components/ui/color-picker";
import * as Divider from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import * as Select from "@/components/ui/select";

// function EyeDropperButton() {
//   return (
//     <Button
//       $size="xs"
//       $variant="neutral"
//       $mode="stroke"
//       className="hover:[&:not(:focus-within)]:!ring-stroke-soft-200 rounded-r-none focus-visible:z-10"
//       asChild
//     >
//       <ColorPicker.EyeDropperButton>
//         {/* <Button.Icon as={RiSipLine} /> */}
//       </ColorPicker.EyeDropperButton>
//     </Button>
//   );
// }

const colorSwatches = [
	"#717784",
	"#335CFF",
	"#FF8447",
	"#FB3748",
	"#1FC16B",
	"#F6B51E",
	"#7D52F4",
	"#47C2FF",
];

export function ColorPickerDemo() {
	const [color, setColor] = React.useState(parseColor("hsl(228, 100%, 60%)"));
	const [space, setSpace] = React.useState<ColorSpace | "hex">("hsl");

	return (
		<div className="flex w-[272px] flex-col gap-3 rounded-2xl bg-bg-white-0 p-4 shadow-regular-md ring-1 ring-stroke-soft-200 ring-inset">
			<ColorPicker.Root value={color} onChange={setColor}>
				<ColorPicker.Area
					colorSpace="hsl"
					xChannel="saturation"
					yChannel="lightness"
				>
					<ColorPicker.Thumb className="ring-static-white" />
				</ColorPicker.Area>

				<ColorPicker.Slider colorSpace="hsl" channel="hue">
					<ColorPicker.SliderTrack>
						<ColorPicker.Thumb className="top-1/2" />
					</ColorPicker.SliderTrack>
				</ColorPicker.Slider>

				<ColorPicker.Slider colorSpace="hsl" channel="alpha">
					<ColorPicker.SliderTrack>
						<ColorPicker.Thumb className="top-1/2" />
					</ColorPicker.SliderTrack>
				</ColorPicker.Slider>

				<div className="flex flex-col items-start gap-1">
					<Select.Root
						value={space}
						onValueChange={(s) => setSpace(s as ColorSpace)}
						aria-label="Color Space"
						// variant="inline"
					>
						<Select.Trigger>
							<Select.Value />
						</Select.Trigger>
						<Select.Content aria-label="items">
							<Select.Item id="hex" value="hex">
								HEX
							</Select.Item>
							<Select.Item id="rgb" value="rgb">
								RGB
							</Select.Item>
							<Select.Item id="hsl" value="hsl">
								HSL
							</Select.Item>
							<Select.Item id="hsb" value="hsb">
								HSB
							</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
			</ColorPicker.Root>
		</div>
	);
}
