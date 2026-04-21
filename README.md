# 🚀 Ravir Press — AI-Powered Publishing Platform

Ravir Press is a modern AI-powered publishing platform designed to create, manage, and distribute high-quality content with automation and intelligence.

> Built to combine AI + CMS + Analytics into one powerful system.

---

## 🌐 Live Demo

https://ravir-press.lovable.app/

---

## ✨ Features

### 🔐 Authentication & Security
- Secure login & signup (Supabase Auth)
- JWT session management
- Role-based access (Admin / Editor / User)
- Password reset system
- Row-Level Security (RLS)

---

### 🛡️ Admin Dashboard
- Premium black + gold UI
- Fully responsive layout
- Sidebar navigation:
  - Overview
  - Create Post
  - AI Generate
  - All Posts
  - Drafts
  - Analytics
  - Users
  - Settings

---

### ✍️ Content Management System (CMS)
- Manual post creation & editing
- Markdown editor support
- SEO fields (meta title, description)
- Auto slug generation
- Draft / Publish system
- Featured image support

---

### 🤖 AI Post Generator
- Generate full blog posts using AI
- Includes:
  - Title
  - Content
  - Tags
  - SEO metadata
  - FAQs
- Options:
  - Short / Medium / Long
- One-click publish
- Save as draft

---

### 📊 Analytics
- Total posts overview
- Published vs drafts
- AI vs manual posts
- Top posts tracking

---

### 👥 User Management
- Role management (Admin / Editor)
- Secure access control

---

### 🔍 Admin Tools
- Search posts
- Filter by category & tags
- Bulk delete
- Activity logs

---

## ⚙️ Tech Stack

- Frontend: Lovable (React-based)
- Backend: Supabase
- Database: PostgreSQL
- Auth: Supabase Auth (JWT)
- AI: Gemini via Lovable AI Gateway
- Storage: Supabase Storage

---

## ⚠️ Known Issues

- Manual post save may fail due to RLS misconfiguration
- AI publish may fail if API or permissions are not set correctly
- Slug duplication edge cases

---

## 🛠️ Fixes & Improvements

- Fixed RLS policies for post actions
- Improved admin role detection
- Added error handling & logs
- Improved AI generation flow

---

## 🚀 Upcoming Features

- 📰 Auto News System (RSS + AI rewrite)
- 📅 Scheduled Post Publishing
- 🖼️ AI Thumbnail Generator
- 💬 Comment System with moderation
- 📧 Newsletter & email subscriptions
- 📁 Export / Import posts
- 🔐 Advanced security (rate limit, validation)

---

## 🎯 Goal

To build a powerful AI-driven publishing system like:

Medium + WordPress + AI tools combined

---

## ⚙️ Setup

1. Clone the repository
2. Connect Supabase project
3. Configure environment variables
4. Enable authentication & RLS
5. Add AI API key
6. Run / Deploy via Lovable

---

## ⚠️ Notes

- Ensure Supabase RLS policies allow admin actions
- Enable AI Gateway for content generation
- Disable email confirmation during testing

---

## 👨‍💻 Author

Ravir Scott  
Artist & Developer  

---

## 📜 License

This project is open-source and free to use for learning and development.

---

## ⭐ Support

If you like this project:
- Star the repo ⭐
- Share it 🚀
- Contribute 🤝
