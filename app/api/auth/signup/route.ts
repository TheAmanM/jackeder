import { type NextRequest, NextResponse } from "next/server"
import { firebaseAuth } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    const result = await firebaseAuth.signUp(email, password, username)

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
      })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500 })
  }
}
