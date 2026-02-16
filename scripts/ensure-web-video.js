const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src/shared/assets/images/onboarding-video.mp4');
const dest = path.join(root, 'public/onboarding-video.mp4');

if (!fs.existsSync(src)) {
  console.warn('scripts/ensure-web-video: source video not found, skip');
  process.exit(0);
}

if (fs.existsSync(dest)) {
  process.exit(0);
}

const publicDir = path.dirname(dest);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('scripts/ensure-web-video: copied onboarding-video.mp4 to public/');
