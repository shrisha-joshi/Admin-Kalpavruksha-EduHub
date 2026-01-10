import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, BookOpen, Users, FileText } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage Kalpavruksha EduHub Resources</p>
        </div>
      </header>

      <div className="grid gap-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/classes">
            <Card className="bg-card border-border hover:border-primary transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Manage Classes</h3>
                  <p className="text-sm text-muted-foreground mt-2">Add, edit, or remove classes</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Card className="bg-card border-border hover:border-primary transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Manage Resources</h3>
                <p className="text-sm text-muted-foreground mt-2">Upload notes and materials</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border hover:border-primary transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">View Requests</h3>
                <p className="text-sm text-muted-foreground mt-2">Check student requests</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle>Resource Statistics</CardTitle>
                <CardDescription>Overview of system contents</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">Total Resources</p>
                    <p className="text-2xl font-bold text-foreground">0</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">Projects</p>
                    <p className="text-2xl font-bold text-foreground">0</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">Classes</p>
                    <p className="text-2xl font-bold text-foreground">0</p>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Latest resources added to the system</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border">
                            <TableHead className="text-primary">Title</TableHead>
                            <TableHead className="text-primary">Category</TableHead>
                            <TableHead className="text-primary">University</TableHead>
                            <TableHead className="text-primary">Date</TableHead>
                            <TableHead className="text-right text-primary">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-border">
                            <TableCell className="text-muted-foreground" colSpan={5}>No resources found</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
