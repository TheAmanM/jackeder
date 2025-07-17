"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { firebaseAuth, firestore } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userGymStatus, setUserGymStatus] = useState(false);
  const [gymData, setGymData] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const result = await firestore.getUserProfile(firebaseUser.uid);
        if (result.success) {
          setCurrentUser(result.user!);
        }
      } else {
        window.location.href = "/login";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      const result = await firestore.getAllUsers();
      if (result.success) {
        setUsers(result.users || []);
      }
    };
    loadUsers();
  }, []);

  // Load gym data when date changes
  useEffect(() => {
    const loadGymData = async () => {
      const dateKey = formatDate(currentDate);
      const result = await firestore.getGymStatuses(dateKey);

      if (result.success) {
        setGymData((prev) => ({
          ...prev,
          [dateKey]: result.data || {},
        }));

        // Update user status
        if (currentUser) {
          setUserGymStatus(result.data?.[currentUser.id] ?? false);
        }
      }
    };

    if (currentUser) {
      loadGymData();
    }
  }, [currentDate, currentUser]);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currentDateKey = formatDate(currentDate);
  const todayKey = formatDate(new Date());
  const isToday = currentDateKey === todayKey;

  const handleStatusToggle = async () => {
    if (!isToday || !currentUser) return;

    const newStatus = !userGymStatus;
    setUserGymStatus(newStatus);

    // Update in Firebase
    const result = await firestore.updateGymStatus(
      currentUser.id,
      currentDateKey,
      newStatus
    );

    if (result.success) {
      // Update local state
      setGymData((prev) => ({
        ...prev,
        [currentDateKey]: {
          ...prev[currentDateKey],
          [currentUser.id]: newStatus,
        },
      }));
    } else {
      // Revert on error
      setUserGymStatus(!newStatus);
      console.error("Failed to update status:", result.error);
    }
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const canNavigateNext = currentDateKey < todayKey;

  // Update user status when date changes
  useEffect(() => {
    const dateData = gymData[currentDateKey];
    if (dateData) {
      setUserGymStatus(dateData[currentUser?.id || ""] || false);
    } else {
      setUserGymStatus(false);
    }
  }, [currentDateKey, gymData, currentUser]);

  const handleLogout = async () => {
    const result = await firebaseAuth.signOut();
    if (result.success) {
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

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

            <div className="flex items-center space-x-4">
              <Link href={`/profile/${currentUser.id}`}>
                <Button variant="ghost" size="sm">
                  {/* User Icon Placeholder */}
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Date Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl">
                    {formatDisplayDate(currentDate)}
                  </CardTitle>
                  <CardDescription>
                    {isToday ? "Today's gym status" : "Historical gym status"}
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("next")}
                  disabled={!canNavigateNext}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Status */}
          <Card>
            <CardHeader>
              <CardTitle>Your Status</CardTitle>
              <CardDescription>
                {isToday
                  ? "Update your gym status for today"
                  : "Your status for this date"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="text-6xl">{userGymStatus ? "💪" : "😴"}</div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {userGymStatus
                      ? "You went to the gym!"
                      : "You didn't go to the gym"}
                  </h3>
                  <p className="text-gray-600">
                    {isToday
                      ? "Click below to update your status"
                      : "Historical status - can only edit today"}
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={handleStatusToggle}
                  disabled={!isToday}
                  className={`w-full text-lg py-6 ${
                    userGymStatus
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {userGymStatus
                    ? "I went to the gym ✓"
                    : "I didn't go to the gym ✗"}
                </Button>

                {!isToday && (
                  <p className="text-sm text-gray-500">
                    You can only update today's status
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Friends Status */}
          <Card>
            <CardHeader>
              <CardTitle>Friends' Status</CardTitle>
              <CardDescription>
                See how everyone is doing {isToday ? "today" : "on this date"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Friend</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const userStatus =
                      gymData[currentDateKey]?.[user.id] ?? false;
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Link
                            href={`/profile/${user.id}`}
                            className="font-medium hover:text-blue-600 hover:underline"
                          >
                            {user.id === currentUser.id ? "You" : user.username}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={userStatus ? "default" : "destructive"}
                            className={userStatus ? "bg-green-600" : ""}
                          >
                            {userStatus ? "✓ Went" : "✗ Didn't Go"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Group performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    Object.values(gymData[currentDateKey] || {}).filter(Boolean)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Went Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {
                    Object.values(gymData[currentDateKey] || {}).filter(
                      (status) => !status
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Didn't Go</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {users.length}
                </div>
                <div className="text-sm text-gray-600">Total Friends</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {users.length > 0
                    ? Math.round(
                        (Object.values(gymData[currentDateKey] || {}).filter(
                          Boolean
                        ).length /
                          users.length) *
                          100
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600">Group Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
