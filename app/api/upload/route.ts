import { NextRequest } from 'next/server';
import { uploadFileToS3, validatePitchFile, validateProfileImage } from '@/lib/aws/s3';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string; // 'pitch' or 'profile'

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    let uploadResult;

    if (fileType === 'profile') {
      // Validate profile image
      const validation = validateProfileImage(file);
      if (!validation.valid) {
        return errorResponse(validation.error || 'Invalid image file', 400);
      }
      // Upload to profile images folder
      uploadResult = await uploadFileToS3(file, 'profile-images');
    } else {
      // Default to pitch file validation and upload
      const validation = validatePitchFile(file);
      if (!validation.valid) {
        return errorResponse(validation.error || 'Invalid file', 400);
      }
      uploadResult = await uploadFileToS3(file, 'startup-pitches');
    }

    if (!uploadResult.success) {
      return errorResponse(uploadResult.error || 'Upload failed', 500);
    }

    return successResponse(
      { url: uploadResult.url },
      'File uploaded successfully',
      200
    );
  } catch (error: any) {
    console.error('Upload API error:', error);
    return errorResponse(
      error.message || 'Internal server error',
      500
    );
  }
}