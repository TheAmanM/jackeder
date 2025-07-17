import { type NextRequest, NextResponse } from "next/server"
import { firebaseAuth } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const result = await firebaseAuth.signIn(email, password)

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
      })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
  }
}
