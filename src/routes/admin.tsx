import { createFileRoute, redirect, notFound, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, count, desc, eq, gte } from "drizzle-orm";
import { getSession } from "@/lib/auth-server";
import { createDb } from "@/lib/db";
import { bookmark, group, user } from "@/lib/db/schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { SignupChart } from "@/components/signup-chart";

const getAdminData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSession();
  if (!session) throw redirect({ to: "/login" });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (
    !adminEmail ||
    session.user.email.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    throw notFound();
  }

  const db = createDb();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalBookmarks,
    totalGroups,
    publicProfiles,
    publicGroups,
    publicBookmarks,
    newUsers7d,
    newBookmarks7d,
    bookmarksByType,
    topUsersRows,
    recentUsers,
  ] = await Promise.all([
    db.$count(user),
    db.$count(bookmark),
    db.$count(group),
    db.$count(user, eq(user.isProfilePublic, true)),
    db.$count(group, eq(group.isPublic, true)),
    db.$count(bookmark, eq(bookmark.isPublic, true)),
    db.$count(user, gte(user.createdAt, sevenDaysAgo)),
    db.$count(bookmark, gte(bookmark.createdAt, sevenDaysAgo)),
    db
      .select({ type: bookmark.type, _count: count() })
      .from(bookmark)
      .groupBy(bookmark.type),
    db
      .select({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        bookmarks: count(bookmark.id),
      })
      .from(user)
      .leftJoin(bookmark, eq(bookmark.userId, user.id))
      .groupBy(user.id)
      .orderBy(desc(count(bookmark.id)))
      .limit(10),
    db
      .select({ createdAt: user.createdAt })
      .from(user)
      .where(gte(user.createdAt, thirtyDaysAgo))
      .orderBy(asc(user.createdAt)),
  ]);

  const signupsByDate = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    signupsByDate.set(d.toISOString().slice(0, 10), 0);
  }
  for (const u of recentUsers) {
    const dateKey = u.createdAt.toISOString().slice(0, 10);
    signupsByDate.set(dateKey, (signupsByDate.get(dateKey) ?? 0) + 1);
  }
  const signupData = Array.from(signupsByDate, ([date, value]) => ({
    date,
    count: value,
  }));

  const avgBookmarks =
    totalUsers > 0 ? (totalBookmarks / totalUsers).toFixed(1) : "0";

  const stats = [
    { label: "Total Users", value: totalUsers },
    { label: "Total Bookmarks", value: totalBookmarks },
    { label: "Total Groups", value: totalGroups },
    { label: "Public Profiles", value: publicProfiles },
    { label: "Public Groups", value: publicGroups },
    { label: "Public Bookmarks", value: publicBookmarks },
    { label: "New Users (7d)", value: newUsers7d },
    { label: "New Bookmarks (7d)", value: newBookmarks7d },
  ];

  const topUsers = topUsersRows.map((u) => ({
    name: u.name,
    email: u.email,
    bookmarks: u.bookmarks,
    joined: u.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  return { stats, avgBookmarks, bookmarksByType, signupData, topUsers };
});

export const Route = createFileRoute("/admin")({
  loader: () => getAdminData(),
  component: AdminPage,
});

function AdminPage() {
  const { stats, avgBookmarks, bookmarksByType, signupData, topUsers } =
    Route.useLoaderData();

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <Link
        to="/dashboard"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back to dashboard
      </Link>

      <h1 className="mb-2 text-3xl font-semibold text-balance text-foreground">
        Admin
      </h1>
      <p className="mb-8 text-sm text-pretty text-muted-foreground">
        Usage statistics
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} size="sm">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl tabular-nums">
                  {stat.value}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Avg Bookmarks per User</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {avgBookmarks}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Bookmark Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {bookmarksByType.map((entry) => (
                <li key={entry.type} className="flex justify-between">
                  <span className="capitalize">{entry.type}</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {entry._count}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Signups (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <SignupChart data={signupData} />
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Top 10 Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Bookmarks</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topUsers.map((u) => (
                  <TableRow key={u.email}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {u.bookmarks}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {u.joined}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
