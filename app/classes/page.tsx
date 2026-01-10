'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Loader2 } from 'lucide-react';

type ClassData = {
  _id: string;
  name: string;
  status: 'ongoing' | 'upcoming';
  schedule: string;
  time: string;
  university: string;
  college?: string;
  branch: string;
  semester: string;
};

export default function ManageClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    status: 'ongoing' as 'ongoing' | 'upcoming',
    schedule: '',
    time: '',
    university: '',
    college: '',
    branch: '',
    semester: '',
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      fetchClasses();
      setFormData({
        name: '',
        status: 'ongoing',
        schedule: '',
        time: '',
        university: '',
        college: '',
        branch: '',
        semester: '',
      });
    } catch (error) {
      console.error('Failed to add class:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/classes?id=${id}`, {
        method: 'DELETE',
      });
      fetchClasses();
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-primary">Manage Classes</h1>
        <p className="text-muted-foreground">Add, edit, or remove classes for students</p>
      </header>

      {/* Add New Class Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Class
          </CardTitle>
          <CardDescription>Fill in the details to create a new class</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class-name">Class Name</Label>
              <Input
                id="class-name"
                name="className"
                autoComplete="off"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Advanced Mathematics IV"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'ongoing' | 'upcoming') => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                name="schedule"
                autoComplete="off"
                required
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g. Mon, Wed, Fri"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                autoComplete="off"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 6:00 PM - 7:30 PM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Select value={formData.university} onValueChange={(value: string) => setFormData({ ...formData, university: value })}>
                <SelectTrigger id="university">
                  <SelectValue placeholder="Select University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vtu">VTU</SelectItem>
                  <SelectItem value="autonomous">Autonomous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.university === 'autonomous' && (
              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  name="college"
                  autoComplete="off"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. bms, rv"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select value={formData.branch} onValueChange={(value: string) => setFormData({ ...formData, branch: value })}>
                <SelectTrigger id="branch">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse">CSE</SelectItem>
                  <SelectItem value="ece">ECE</SelectItem>
                  <SelectItem value="eee">EEE</SelectItem>
                  <SelectItem value="mech">Mechanical</SelectItem>
                  <SelectItem value="civil">Civil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"                name="semester"
                autoComplete="off"                required
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="e.g. 3rd, 4th"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-accent">
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Classes List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>All Classes ({classes.length})</CardTitle>
          <CardDescription>Manage existing classes</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : classes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No classes found. Add one above!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>University/Branch</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls._id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>
                      <Badge variant={cls.status === 'ongoing' ? 'default' : 'secondary'}>
                        {cls.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{cls.schedule}</TableCell>
                    <TableCell className="text-sm">
                      {cls.university.toUpperCase()} / {cls.branch.toUpperCase()}
                    </TableCell>
                    <TableCell>{cls.semester}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cls._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
