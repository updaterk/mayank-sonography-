/*
Mayank Sonography and Diagnostic Center — Single-file React component (Tailwind CSS)

How to use:
1) Replace `YOUR_FORMSPREE_ID` with your Formspree form ID (or any other form endpoint).
   - To get a Formspree ID, sign up at https://formspree.io and create a form, they give you /f/{id}.
   - Alternatively you can point the `FORM_ENDPOINT` variable to a Vercel serverless function `/api/submit` if you add one.

2) Deployment to Vercel:
   - Create a new repository containing this file as `src/App.jsx` and a minimal React app (create-react-app or Vite).
   - Install TailwindCSS following Vite/CRA + Tailwind instructions, or use the CDN link in `index.html` for a quick test.
   - Push the repo to GitHub and import into Vercel — Vercel will auto-detect and deploy.

3) WhatsApp quick-booking: the button opens WhatsApp to +91 8982050533. Update `WHATSAPP_PHONE` if needed.

Notes:
- The form posts to Formspree and displays a success message on completion.
- The component is responsive and mobile-friendly using Tailwind classes.

*/

import React, { useState } from "react";

const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORMSPREE_ID"; // <-- replace with your Formspree endpoint
const WHATSAPP_PHONE = "+918982050533"; // WhatsApp phone (India: +91)

export default function App() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: "Ultrasound (USG)",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Basic validation
    if (!form.name || !form.phone || !form.date) {
      setStatus({ ok: false, msg: "कृपया नाम, फोन और तारीख भरें।" });
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      Object.keys(form).forEach((k) => payload.append(k, form[k]));

      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: payload,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setStatus({ ok: true, msg: "आपकी अपॉइंटमेंट का अनुरोध भेज दिया गया है। हम शीघ्र ही संपर्क करेंगे।" });
        setForm({ name: "", phone: "", email: "", date: "", time: "", service: "Ultrasound (USG)", message: "" });
      } else {
        const data = await res.json();
        setStatus({ ok: false, msg: data.error || "सबमिशन में समस्या हुई।" });
      }
    } catch (err) {
      setStatus({ ok: false, msg: "नेटवर्क त्रुटि — कृपया बाद में पुनः प्रयास करें।" });
    }

    setLoading(false);
  }

  const whatsappText = encodeURIComponent(
    `Hello, I want to book an appointment at Mayank Sonography and Diagnostic Center.\nName: ${form.name}\nPhone: ${form.phone}\nPreferred date: ${form.date}\nPreferred time: ${form.time}\nService: ${form.service}`
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Info */}
        <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-400 text-white">
          <h1 className="text-2xl font-bold">Mayank Sonography & Diagnostic Center</h1>
          <p className="mt-2">Opposite Nehru Garden, Govt. Hospital Road, Dhamtari, Chhattisgarh — 493773</p>

          <div className="mt-6 space-y-3">
            <div>
              <h3 className="font-semibold">Call</h3>
              <a className="block mt-1 underline" href="tel:+918982050533">+91 89820 50533</a>
              <a className="block mt-1 underline" href="tel:+919713586177">+91 97135 86177</a>
            </div>

            <div>
              <h3 className="font-semibold">Email</h3>
              <a className="block mt-1 underline" href="mailto:manky2106@gmail.com">manky2106@gmail.com</a>
            </div>

            <div>
              <h3 className="font-semibold">Services</h3>
              <ul className="list-disc ml-5 mt-1">
                <li>Ultrasound (USG) — Obstetric & General</li>
                <li>Doppler Studies</li>
                <li>Diagnostic Imaging</li>
              </ul>
            </div>

            <div className="mt-4">
              <a
                className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-lg font-medium hover:bg-opacity-30"
                href={`https://wa.me/${WHATSAPP_PHONE.replace(/\D/g, "")}?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
              >
                Quick book on WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-6 bg-white bg-opacity-10 p-3 rounded-md text-sm">
            <strong>Clinic Timings:</strong>
            <div className="mt-1">Mon–Sat: 9:00 AM – 6:00 PM</div>
            <div>Sun: Closed</div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Location</h3>
            <div className="mt-2 w-full h-36 rounded-md overflow-hidden">
              <iframe
                title="map"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps?q=Opposite%20Nehru%20Garden%2C%20Dhamtari%2C%20Chhattisgarh&output=embed`}
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-8">
          <h2 className="text-xl font-semibold">Book an Appointment</h2>
          <p className="text-sm text-gray-500 mt-1">Fill the form below — we will contact you to confirm.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="Full name" />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="Mobile number" />
            </div>

            <div>
              <label className="text-sm font-medium">Email (optional)</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="you@example.com" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Preferred Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
              </div>
              <div>
                <label className="text-sm font-medium">Preferred Time</label>
                <input type="time" name="time" value={form.time} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Service</label>
              <select name="service" value={form.service} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md">
                <option>Ultrasound (USG)</option>
                <option>Doppler</option>
                <option>Fetal Doppler</option>
                <option>X-ray</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Message (optional)</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={3} className="w-full mt-1 p-2 border rounded-md" placeholder="Any notes or symptoms" />
            </div>

            {status && (
              <div className={`p-3 rounded-md text-sm ${status.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {status.msg}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-60">
                {loading ? "Sending..." : "Request Appointment"}
              </button>

              <a className="px-4 py-2 border rounded-md text-sm" href={`https://wa.me/${WHATSAPP_PHONE.replace(/\D/g, "")}?text=${whatsappText}`} target="_blank" rel="noreferrer">
                Book via WhatsApp
              </a>

              <a className="px-4 py-2 border rounded-md text-sm" href="mailto:manky2106@gmail.com?subject=Appointment%20Request" >
                Email Us
              </a>
            </div>
          </form>

          <p className="text-xs text-gray-400 mt-4">By submitting you agree we may contact you to confirm the appointment.</p>
        </div>
      </div>
    </div>
  );
}

---

# Repository scaffold (files to create)

Add these files to create a small GitHub repo ready for Vercel deployment.

**1) package.json**

