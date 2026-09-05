import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

function client() {
  return new S3Client({
    endpoint: process.env.STORAGE_BUCKET_ENDPOINT,
    region: process.env.STORAGE_BUCKET_REGION ?? "auto",
    credentials: {
      accessKeyId: process.env.STORAGE_BUCKET_ACCESS_KEY!,
      secretAccessKey: process.env.STORAGE_BUCKET_SECRET_KEY!,
    },
    forcePathStyle: true,
  });
}

const BUCKET = () => process.env.STORAGE_BUCKET_NAME!;

export async function putObject(key: string, body: Buffer, contentType: string) {
  await client().send(
    new PutObjectCommand({ Bucket: BUCKET(), Key: key, Body: body, ContentType: contentType }),
  );
}

/** Returns a Web-standard Response-ready stream for the given object key. */
export async function getObject(key: string) {
  const result = await client().send(new GetObjectCommand({ Bucket: BUCKET(), Key: key }));
  return result;
}
