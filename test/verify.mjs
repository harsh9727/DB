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

  console.log('\n--- 2. Testing Local Media & Audio Files ---');
  const publicDir = path.join(process.cwd(), 'public');
  const requiredFiles = [
    path.join(publicDir, 'images', 'birthday-bg.jpg'),
    path.join(publicDir, 'images', 'welcome-bg.jpg'),
    path.join(publicDir, 'images', 'romantic-photo-1.jpg'),
    path.join(publicDir, 'videos', 'birthday-background.mp4'),
    path.join(publicDir, 'audio', 'candle-lighting.mp3'),
    path.join(publicDir, 'audio', 'candle-blowing.mp3'),
    path.join(publicDir, 'audio', 'knife-cutting.mp3'),
    path.join(publicDir, 'audio', 'celebration.mp3'),
  ];

  for (const filePath of requiredFiles) {
    const exists = fs.existsSync(filePath);
    const size = exists ? fs.statSync(filePath).size : 0;
    assert(exists && size > 0, `Local file exists and non-empty: ${path.basename(filePath)} (${size} bytes)`);
  }

  console.log('\n--- 3. Testing Step Architecture Configuration ---');
  assert(STEP_DEFINITIONS.length >= 3, 'Step definitions contains at least Step 1, Step 2, and Step 3');
  assert(STEP_DEFINITIONS[0].id === 'password', 'Step 1 is "password"');
  assert(STEP_DEFINITIONS[1].id === 'welcome', 'Step 2 is "welcome"');
  assert(STEP_DEFINITIONS[2].id === 'cake', 'Step 3 is "cake"');
  assert(STEP_DEFINITIONS[0].isUnlocked === true, 'Step 1 is unlocked by default');

  console.log('\n--- 4. Testing Build & Asset Verification ---');
  assert(fs.existsSync(path.join(process.cwd(), 'components', 'birthday', 'cake', 'CakeCuttingScreen.tsx')), 'CakeCuttingScreen component exists');
  assert(fs.existsSync(path.join(process.cwd(), 'components', 'birthday', 'cake', 'CakeCanvas.tsx')), 'CakeCanvas component exists');
  assert(fs.existsSync(path.join(process.cwd(), 'components', 'birthday', 'cake', 'cakeModel.ts')), '3D cakeModel exists');
  assert(fs.existsSync(path.join(process.cwd(), 'components', 'birthday', 'cake', 'cakeKnifeMesh.ts')), '3D cakeKnifeMesh exists');
  assert(fs.existsSync(path.join(process.cwd(), 'components', 'birthday', 'cake', 'cakeAudio.ts')), 'cakeAudio synthesizer exists');

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
