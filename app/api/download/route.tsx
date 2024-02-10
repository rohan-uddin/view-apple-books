import { NextRequest, NextResponse } from "next/server";
import ibooks from "@/components/providers/ibooks";
const fs = require('fs');
const currentDate = new Date();


/**
 * GET REQUEST
 */
export async function GET(request: NextRequest) {
  try {
    
    return NextResponse.json({
      book_titles: "yo"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "sorry."
    });
  }
}


