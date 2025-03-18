
import { NextRequest,NextResponse } from "next/server";


export async  function GET(request:NextRequest){

    try {
      const response =  NextResponse.json({message:'Logout successful',success:true}) 

      response.cookies.set("token","",{
        httpOnly:false,
        expires: new Date(0)
    })

    return response

    } catch (error:any) {
        return NextResponse.json(error.message, {status: 500})
    }
}