import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Users, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Jackeder</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Stay Accountable. <span className="text-blue-600">Together.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your gym days with friends and keep each other motivated. Build consistency through shared
            accountability and friendly encouragement.
          </p>
          <div className="space-x-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Join the Group
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Simple steps to stay motivated together</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Sign Up</h3>
              <p className="text-gray-600">Create your account and join your friend group</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Update Your Status</h3>
              <p className="text-gray-600">Mark whether you went to the gym each day</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. See Progress</h3>
              <p className="text-gray-600">View your friends' progress and stay motivated</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Preview */}
      <section className="container mx-auto px-4 py-20 bg-white rounded-3xl mx-4 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Accountability</h2>
          <p className="text-lg text-gray-600">Everything you need to stay consistent</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Daily Status Tracking</h3>
                  <p className="text-gray-600">Simple toggle to mark your gym attendance each day</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Friend Visibility</h3>
                  <p className="text-gray-600">See who's staying consistent and who needs encouragement</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Progress Charts</h3>
                  <p className="text-gray-600">Visualize your consistency over time with beautiful charts</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Today's Status</h4>
                <span className="text-sm text-gray-500">July 17, 2025</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>You</span>
                  <span className="text-green-600 font-medium">✓ Went</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Alex</span>
                  <span className="text-green-600 font-medium">✓ Went</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Jordan</span>
                  <span className="text-red-500 font-medium">✗ Didn't Go</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sam</span>
                  <span className="text-green-600 font-medium">✓ Went</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Stay Accountable?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join your friends and start building consistent gym habits together.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex items-center justify-center space-x-2">
          <Dumbbell className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">Jackeder</span>
        </div>
        <p className="text-center text-gray-600 mt-2">Built for friends who lift together</p>
      </footer>
    </div>
  )
}
