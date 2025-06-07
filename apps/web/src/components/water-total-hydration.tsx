import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type React from "react";
import { useState } from "react";

interface WaterTotalHydrationProps {
	currentAmount?: number;
	goalAmount?: number;
	connectedBottles?: number;
	lastSyncStatus?: string;
	bottleDetails?: Array<{
		name: string;
		brand: string;
	}>;
	batteryLevel?: number;
}

export function WaterTotalHydration({
	currentAmount = 0,
	goalAmount = 2500,
	connectedBottles = 1,
	lastSyncStatus = "Last global sync attempt status can be seen in settings.",
	bottleDetails = [{ name: "Generic Bottle #1", brand: "Generic Bottle" }],
	batteryLevel = 96,
}: WaterTotalHydrationProps) {
	const percentCompleted =
		Math.min(100, Math.round((currentAmount / goalAmount) * 100)) || 0;

	return (
		<div className="w-full space-y-2 rounded-8 bg-state-faded-lighter px-2.5 py-2 text-(--text-strong-950) ">
			<h2 className="font-semibold text-paragraph-lg">💧 Total Hydration</h2>
			<p className="mb-2 text-(--text-sub-600) text-paragraph-sm">
				Track your daily water intake from all sources.
				{/* {bottleDetails.map((bottle, i) => (
          <span key={i}>
            {" "}
            {bottle.name} ({bottle.brand})
          </span>
        ))} */}
			</p>

			<div className="relative my-8 flex justify-center">
				<div className="inline-flex h-40 w-40 items-center justify-center rounded-full border-4 border-blue-200">
					<div className="text-center">
						<p className="font-bold text-3xl">{currentAmount}ml</p>
						<p className="text-muted-foreground text-sm">of {goalAmount}ml</p>
					</div>
				</div>
				{/* {batteryLevel && (
          <div className="absolute top-0 right-0 rounded bg-green-100 px-2 py-1 text-green-800 text-xs">
            Generic Batt: {batteryLevel}%
          </div>
        )} */}
			</div>

			<div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
				<div
					className="h-2.5 rounded-full bg-blue-400"
					style={{ width: `${percentCompleted}%` }}
				/>
			</div>

			{/* <p className="mb-4 text-center text-muted-foreground text-sm">
        {percentCompleted}% of daily goal completed
      </p>

      <p className="text-muted-foreground text-xs">
        {connectedBottles} bottle(s) connected. {lastSyncStatus}
      </p> */}
		</div>
	);
}
