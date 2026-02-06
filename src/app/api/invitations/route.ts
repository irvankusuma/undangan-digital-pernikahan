// app/api/invitations/route.ts
// API Routes untuk CRUD Invitations

import { NextRequest, NextResponse } from 'next/server';
import { protectRoute, unauthorizedResponse } from '@/lib/auth';
import { createInvitationSchema } from '@/lib/validators';
import * as invitationService from '@/services/invitation.service';
import { ZodError } from 'zod';

// ==================== GET - List all invitations untuk current user ====================

export async function GET(request: NextRequest) {
  try {
    // Protect route - require authentication
    const user = await protectRoute(request);
    if (!user) {
      return unauthorizedResponse();
    }
    
    // Get invitations
    const invitations = await invitationService.getInvitationsByUserId(user.userId);
    
    return NextResponse.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch invitations',
      },
      { status: 500 }
    );
  }
}

// ==================== POST - Create new invitation ====================

export async function POST(request: NextRequest) {
  try {
    // Protect route - require authentication
    const user = await protectRoute(request);
    if (!user) {
      return unauthorizedResponse();
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = createInvitationSchema.parse(body);
    
    // Create invitation
    const invitation = await invitationService.createInvitation(
      user.userId,
      validatedData
    );
    
    return NextResponse.json(
      {
        success: true,
        data: invitation,
        message: 'Invitation created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating invitation:', error);
    
    // Handle validation errors
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
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create invitation',
      },
      { status: 500 }
    );
  }
}
