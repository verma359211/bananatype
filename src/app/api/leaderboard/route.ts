import connectDb from "@/dbconfig/dbconfig";
// import { getDataFromToken } from "@/lib/getDataFromToken";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    await connectDb();
    try {
        console.log("Fetching leaderboard data...");
        const users = await User.find({}).lean();
        console.log("Fetched Users:", users);
        return NextResponse.json(
					{ message: "leaderboard found", users },
					{
						status: 200,
						headers: {
							"Cache-Control": "no-store, max-age=0, must-revalidate", // Prevents Next.js from caching
							"Content-Type": "application/json",
						},
					}
				);
    }catch(error : unknown){
        return NextResponse.json({ message: "failed to load leaderboard \n\n"+error }, {status:500})
    }
}