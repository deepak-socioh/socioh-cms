import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Validate AWS credentials
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.')
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  userId: string
): Promise<string> {
  // Check if AWS credentials are available
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not configured')
  }

  const key = `socioh-cms/${userId}/profiles/${fileName}`

  const command = new PutObjectCommand({
    Bucket: 'socioh-public',
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  try {
    await s3Client.send(command)
    console.log(`Successfully uploaded to S3: ${key}`)
  } catch (error) {
    console.error('S3 upload failed:', error)
    throw new Error(`S3 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  // Return the public URL
  return `https://socioh-public.s3.amazonaws.com/${key}`
}
