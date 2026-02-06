// lib/auth.ts
// Authentication & Authorization Utilities

import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// ==================== CONSTANTS ====================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);
const JWT_EXPIRES_IN = '7d';
const COOKIE_NAME = 'auth-token';

// ==================== TYPES ====================

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

// ==================== PASSWORD UTILITIES ====================

/**
 * Hash password menggunakan bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

/**
 * Verify password dengan hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

// ==================== JWT UTILITIES ====================

/**
 * Generate JWT token
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

// ==================== COOKIE UTILITIES ====================

/**
 * Set auth cookie
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Remove auth cookie
 */
export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get auth cookie
 */
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

// ==================== SESSION UTILITIES ====================

/**
 * Get current user dari cookie
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  
  return verifyToken(token);
}

/**
 * Require authentication - untuk use di server components
 */
export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

// ==================== MIDDLEWARE HELPERS ====================

/**
 * Protect API routes - untuk use di route handlers
 */
export async function protectRoute(request: NextRequest): Promise<JWTPayload | null> {
  // Check cookie first
  const token = request.cookies.get(COOKIE_NAME)?.value;
  
  if (!token) {
    // Check Authorization header sebagai fallback
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const bearerToken = authHeader.substring(7);
    return verifyToken(bearerToken);
  }
  
  return verifyToken(token);
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

/**
 * Create forbidden response
 */
export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}

// ==================== ROLE CHECKING ====================

/**
 * Check if user is admin
 */
export function isAdmin(user: JWTPayload | null): boolean {
  return user?.role === 'ADMIN';
}

/**
 * Require admin role
 */
export async function requireAdmin(): Promise<JWTPayload> {
  const user = await requireAuth();
  
  if (!isAdmin(user)) {
    throw new Error('Forbidden: Admin access required');
  }
  
  return user;
}
