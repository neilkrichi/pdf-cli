import { existsSync } from 'fs';
import { createInterface } from 'readline';

export async function confirmOverwrite(filePath: string): Promise<boolean> {
  if (!existsSync(filePath)) {
    return true;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`⚠️  File "${filePath}" already exists. Overwrite? (y/N) `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
} 