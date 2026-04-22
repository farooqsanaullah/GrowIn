import { NextResponse } from "next/server";

interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
  pagination?: SuccessResponse["pagination"]
): NextResponse {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    ...(pagination && { pagination }),
  };

  return NextResponse.json(response, { status });
}

export function errorResponse(
  message: string,
  status: number = 400,
  errors?: any
): NextResponse {
  const response: ErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };

  return NextResponse.json(response, { status });
}
