import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Resource } from '@/lib/models';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// App Router automatically handles body parsing with reasonable limits
// For unlimited resources, MongoDB handles the scale, not the API config

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    await dbConnect();
    console.log('📊 Fetching all resources from MongoDB...');
    const resources = await Resource.find({}).sort({ uploadedAt: -1 });
    console.log(`✅ Found ${resources.length} resources`);
    return NextResponse.json(resources, { headers: corsHeaders });
  } catch (error) {
    console.error('❌ Error fetching resources:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Received POST request to create resource...');
    await dbConnect();
    console.log('✅ MongoDB connected');
    
    const data = await request.json();
    console.log('📄 Request data:', { name: data.name, type: data.type, university: data.university });
    
    // Validate required fields
    if (!data.name || !data.university || !data.type || !data.fileUrl) {
      console.log('❌ Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: name, university, type, fileUrl' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const newResource = await Resource.create(data);
    console.log(`✅ Resource created successfully: ${newResource._id} (${newResource.name})`);
    
    // Check total count
    const totalCount = await Resource.countDocuments();
    console.log(`📊 Total resources in database: ${totalCount}`);
    
    return NextResponse.json(newResource, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    console.error('❌ Error creating resource:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Failed to create resource', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400, headers: corsHeaders });
    }
    const data = await request.json();
    const updatedResource = await Resource.findByIdAndUpdate(id, data, { new: true });
    if (!updatedResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json(updatedResource, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400, headers: corsHeaders });
    }
    await Resource.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500, headers: corsHeaders });
  }
}
