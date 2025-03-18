/* eslint-disable @typescript-eslint/no-explicit-any */
import  connectDb  from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/lib/getDataFromToken";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { speed, accuracy, mode } = reqBody;

        // Verify user token
        const reqUserId = getDataFromToken(request);
        if (!reqUserId) {
            return NextResponse.json(
                { message: "User not logged in" },
                { status: 401 }
            );
        }

        // Validate accuracy
        if (accuracy < 40) {
            return NextResponse.json(
                { message: "Accuracy too low" },
                { status: 403 }
            );
        }

        // Fetch user data
        const user = await User.findById(reqUserId);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Default to 0 if fields are undefined
        const currentAvgSpeed = user.avgSpeed || 0;
        const currentAvgaccuracy = user.avgaccuracy || 0;
        const currentTestAttempted = user.testAttempted || 0;
        const currentTopSpeed = user.topSpeed || 0;
        const currentAccuracy = user.accuracy || 0;

        // Calculate new metrics
        const totalSpeed = currentAvgSpeed * currentTestAttempted + speed;
        const totalaccuracy = currentAvgaccuracy * currentTestAttempted + accuracy;
        const newTestAttempted = currentTestAttempted + 1;
        const newAvgSpeed = Math.round(totalSpeed / newTestAttempted);
        const newAvgaccuracy = Math.round(totalaccuracy / newTestAttempted);
        const newTopSpeed = Math.max(currentTopSpeed, speed);
        const newAccuracy = Math.max(currentAccuracy, accuracy);


       const now = new Date();
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true, // Optional: Change to false for 24-hour format
		};

		const time = new Intl.DateTimeFormat("en-US", options).format(now);

        // Add new history entry
        const historyEntry = {
            speed,
            accuracy,
            mode,
            testPlayed: time
        };
        user.history.push(historyEntry);

        

        // Update user
        user.testAttempted = newTestAttempted;
        user.avgSpeed = newAvgSpeed;
        user.avgaccuracy = newAvgaccuracy;
        user.topSpeed = newTopSpeed;
        user.accuracy = newAccuracy;
        user.lastActive = new Date();

        // Save changes
        await user.save();

        return NextResponse.json(
            { message: "Result stored successfully" },
            { status: 200 }
        );
    } catch (error:any) {
        return NextResponse.json(
            {
                message: "Failed to update the result",
                error: error.message, // Include error for debugging
            },
            { status: 500 }
        );
    }
}