```json
{
  "name": "mayank-clinic",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
```

**2) vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**3) index.html**

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mayank Sonography & Diagnostic Center</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**4) src/main.jsx**

```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(<App />)
```

**5) src/index.css** (Tailwind base)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
```

**6) Tailwind + PostCSS config**

`tailwind.config.cjs`

```js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

`postcss.config.cjs`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**7) .gitignore**

```
node_modules
dist
.env
```

**8) Optional serverless email-forward function (api/submit.js)**

Add this to `/api/submit.js` to receive form POSTs on Vercel and forward by email (example with Nodemailer — you'll need to set environment variables on Vercel):

```js
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, phone, email, date, time, service, message } = req.body

  // Create transporter using env vars set in Vercel dashboard
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const html = `
    <h3>New appointment request</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Service:</strong> ${service}</p>
    <p><strong>Message:</strong> ${message}</p>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_FROM,
      subject: `Appointment request — ${name}`,
      html,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'failed to send' })
  }
}
```

> If you prefer not to set up SMTP, keep using Formspree — simpler.

---

# README.md (suggested)

```
# Mayank Sonography — Clinic Appointment Site

Simple React + Vite site with Tailwind CSS. Ready for Vercel deployment.

## Quick start

1. Install deps: `npm install`
2. Run locally: `npm run dev`
3. Build: `npm run build`

## Deploy to Vercel

1. Create a GitHub repo and push.
2. Import the repo at https://vercel.com/import.
3. If using the serverless `/api/submit` function, add these environment variables in Vercel:
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_EMAIL

## Notes
- Replace the Formspree endpoint in `src/App.jsx` or point the form to `/api/submit`.
```

---

((End of scaffold)

---

# Vercel one-click deploy and vercel.json

**I added the following files/snippets below — use them in your repo root:**

**vercel.json**

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } },
    { "src": "api/**/*.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**README — Vercel one-click deploy badge**

Add this markdown to the top of `README.md`. Replace `USERNAME` and `REPO` with your GitHub username and repository name.

```md
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/USERNAME/REPO)
```

**Notes & tips**
- The badge links to Vercel's import flow and pre-fills the repository. Clicking it will open Vercel's UI where you can choose the account and set environment variables.
- If you use the `/api/submit.js` function, set SMTP env vars in the Vercel dashboard (Project Settings → Environment Variables).
- After pushing these files to GitHub, test the badge by clicking it — it should open the Vercel import page with the repo template pre-filled.

---

(End of scaffold)
)

