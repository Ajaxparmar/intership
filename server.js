import 'dotenv/config';
import { once } from 'node:events';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { MongoClient } from 'mongodb';

const filter = {};
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env');
}

console.log('Connecting to MongoDB...');
const client = await MongoClient.connect(connectionString, {
  connectTimeoutMS: 15000,
  serverSelectionTimeoutMS: 15000,
});
console.log('Connected. Starting backup...');

try {
  const coll = client.db('animalDB').collection('Student');
  const backupDirectory = join(process.cwd(), 'mongodb-backup');
  const timestamp = new Date().toISOString().replaceAll(':', '-');
  const backupFile = join(backupDirectory, `Student-${timestamp}.json`);

  await mkdir(backupDirectory, { recursive: true });
  const output = createWriteStream(backupFile, { encoding: 'utf8' });
  const write = async (chunk) => {
    if (!output.write(chunk)) {
      await once(output, 'drain');
    }
  };
  let documentCount = 0;

  await write('[\n');
  for await (const document of coll.find(filter)) {
    await write(`${documentCount === 0 ? '' : ',\n'}${JSON.stringify(document, null, 2)}`);
    documentCount += 1;

    if (documentCount % 1000 === 0) {
      console.log(`Backed up ${documentCount} documents...`);
    }
  }
  output.end('\n]\n');
  await once(output, 'finish');

  console.log(`Backed up ${documentCount} documents to ${backupFile}`);
} finally {
  await client.close();
}
