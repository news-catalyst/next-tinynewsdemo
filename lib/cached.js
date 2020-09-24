import fs from 'fs';
import path from 'path';

export async function cachedContents(name, cb) {
  const cachedFile = path.join(process.cwd(), 'cached', `${name}.json`);
  console.log('cachedContents file:', cachedFile);
  let data;
  try {
    const fileContents = fs.readFileSync(cachedFile, 'utf8');
    data = JSON.parse(fileContents);
    console.log('cachedContents READ sections from file:', data);
  } catch (e) {
    console.log('cachedContents ERROR:', e);
    data = await cb();
    fs.writeFile(cachedFile, JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log('cachedContents The file has been saved!');
    });
  }
  return data;
}
