import connectDb from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/lib/getDataFromToken";
// import { getDataFromToken } from "@/lib/getDataFromToken";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
    await connectDb();
    try {
            const reqUserId = getDataFromToken(request);
                if (!reqUserId) {
                    return NextResponse.json(
                        { message: "User not logged in" },
                        { status: 401 }
                    );
                }
        // console.log("Fetching leaderboard data...");
        const users = await User.find({ topSpeed: { $gt: 0 } })
					.sort({
						topSpeed: -1,
					})
					.lean();;
        const rankedUsers = users.map((user, index) => ({
					...user, // Keep existing fields like name, email, etc.
					rank: index + 1, // Add a new rank field starting from 1
				}));
        // console.log("Fetched Users:", users);
        return NextResponse.json(
					{ message: "leaderboard found", users: rankedUsers },
					{ status: 200 }
				);
    } catch (error: unknown) {
        console.log(error);
        return NextResponse.json({ message: "failed to load leaderboard"}, {status:500})
    }
}