import { Icons } from "@/components/icons.tsx";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import * as React from "react";

import { cn } from "@/utils/cn.ts";
import * as Table from "../ui/table.tsx";

type WaterIntakeHistoryType = {
	id: string | number;
	amount: string;
	timestamp: Date;
	// source: "bottle" | "manual";
	source: string;
	bottleId?: string;
	bottleBrand?: string;
};

type WaterIntakeHistoryTableProps = {
	data: Array<WaterIntakeHistoryType>;
	total: number;
};
const columns: ColumnDef<WaterIntakeHistoryType>[] = [
	{
		header: "Amount",
		accessorKey: "amount",
		accessorFn: (row) => row.amount,
		cell({ row }) {
			return (
				<div className="flex items-center gap-2">
					{row.original.source === "bottle" ? (
						<Icons.bluetooth className="inline h-8 w-8" />
					) : (
						<Icons.waterDroplet className="inline h-8 w-8" />
					)}
					<div className="flex flex-col justify-center sm:flex-row sm:items-center sm:gap-2">
						<span className="font-medium">{row.original.amount}ml</span>
						<span className="text-neutral-500 text-paragraph-xs">
							({row.original.bottleBrand})
						</span>
					</div>
				</div>
			);
		},
	},
	{
		header: "Time",
		accessorKey: "timestamp",
		accessorFn: (row) => row.timestamp,
		cell({ row }) {
			const timestamp = row.original.timestamp;
			const date = new Date(timestamp);
			const formattedTime = format(date, "h:mm a");
			const timeAgo = formatDistanceToNow(date, { addSuffix: true });

			return (
				<div className="text-neutral-500 text-paragraph-sm">
					<span className="font-mono">{formattedTime}</span>
					<span className="opacity-60"> • </span>
					<span>{timeAgo}</span>
				</div>
			);
		},
	},
];

export function WaterIntakeHistoryTable({
	data,
	total,
}: WaterIntakeHistoryTableProps) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		rowCount: total,
	});

	return (
		<Table.Root className="-mx-4 w-auto px-4 lg:mx-0 lg:w-full lg:px-0">
			<div className="px-4 py-2 ">
				<h3 className="font-semibold text-paragraph-lg">
					📝 Today's Log (Last 5)
				</h3>
			</div>

			<Table.Body>
				{table.getRowModel().rows?.length > 0 ? (
					table.getRowModel().rows.map((row, i, arr) => (
						<React.Fragment key={row.id}>
							<Table.Row data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell, cellIdx, cellsArr) => (
									<Table.Cell
										key={cell.id}
										className={cn(
											"h-12",
											// Center the last column
											cellIdx === cellsArr.length - 1 && "text-right",
											(cell.column.columnDef.meta as { className?: string })
												?.className,
										)}
										style={{
											width: cell.column.getSize(),
										}}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</Table.Cell>
								))}
							</Table.Row>
							{i < arr.length - 1 && <Table.RowDivider />}
						</React.Fragment>
					))
				) : (
					<Table.Row>
						<Table.Cell
							colSpan={columns.length}
							className="py-8 text-center text-neutral-500"
						>
							No water intake history yet.
						</Table.Cell>
					</Table.Row>
				)}
			</Table.Body>
		</Table.Root>
	);
}
