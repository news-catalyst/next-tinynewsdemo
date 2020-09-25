import fs from 'fs';
import path from 'path';

export async function cachedContents(name, cb) {
  const cachedFile = path.join(process.cwd(), 'cached', `${name}.json`);
  // console.log('cachedContents file:', cachedFile);
  let data;
  try {
    const fileContents = fs.readFileSync(cachedFile, 'utf8');
    data = JSON.parse(fileContents);
    // console.log('cachedContents READ sections from file:', data);
  } catch (e) {
    console.log('failed reading from cache, requesting data from API now:', e);
    data = await cb();
    try {
      fs.writeFileSync(cachedFile, JSON.stringify(data), { flag: 'wx' }); //, (err) => {
    } catch (err) {
      if (err) throw err;
      console.log('failed to write file:', err);
    }
    console.log(`cachedContents saved ${cachedFile}`);
  }
  return data;
}
