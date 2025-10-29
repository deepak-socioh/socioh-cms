import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

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
  const key = `socioh-cms/${userId}/profiles/${fileName}`

  const command = new PutObjectCommand({
    Bucket: 'socioh-public',
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await s3Client.send(command)

  // Return the public URL
  return `https://socioh-public.s3.amazonaws.com/${key}`
}
