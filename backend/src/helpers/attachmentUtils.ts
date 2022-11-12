import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
const s3Client = new XAWS.S3({
  signatureVersion: 'v4'
})

// ✅TODO: Implement the fileStogare logic
export async function generateUploadUrl(todoId: string): Promise<string> {
  const url = s3Client.getSignedUrl('putObject', {
    Bucket: s3BucketName,
    Key: todoId,
    Expires: 1000
  })
  console.log(url)

  return url as string
}
