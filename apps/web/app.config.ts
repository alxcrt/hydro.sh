import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import Icons from "unplugin-icons/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	// Server configuration
	// Uses the "node-server" preset for the application server setup
	server: {
		preset: "node-server",
	},
	// TSR (TanStack Router) configuration
	// Specifies that the application code is located in the "src" directory
	tsr: {
		appDirectory: "src",
	},
	// Vite bundler configuration
	// Define the plugins used for building and developing the application
	vite: {
		plugins: [
			/*
			 * The Icons plugin from unplugin-icons converts SVG icons into React components.
			 * Configuration:
			 * - compiler/jsx: Set to compile icons as React JSX components
			 * - autoInstall: Automatically install dependencies when needed
			 * - customCollections: Defines a custom icon collection named "hugeicons"
			 *   that loads SVG files from "./public/icons/hugeicons" directory
			 * - iconCustomizer: A function that modifies each icon's properties:
			 *   - Sets width and height to "1em" to make icons scale with text
			 *   - Adds "data-slot='icon'" attribute which helps with component composition
			 *     (used in UI components like buttons, selects, modals, etc.)
			 */
			Icons({
				compiler: "jsx",
				jsx: "react",
				autoInstall: true,
				customCollections: {
					hugeicons: FileSystemIconLoader("./public/icons/hugeicons"),
				},
				iconCustomizer(_collection, _icon, props) {
					props.width = "1em";
					props.height = "1em";
					props["data-slot"] = "icon";
				},
			}),
			viteTsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
			tailwindcss(),
		],
	},
});
