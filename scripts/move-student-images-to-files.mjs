import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { MongoClient, ObjectId } from "mongodb";

const connectionString = process.env.DATABASE_URL;
const databaseName = "animalDB";
const collectionName = "Student";
const backupDirectory = join(process.cwd(), "mongodb-backup");
const uploadDirectory = join(process.cwd(), "public", "uploads", "student-images");
const publicPath = "/uploads/student-images";

const extensionByMimeType = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

function parseDataUrl(value) {
  if (typeof value !== "string") return null;

  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  return {
    mimeType: match[1].toLowerCase(),
    base64: match[2],
  };
}

function safeName(value) {
  return String(value || "student")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 40) || "student";
}

async function latestStudentBackupFile() {
  const files = await readdir(backupDirectory);
  const studentBackups = files
    .filter((file) => /^Student-.+\.json$/.test(file))
    .sort();

  if (studentBackups.length === 0) {
    throw new Error(`No Student backup JSON file found in ${backupDirectory}`);
  }

  return join(backupDirectory, studentBackups.at(-1));
}

console.log("Connecting to MongoDB...");
const client = new MongoClient(connectionString, {
  connectTimeoutMS: 15000,
  serverSelectionTimeoutMS: 15000,
});

try {
  await client.connect();
  console.log("Connected.");

  await mkdir(uploadDirectory, { recursive: true });

  const backupFile = await latestStudentBackupFile();
  console.log(`Reading student images from backup: ${backupFile}`);
  const students = JSON.parse(await readFile(backupFile, "utf8"));

  const collection = client.db(databaseName).collection(collectionName);

  let movedCount = 0;
  let skippedCount = 0;

  for (const student of students) {
    const image = parseDataUrl(student.profileImage);
    if (!image) {
      skippedCount += 1;
      continue;
    }

    const extension = extensionByMimeType[image.mimeType] ?? "jpg";
    const filename = `${safeName(student.fullName)}-${student.phone || student._id.toString()}.${extension}`;
    const filePath = join(uploadDirectory, filename);
    const url = `${publicPath}/${filename}`;

    await writeFile(filePath, Buffer.from(image.base64, "base64"));
    await collection.updateOne(
      { _id: new ObjectId(student._id) },
      { $set: { profileImage: url } }
    );

    movedCount += 1;
    console.log(`Moved ${movedCount}: ${student.fullName || student._id.toString()} -> ${url}`);
  }

  console.log(`Done. Moved ${movedCount} student images to ${uploadDirectory}`);
  console.log(`Skipped ${skippedCount} invalid image value${skippedCount === 1 ? "" : "s"}`);
} finally {
  await client.close();
}
