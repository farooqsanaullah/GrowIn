import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'growin-startup-pitches';
const AWS_REGION = process.env.AWS_REGION || 'eu-north-1';

// Create S3 client with proper configuration
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  // Force path style for compatibility
  forcePathStyle: false,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}


async function getBucketRegion(): Promise<string> {
  try {
    const command = new HeadBucketCommand({ Bucket: BUCKET_NAME });
    await s3Client.send(command);
    return AWS_REGION;
  } catch (error: any) {
    // If we get a redirect error, extract the correct region
    if (error.name === 'PermanentRedirect' && error.$metadata?.httpStatusCode === 301) {
      const correctRegion = error.$response?.headers?.['x-amz-bucket-region'];
      if (correctRegion) {
        console.log(`Bucket is in region: ${correctRegion}, updating client...`);
        return correctRegion;
      }
    }
    throw error;
  }
}

/**
 * Create S3 client for specific region
 */
function createS3ClientForRegion(region: string): S3Client {
  return new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: false,
  });
}


export async function uploadFileToS3(
  file: File,
  folder: string = 'pitches'
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    let clientToUse = s3Client;
    let regionToUse = AWS_REGION;

    try {
      // First try with the default client
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        // Remove ACL to avoid permissions issues
      });

      await clientToUse.send(command);
    } catch (error: any) {
      // If we get a region error, try to get the correct region and retry
      if (error.name === 'PermanentRedirect' || error.$metadata?.httpStatusCode === 301) {
        try {
          regionToUse = await getBucketRegion();
          clientToUse = createS3ClientForRegion(regionToUse);
          
          const retryCommand = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
          });

          await clientToUse.send(retryCommand);
        } catch (retryError) {
          throw retryError;
        }
      } else {
        throw error;
      }
    }


    const url = `https://${BUCKET_NAME}.s3.${regionToUse}.amazonaws.com/${fileName}`;

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}


export function validatePitchFile(file: File): { valid: boolean; error?: string } {
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check file type (PPT, PPTX, PDF)
  const allowedTypes = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/pdf',
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File must be a PowerPoint (.ppt, .pptx) or PDF file' };
  }

  return { valid: true };
}


export function validateProfileImage(file: File): { valid: boolean; error?: string } {

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }


  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File must be an image (JPG, PNG, WebP, or GIF)' };
  }

  return { valid: true };
}