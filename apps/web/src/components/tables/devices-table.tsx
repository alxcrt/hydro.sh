import MoreVerticalIcon from "virtual:icons/hugeicons/more-vertical";

import {
	type CellContext,
	type ColumnDef,
	flexRender,
	type StockFeatures,
	stockFeatures,
	useTable,
} from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import * as React from "react";
import * as DropdownMenu from "../ui/dropdown-menu.tsx";

// import { ColorPicker } from "../ui/color-picker.tsx";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useORPC } from "@/hooks/use-orpc.ts";
import { cn } from "@/utils/cn.ts";
import { Button } from "../ui/button.tsx";
import * as Table from "../ui/table.tsx";

type DeviceDataType = {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	bluetoothName: string;
	deviceIdentifier: string;
	lastConnected: Date | null;
};

type DevicesTableProps = {
	data: Array<DeviceDataType>;
	total: number;
};

function DeviceActionsCell({
	row,
}: CellContext<StockFeatures, DeviceDataType>) {
	const orpc = useORPC();
	const { mutateAsync: deleteDevice } = useMutation(
		orpc.devices.delete.mutationOptions(),
	);
	const queryClient = useQueryClient();

	return (
		<DropdownMenu.Root modal={false}>
			<DropdownMenu.Trigger asChild>
				<Button
					$size="xs"
					$style="ghost"
					$type="neutral"
					leadingIcon={MoreVerticalIcon}
					leadingIconClassName="size-6"
				>
					<span className="sr-only">Actions</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{/* <DropdownMenu.Item>
              <DropdownMenu.ItemIcon as={ColorPaletteIcon} />
              Color
              <ColorPicker
                className="ml-2"
                onColorChange={(color) => {
                  console.log(
                    `Setting color for device ${row.original.id} to ${color}`
                  );
                }}
              />
            </DropdownMenu.Item> */}

				<DropdownMenu.Item
					onClick={() => {
						deleteDevice({ id: row.original.id }).then(() => {
							queryClient.invalidateQueries({
								queryKey: orpc.devices.list.queryOptions().queryKey,
							});
						});
					}}
				>
					{/* <DropdownMenu.ItemIcon as={TrashIcon} /> */}
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}

const columns: ColumnDef<StockFeatures, DeviceDataType>[] = [
	{
		header: "Name",
		accessorKey: "name",
		accessorFn: (row) => row.name,
		cell({ row }) {
			return (
				<div className="text-paragraph-sm text-(--text-sub-600)">
					{row.original.name}
				</div>
			);
		},
	},
	{
		header: "Bluetooth Name",
		accessorKey: "bluetoothName",
		accessorFn: (row) => row.bluetoothName,
		cell({ row }) {
			return (
				<div className="text-paragraph-sm text-(--text-sub-600)">
					{row.original.bluetoothName || "N/A"}
				</div>
			);
		},
	},
	{
		header: "Device Identifier",
		accessorKey: "deviceIdentifier",
		accessorFn: (row) => row.deviceIdentifier,
		cell({ row }) {
			return (
				<div className="text-paragraph-sm text-(--text-sub-600)">
					{row.original.deviceIdentifier}
				</div>
			);
		},
	},
	{
		header: "Last Connected",
		accessorKey: "lastConnected",
		accessorFn: (row) => row.lastConnected,
		cell({ row }) {
			return (
				<div className="text-paragraph-sm text-(--text-sub-600)">
					{row.original.lastConnected
						? formatDistanceToNow(row.original.lastConnected, {
								addSuffix: true,
							})
						: "N/A"}
				</div>
			);
		},
	},
	{
		header: "Created at",
		accessorKey: "createdAt",
		accessorFn: (row) => row.createdAt,
		cell({ row }) {
			return (
				<div className="text-paragraph-sm text-(--text-sub-600)">
					{row.original.createdAt
						? format(row.original.createdAt, "MMM d, yyyy")
						: "N/A"}
				</div>
			);
		},
	},
	{
		header: "Updated at",
		accessorKey: "updatedAt",
		accessorFn: (row) => row.updatedAt,
		cell({ row }) {
			return (
				<div className="text-paragraph-sm text-(--text-sub-600)">
					{row.original.updatedAt
						? format(row.original.updatedAt, "MMM d, yyyy")
						: "N/A"}
				</div>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: DeviceActionsCell,
		size: 76,
		meta: {
			className: "px-4",
		},
	},
];

export function DevicesTable({ data, total }: DevicesTableProps) {
	const table = useTable({
		data,
		columns,
		features: stockFeatures,
		rowCount: total,
	});

	return (
		<Table.Root className="-mx-4 w-auto px-4 lg:mx-0 lg:w-full lg:px-0">
			<Table.Header>
				{table.getHeaderGroups().map((headerGroup) => (
					<Table.Row key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							return (
								<Table.Head
									key={header.id}
									className={
										(header.column.columnDef.meta as { className?: string })
											?.className
									}
									id={header.id}
									colSpan={header.colSpan}
									style={{
										width: header.column.getSize(),
									}}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</Table.Head>
							);
						})}
					</Table.Row>
				))}
			</Table.Header>

			<Table.Body>
				{table.getRowModel().rows?.length > 0 &&
					table.getRowModel().rows.map((row, i, arr) => (
						<React.Fragment key={row.id}>
							<Table.Row data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<Table.Cell
										key={cell.id}
										className={cn(
											"h-12",
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
					))}
			</Table.Body>
		</Table.Root>
	);
}
