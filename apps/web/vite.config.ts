import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
export default defineConfig({
	plugins: [
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
		viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackStart(),
		nitro({ preset: "node-server" }),
		viteReact(),
	],
});
