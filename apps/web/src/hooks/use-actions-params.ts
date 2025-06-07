import { parseAsStringLiteral, useQueryStates } from "nuqs";

export function useActionsParams() {
	const [params, setParams] = useQueryStates({
		action: parseAsStringLiteral(["add"]),
		resource: parseAsStringLiteral(["device"]),
	});

	return {
		...params,
		setParams,
	};
}
