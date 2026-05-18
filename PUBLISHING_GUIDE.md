# Publishing Guide - Firefox & Microsoft Edge

## Overview
This guide will walk you through publishing the Daily Focus extension to both Firefox Add-ons and Microsoft Edge Add-ons stores.

---

## 📦 Step 1: Build Your Extension

### Build the Extension Package
```bash
npm run package:extension
```

This will:
1. Create an optimized production build
2. Generate a `daily-focus-extension.zip` file in the root directory

**Important**: The zip file contains everything needed for submission.

---

## 🦊 Firefox Add-ons Submission

### Prerequisites
- Firefox account (free to create at https://addons.mozilla.org)
- No registration fee required

### Submission Steps

1. **Create Developer Account**
   - Go to https://addons.mozilla.org
   - Click "Log in" → Create account (if you don't have one)
   - Verify your email

2. **Submit Your Extension**
   - Go to https://addons.mozilla.org/developers/addon/submit/distribution
   - Click "Submit a New Add-on"
   - Choose "On this site" for distribution

3. **Upload Your Extension**
   - Upload `daily-focus-extension.zip`
   - Firefox will automatically validate your extension
   - Fix any errors if they appear

4. **Fill Out Listing Information**
   
   **Name**: Daily Focus - Productivity Extension
   
   **Summary** (250 characters max):
   ```
   A beautiful, minimalist extension that helps you stay focused on your daily goals with task management, motivational quotes, and stunning backgrounds. Replace your new tab with productivity.
   ```
   
   **Description**:
   ```
   Daily Focus transforms your new tab into a productivity powerhouse!

   ✨ FEATURES:
   • Personalized welcome with time-based greetings
   • Set and track your main daily focus
   • Beautiful todo list with completion tracking
   • Motivational quotes to inspire you
   • Stunning background images
   • All data stored locally - complete privacy
   • Clean, minimalist design
   • Fully responsive

   🎯 HOW IT WORKS:
   1. Enter your name on first launch
   2. Set your main focus for the day
   3. Manage tasks with the built-in todo list
   4. Stay inspired with rotating quotes
   5. Your data automatically resets each day for a fresh start

   🔒 PRIVACY:
   All your data is stored locally on your device. We don't collect, track, or share any information.

   Made with ❤️ by Divanshiv
   ```

   **Category**: Productivity
   
   **Tags**: productivity, focus, todo, tasks, new tab, motivation, quotes

5. **Screenshots** (Required - at least 1, max 10)
   - Take screenshots of:
     - Home screen (name input)
     - Task screen with focus set
     - Todo list open
     - Different background images
   - Recommended size: 1280x800 or 640x400

6. **Privacy Policy** (if applicable)
   ```
   This extension does not collect, store, or transmit any personal data.
   All information (name, tasks, todos) is stored locally on your device using browser localStorage.
   No analytics, tracking, or third-party services are used.
   ```

7. **Support Information**
   - **Support Email**: your-email@example.com
   - **Support Website**: https://github.com/divanshiv/browser-extension-development

8. **Review & Submit**
   - Review all information
   - Click "Submit Version"
   - Wait for review (typically 1-3 days)

---

## 🌐 Microsoft Edge Add-ons Submission

### Prerequisites
- Microsoft account (free)
- No registration fee required

### Submission Steps

1. **Create Partner Center Account**
   - Go to https://partner.microsoft.com/dashboard/microsoftedge/public/login
   - Sign in with your Microsoft account
   - Complete the registration (free)

2. **Submit Your Extension**
   - Click "New extension"
   - Upload `daily-focus-extension.zip`

3. **Fill Out Store Listing**

   **Display Name**: Daily Focus - Productivity Extension
   
   **Short Description** (132 characters max):
   ```
   Stay focused with task management, motivational quotes, and beautiful backgrounds. Replaces your new tab.
   ```
   
   **Detailed Description**:
   ```
   Daily Focus transforms your new tab into a productivity powerhouse!

   ✨ FEATURES:
   • Personalized welcome with time-based greetings
   • Set and track your main daily focus
   • Beautiful todo list with completion tracking
   • Motivational quotes to inspire you
   • Stunning background images
   • All data stored locally - complete privacy
   • Clean, minimalist design
   • Fully responsive

   🎯 HOW IT WORKS:
   1. Enter your name on first launch
   2. Set your main focus for the day
   3. Manage tasks with the built-in todo list
   4. Stay inspired with rotating quotes
   5. Your data automatically resets each day for a fresh start

   🔒 PRIVACY:
   All your data is stored locally on your device. We don't collect, track, or share any information.

   Made with ❤️ by Divanshiv
   ```

   **Category**: Productivity
   
   **Language**: English

4. **Screenshots** (Required - at least 1, max 10)
   - Use the same screenshots as Firefox
   - Recommended size: 1280x800

5. **Privacy Policy**
   - Use the same privacy policy as Firefox

6. **Support Contact**
   - **Email**: your-email@example.com
   - **Website**: https://github.com/divanshiv/browser-extension-development

7. **Submit for Review**
   - Click "Submit"
   - Wait for review (typically 3-7 days)

---

## 📸 Creating Screenshots

### Recommended Screenshots:
1. **Home Screen** - Shows the welcome message and name input
2. **Task Screen** - Shows the time, greeting, and focus task
3. **Todo List** - Shows the todo list panel open with tasks
4. **Completed Task** - Shows a checked-off focus task
5. **Quote Display** - Highlights the motivational quote at the bottom

### Tips:
- Use a clean browser window (no bookmarks bar, etc.)
- Choose attractive background images
- Show the extension in action
- Highlight key features
- Use 1280x800 resolution for best quality

---

## ✅ Post-Submission Checklist

### After Submission:
- [ ] Monitor your email for review feedback
- [ ] Respond promptly to any reviewer questions
- [ ] Test the extension once it's published
- [ ] Share the store links with users
- [ ] Monitor user reviews and feedback

### Store Links (after approval):
- **Firefox**: `https://addons.mozilla.org/firefox/addon/[your-extension-slug]/`
- **Edge**: `https://microsoftedge.microsoft.com/addons/detail/[your-extension-id]`

---

## 🔄 Updating Your Extension

When you make changes:

1. Update the version number in `public/manifest.json`
2. Run `npm run package:extension`
3. Upload the new zip file to both stores
4. Provide update notes explaining changes

---

## 🆘 Troubleshooting

### Common Issues:

**"Manifest validation failed"**
- Check that all required fields are present
- Verify icon files exist and are correct sizes
- Ensure manifest_version is 3

**"Extension doesn't work after installation"**
- Clear browser cache
- Reload the extension
- Check browser console for errors

**"Icons not displaying"**
- Verify icon files are in the `public` folder
- Check file names match manifest.json
- Ensure icons are PNG format

---

## 📞 Need Help?

- **Firefox Support**: https://extensionworkshop.com/
- **Edge Support**: https://docs.microsoft.com/microsoft-edge/extensions-chromium/

---

**Good luck with your submission! 🚀**
