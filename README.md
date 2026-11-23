# Romantic Birthday Surprise Website ❤️

A luxury, romantic, emotional, and interactive Birthday Surprise Website built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Lucide React**.

---

## ✨ Features & Romantic Experience

- **Distraction-Free Full-Screen Experience**: Zero vertical page scrolling (`overflow-hidden`), no website header, and no website footer. The experience feels like an immersive, cinematic digital gift.
- **Horizontal Storytelling Journey**: Smooth slide-left and slide-right step transitions with directional awareness, gentle scale, and fade animations.
- **Step 1 — Romantic Password Screen**:
  - NOT a login screen — contains only one elegant password field.
  - Heartbeat-pulsing romantic heart badge with champagne starlight.
  - Heading: *"A Little Surprise Awaits You ❤️"*
  - Subtitle: *"Something special has been created just for you."*
  - Show/Hide password toggle.
  - Unlock button: *"Unlock My Surprise ❤️"*
  - Gentle shake animation with romantic error message when an incorrect passcode is typed.
  - Subtle romantic hint toggle.
- **Step 2 — Welcome Birthday Screen**:
  - Greeting: *"Happy Birthday, My Special Person! ❤️"*
  - Emotional, tender birthday message.
  - Celebratory romantic confetti burst (rose, blush pink, and warm gold).
  - Ambient floating hearts and twinkling sparkle particles canvas.
  - Local background video and high-resolution local image with graceful fallback.
  - CTA button: *"Let's Begin Our Journey ❤️"*
- **Minimal Progress Indicator**:
  - Displays current journey step with glowing romantic indicators.
  - Back button with smooth horizontal transition back to Step 1.
- **100% Local Media**:
  - Zero external image or video URLs.
  - All media resides in `public/images/` and `public/videos/`.

---

## 🔑 Secret Passcodes

Frontend validation checks against configured romantic keys (case-insensitive & trimmed):
- Primary: `forever`
- Alternatives: `birthday`, `mylove`, `special`, `surprise`

*To customize or add passcodes, edit `components/birthday/config.ts`.*

---

## 🎨 Romantic Color Palette & Design System

- **Deep Burgundy & Wine**: `#1B0307`, `#24040A`, `#450B17`, `#5B1425`
- **Soft Blush Pink**: `#FFF1F2`, `#FFE4E6`, `#FECDD3`
- **Romantic Rose**: `#E25C80`, `#FB7185`, `#F43F5E`
- **Warm Champagne Gold**: `#D4AF37`, `#E6C687`, `#F8F1E5`
- **Cream White**: `#FFFDF9`, `#FFF8F0`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
# or npm install
```

### 2. Run the Development Server
```bash
pnpm dev
# or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
pnpm build
pnpm start
```

---

## 📁 Architecture for Future Steps

Future birthday surprise sections can easily be enabled in `components/birthday/config.ts`:
1. **Special Birthday Message** (`id: 'message'`)
2. **Photo Memories** (`id: 'memories'`)
3. **Romantic Letter** (`id: 'letter'`)
4. **Moments Timeline** (`id: 'timeline'`)
5. **Final Birthday Surprise** (`id: 'surprise'`)

Simply append the step definition to `STEP_DEFINITIONS` in `components/birthday/config.ts` and add the component render case inside `components/birthday/BirthdayExperience.tsx`.
