/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import connectDb  from "@/dbconfig/dbconfig";
// import { getDataFromToken } from "@/lib/getDataFromToken";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDb();
// send the user data except password

// url : /api/player-profile?username=itzaman

export async function GET(request:NextRequest){
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");
        const user = await User.findOne({username}).select("-password");
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({message:"user found",user},{status:200})
    } catch (error:any) {
        return NextResponse.json({message:"failed to load user"},{status:500})
    }
}

        