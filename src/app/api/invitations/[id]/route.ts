// app/api/invitations/[id]/route.ts
// API Routes untuk specific invitation operations

import { NextRequest, NextResponse } from 'next/server';
import { protectRoute, unauthorizedResponse } from '@/lib/auth';
import { updateInvitationSchema } from '@/lib/validators';
import * as invitationService from '@/services/invitation.service';
import { ZodError } from 'zod';

// ==================== GET - Get single invitation ====================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Protect route
    const user = await protectRoute(request);
    if (!user) {
      return unauthorizedResponse();
    }
    
    const invitation = await invitationService.getInvitationById(params.id, true);
    
    if (!invitation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invitation not found',
        },
        { status: 404 }
      );
    }
    
    // Check ownership
    if (invitation.userId !== user.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized access',
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch invitation',
      },
      { status: 500 }
    );
  }
}

// ==================== PUT - Update invitation ====================

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Protect route
    const user = await protectRoute(request);
    if (!user) {
      return unauthorizedResponse();
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateInvitationSchema.parse(body);
    
    // Update invitation
    const invitation = await invitationService.updateInvitation(
      params.id,
      user.userId,
      validatedData
    );
    
    return NextResponse.json({
      success: true,
      data: invitation,
      message: 'Invitation updated successfully',
    });
  } catch (error) {
    console.error('Error updating invitation:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message === 'Invitation not found') {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update invitation',
      },
      { status: 500 }
    );
  }
}

// ==================== DELETE - Delete invitation ====================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Protect route
    const user = await protectRoute(request);
    if (!user) {
      return unauthorizedResponse();
    }
    
    // Delete invitation
    await invitationService.deleteInvitation(params.id, user.userId);
    
    return NextResponse.json({
      success: true,
      message: 'Invitation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Invitation not found') {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete invitation',
      },
      { status: 500 }
    );
  }
}
