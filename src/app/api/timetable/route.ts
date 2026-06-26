import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Forces the route to be rendered dynamically (no static optimization/build cache)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "timetable.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error: Failed to read timetable.json", error);
    return NextResponse.json(
      { error: "Failed to read timetable data" },
      { status: 500 }
    );
  }
}
