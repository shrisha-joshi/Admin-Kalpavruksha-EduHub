'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Loader2, FileText, Upload, Link as LinkIcon } from 'lucide-react';

type ResourceData = {
  id: string;
  name: string;
  subjectCode?: string;
  university: string;
  college?: string;
  branch?: string;
  semester?: string;
  type: 'notes' | 'pyq' | 'handwritten';
  fileUrl: string;
  uploadedAt: Date;
};

export default function ManageResourcesPage() {
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    subjectCode: string;
    university: string;
    college: string;
    branch: string;
    semester: string;
    type: 'notes' | 'pyq' | 'handwritten';
    fileUrl: string;
  }>({
    name: '',
    subjectCode: '',
    university: '',
    college: '',
    branch: '',
    semester: '',
    type: 'notes',
    fileUrl: '',
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let fileUrl = formData.fileUrl;

      // If file upload mode, upload file first
      if (uploadMode === 'file' && selectedFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadRes.ok) throw new Error('File upload failed');
        const { url } = await uploadRes.json();
        fileUrl = url;
        setUploading(false);
      }

      await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, fileUrl }),
      });
      fetchResources();
      setFormData({
        name: '',
        subjectCode: '',
        university: '',
        college: '',
        branch: '',
        semester: '',
        type: 'notes',
        fileUrl: '',
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to add resource:', error);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/resources?id=${id}`, {
        method: 'DELETE',
      });
      fetchResources();
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      notes: 'default',
      pyq: 'secondary',
      handwritten: 'outline',
    };
    return <Badge variant={variants[type]}>{type.toUpperCase()}</Badge>;
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-primary">Manage Resources</h1>
        <p className="text-muted-foreground">Add, edit, or remove study resources for students</p>
      </header>

      {/* Add New Resource Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New Resource
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Resource Name *</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="off"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Engineering Mathematics Notes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectCode">Subject Code</Label>
                <Input
                  id="subjectCode"
                  name="subjectCode"
                  autoComplete="off"
                  value={formData.subjectCode}
                  onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                  placeholder="e.g., 18MAT41, CS201"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Resource Type *</Label>
                <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value as 'notes' | 'pyq' | 'handwritten' })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notes">Notes</SelectItem>
                    <SelectItem value="pyq">Previous Year Questions</SelectItem>
                    <SelectItem value="handwritten">Handwritten Notes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">University *</Label>
                <Select value={formData.university || undefined} onValueChange={(value: string) => setFormData({ ...formData, university: value })}>
                  <SelectTrigger id="university">
                    <SelectValue placeholder="Select university" />
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
                  <Select value={formData.college || undefined} onValueChange={(value: string) => setFormData({ ...formData, college: value })}>
                    <SelectTrigger id="college">
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bms">BMS College</SelectItem>
                      <SelectItem value="rv">RV College</SelectItem>
                      <SelectItem value="ramaiah">Ramaiah Institute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={formData.branch || undefined} onValueChange={(value: string) => setFormData({ ...formData, branch: value })}>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse">Computer Science</SelectItem>
                    <SelectItem value="ece">Electronics</SelectItem>
                    <SelectItem value="mech">Mechanical</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select value={formData.semester || undefined} onValueChange={(value: string) => setFormData({ ...formData, semester: value })}>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map((sem) => (
                      <SelectItem key={sem} value={sem}>{sem} Semester</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Upload Method *</Label>
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={uploadMode === 'url' ? 'default' : 'outline'}
                    onClick={() => setUploadMode('url')}
                    className="flex-1"
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Paste URL
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMode === 'file' ? 'default' : 'outline'}
                    onClick={() => setUploadMode('file')}
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload PDF
                  </Button>
                </div>

                {uploadMode === 'url' ? (
                  <div className="space-y-2">
                    <Label htmlFor="fileUrl">Google Drive / File URL *</Label>
                    <Input
                      id="fileUrl"
                      name="fileUrl"
                      autoComplete="url"
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/d/... or any PDF URL"
                      required={uploadMode === 'url'}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Tip: Upload to Google Drive, set sharing to "Anyone with link", then paste the link here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="file">Upload PDF File *</Label>
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      required={uploadMode === 'file'}
                      className="cursor-pointer"
                      key={selectedFile?.name || 'file-input'} 
                    />
                    {selectedFile && (
                      <p className="text-sm text-green-600">✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      📤 File will be uploaded to temporary storage. For permanent storage, use Google Drive URL instead.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resources List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : resources.length === 0 ? (
            <p className="text-center text-muted-foreground p-8">No resources found. Add your first resource above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.name}</TableCell>
                    <TableCell>{getTypeBadge(resource.type)}</TableCell>
                    <TableCell className="uppercase">{resource.university}{resource.college ? ` - ${resource.college}` : ''}</TableCell>
                    <TableCell>{resource.branch || '-'}</TableCell>
                    <TableCell>{resource.semester || '-'}</TableCell>
                    <TableCell>{new Date(resource.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(resource.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
