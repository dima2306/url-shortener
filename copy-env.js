const fs = require('fs');

const envFile = '.env';
const envExampleFile = '.env.example';

if (!fs.existsSync(envFile)) {
  fs.copyFileSync(envExampleFile, envFile);
  console.log(`${envFile} was successfully created from ${envExampleFile}`);
} else {
  console.log(`${envFile} already exists, skipping copy.`);
}
