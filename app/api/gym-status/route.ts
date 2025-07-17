import { type NextRequest, NextResponse } from "next/server"
import { firestore } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    const { userId, date, attended } = await request.json()

    const result = await firestore.updateGymStatus(userId, date, attended)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Gym status updated successfully",
      })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update gym status" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ success: false, error: "Date parameter is required" }, { status: 400 })
    }

    const result = await firestore.getGymStatuses(date)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch gym statuses" }, { status: 500 })
  }
}
