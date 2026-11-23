import fs from 'fs';
import path from 'path';
import { validateRomanticPassword } from '../components/birthday/passwordValidator.js';
import { BIRTHDAY_CONFIG, STEP_DEFINITIONS } from '../components/birthday/config.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- 1. Testing Password Validation Logic ---');
  
  // Test empty input
  const emptyRes = validateRomanticPassword('');
  assert(!emptyRes.isValid, 'Empty input is rejected');
  assert(emptyRes.message.includes('passcode'), 'Empty input returns guidance message');

  // Test incorrect password
  const wrongRes = validateRomanticPassword('incorrectPass123');
  assert(!wrongRes.isValid, 'Incorrect password is rejected');
  assert(wrongRes.message.includes('secret key'), 'Incorrect password returns romantic message');

  // Test correct passwords (case insensitive, trimmed)
  const correct1 = validateRomanticPassword('forever');
  assert(correct1.isValid, 'Password "forever" is accepted');

  const correct2 = validateRomanticPassword('  FoReVeR  ');
  assert(correct2.isValid, 'Trimmed & case-insensitive "FoReVeR" is accepted');

  const correct3 = validateRomanticPassword('birthday');
  assert(correct3.isValid, 'Alternative password "birthday" is accepted');

  console.log('\n--- 2. Testing Local Media Files ---');
  const publicDir = path.join(process.cwd(), 'public');
  const requiredFiles = [
    path.join(publicDir, 'images', 'birthday-bg.jpg'),
    path.join(publicDir, 'images', 'welcome-bg.jpg'),
    path.join(publicDir, 'images', 'romantic-photo-1.jpg'),
    path.join(publicDir, 'videos', 'birthday-background.mp4'),
  ];

  for (const filePath of requiredFiles) {
    const exists = fs.existsSync(filePath);
    const size = exists ? fs.statSync(filePath).size : 0;
    assert(exists && size > 0, `Local file exists and non-empty: ${path.basename(filePath)} (${size} bytes)`);
  }

  console.log('\n--- 3. Testing Step Architecture Configuration ---');
  assert(STEP_DEFINITIONS.length >= 2, 'Step definitions contains at least Step 1 and Step 2');
  assert(STEP_DEFINITIONS[0].id === 'password', 'Step 1 is "password"');
  assert(STEP_DEFINITIONS[1].id === 'welcome', 'Step 2 is "welcome"');
  assert(STEP_DEFINITIONS[0].isUnlocked === true, 'Step 1 is unlocked by default');

  console.log('\n--- 4. Testing Server HTML Output ---');
  try {
    const res = await fetch('http://localhost:3000');
    const html = await res.text();

    assert(res.status === 200, 'HTTP status is 200 OK');
    assert(!html.includes('<header'), 'No <header> element found in HTML');
    assert(!html.includes('<footer'), 'No <footer> element found in HTML');
    assert(html.includes('overflow-hidden'), 'Page contains overflow-hidden classes');
    assert(html.includes('A Little Surprise Awaits You'), 'Contains romantic heading');
    assert(html.includes('Something special has been created just for you'), 'Contains romantic subtitle');
    assert(html.includes('Unlock My Surprise'), 'Contains unlock button label');
    
    // Check no external image/video URLs
    const hasExternalImg = /src=["']https?:\/\/[^"']+\.(jpg|jpeg|png|gif|webp|svg)/i.test(html);
    const hasExternalVideo = /src=["']https?:\/\/[^"']+\.(mp4|webm|ogg)/i.test(html);
    assert(!hasExternalImg, 'No external image URLs in HTML');
    assert(!hasExternalVideo, 'No external video URLs in HTML');

  } catch (err) {
    console.error('Fetch error:', err);
    failed++;
  }

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
