"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dumbbell,
  ArrowLeft,
  UserIcon,
  Calendar,
  TrendingUp,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { firestore } from "@/lib/firebase";
import { useEffect, useState } from "react";

// Mock user data
// const mockUsers = {
//   "1": { id: "1", username: "You", email: "you@example.com" },
//   "2": { id: "2", username: "Alex", email: "alex@example.com" },
//   "3": { id: "3", username: "Jordan", email: "jordan@example.com" },
//   "4": { id: "4", username: "Sam", email: "sam@example.com" },
//   "5": { id: "5", username: "Casey", email: "casey@example.com" },
// }

// Mock attendance data
// const mockAttendanceData = {
//   "2": [
//     { date: "Jul 10", attended: 1 },
//     { date: "Jul 11", attended: 1 },
//     { date: "Jul 12", attended: 0 },
//     { date: "Jul 13", attended: 1 },
//     { date: "Jul 14", attended: 1 },
//     { date: "Jul 15", attended: 1 },
//     { date: "Jul 16", attended: 1 },
//     { date: "Jul 17", attended: 1 },
//   ],
// }

const chartConfig = {
  attended: {
    label: "Attended",
    color: "#3b82f6",
  },
};

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [gymHistory, setGymHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      // Load user profile
      const userResult = await firestore.getUserProfile(userId);
      if (userResult.success) {
        setUserProfile(userResult.user!);

        // Load gym history
        const historyResult = await firestore.getUserGymHistory(userId);
        if (historyResult.success) {
          setGymHistory(historyResult.history || []);
        }
      }
      setLoading(false);
    };

    loadUserData();
  }, [userId]);

  // Calculate stats from real data
  const calculateStats = () => {
    if (gymHistory.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        attendedDays: 0,
        totalDays: 0,
        attendanceRate: 0,
      };
    }

    const totalDays = gymHistory.length;
    const attendedDays = gymHistory.filter((day) => day.attended).length;
    const attendanceRate = Math.round((attendedDays / totalDays) * 100);

    // Calculate current streak
    let currentStreak = 0;
    const sortedHistory = [...gymHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const day of sortedHistory) {
      if (day.attended) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;

    for (const day of sortedHistory.reverse()) {
      if (day.attended) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return {
      currentStreak,
      longestStreak,
      attendedDays,
      totalDays,
      attendanceRate,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-4">
              The user profile you're looking for doesn't exist.
            </p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = calculateStats();

  // Prepare chart data from gym history
  const chartData = gymHistory
    .slice(-8) // Last 8 days
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      attended: day.attended ? 1 : 0,
    }));

  // Calculate stats
  // const totalDays = attendanceData.length
  // const attendedDays = attendanceData.filter((day) => day.attended === 1).length
  // const attendanceRate = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0

  // // Calculate current streak
  // let currentStreak = 0
  // for (let i = attendanceData.length - 1; i >= 0; i--) {
  //   if (attendanceData[i].attended === 1) {
  //     currentStreak++
  //   } else {
  //     break
  //   }
  // }

  // // Calculate longest streak
  // let longestStreak = 0
  // let tempStreak = 0
  // attendanceData.forEach((day) => {
  //   if (day.attended === 1) {
  //     tempStreak++
  //     longestStreak = Math.max(longestStreak, tempStreak)
  //   } else {
  //     tempStreak = 0
  //   }
  // })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Jackeder</span>
            </Link>

            <Link href="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {userProfile.username}
                </CardTitle>
                <CardDescription>{userProfile.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Streak
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.currentStreak}
              </div>
              <p className="text-xs text-muted-foreground">days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Longest Streak
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.longestStreak}
              </div>
              <p className="text-xs text-muted-foreground">personal best</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.attendedDays}/{stats.totalDays}
              </div>
              <p className="text-xs text-muted-foreground">attended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Attendance Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.attendanceRate}%
              </div>
              <p className="text-xs text-muted-foreground">overall</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>
                Gym attendance over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis
                      domain={[0, 1]}
                      tickFormatter={(value) =>
                        value === 1 ? "Went" : "Didn't Go"
                      }
                    />
                    <ChartTooltip
                    /* formatter={(value, name) => [
                        value === 1 ? "Went to gym" : "Didn't go",
                        "Status",
                      ]} */
                    >
                      <ChartTooltipContent />
                    </ChartTooltip>
                    <Line
                      type="stepAfter"
                      dataKey="attended"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Daily gym status history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gymHistory
                  .slice(-7)
                  .reverse()
                  .map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <Badge
                        variant={day.attended ? "default" : "destructive"}
                        className={day.attended ? "bg-green-600" : ""}
                      >
                        {day.attended ? "✓ Went" : "✗ Didn't Go"}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Overall gym attendance insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.attendanceRate}%
                </div>
                <div className="text-sm text-gray-600">
                  Overall Attendance Rate
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.attendanceRate >= 80
                    ? "Excellent consistency!"
                    : stats.attendanceRate >= 60
                    ? "Good progress!"
                    : "Room for improvement"}
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.longestStreak}
                </div>
                <div className="text-sm text-gray-600">Longest Streak</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.longestStreak >= 7
                    ? "Amazing dedication!"
                    : stats.longestStreak >= 3
                    ? "Building momentum!"
                    : "Keep pushing!"}
                </div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.currentStreak}
                </div>
                <div className="text-sm text-gray-600">Current Streak</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.currentStreak >= 5
                    ? "On fire!"
                    : stats.currentStreak >= 2
                    ? "Keep it up!"
                    : "Start building!"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
