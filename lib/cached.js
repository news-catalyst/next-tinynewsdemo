import fs from 'fs';
import path from 'path';

export async function cachedContents(name, params, cb) {
  const cachedFile = path.join(process.cwd(), 'cached', `${name}.json`);
  let data;
  try {
    const fileContents = fs.readFileSync(cachedFile, 'utf8');
    data = JSON.parse(fileContents);
  } catch (e) {
    console.error(
      'failed reading from cache, requesting data from API now:',
      e
    );
    data = await cb(params);
  }
  return data;
}
