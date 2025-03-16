import connectDb from "@/dbconfig/dbconfig";
// import { getDataFromToken } from "@/lib/getDataFromToken";
import User from "@/models/user.model";
import { NextResponse } from "next/server";


export async function GET() {
    await connectDb();
    try {
        console.log("Fetching leaderboard data...");
        const users = await User.find({});
        console.log("Fetched Users:", users);
        return NextResponse.json({ message: "leaderboard found", users }, {
            status: 200, headers: {
                "Cache-Control": "no-store", // Prevents Next.js from caching
                "Content-Type": "application/json"
            },
        })
    }catch(error : unknown){
        return NextResponse.json({ message: "failed to load leaderboard \n\n"+error }, {status:500})
    }
}