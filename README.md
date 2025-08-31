# Visual Product Matcher

A web application that helps users find visually similar products based on uploaded images. This project demonstrates problem-solving, clean code, and production-ready functionality as part of a technical assessment.

## 🚀 Live Demo & Source

- **Live Demo:** [View Application](https://visual-product-matcher.vercel.app)
- **Source Code:** [GitHub Repository](https://github.com/rajeevsingh3108/Visual-Product-Matcher)

## ✨ Features

- **Image Upload**
  - Drag & drop support
  - Direct image URL input
  - Supports JPEG, PNG, WebP

- **Search Interface**
  - Displays uploaded image
  - Lists visually similar products with metadata
  - Filter by similarity score & category

- **Product Database**
  - 50+ sample products with images
  - Metadata includes name, category, description, tags, brand, color

- **User Experience**
  - Responsive, mobile-first design
  - Loading & error states

## 🏗️ Tech Stack

- **Frontend:** Next.js 13, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** MongoDB (Mongoose), Next.js API Routes
- **AI Integration (Optional):** Google Gemini AI for image metadata extraction

## 💡 Approach

Uploaded images are analyzed (file or URL) to extract metadata such as category, color, and tags. A similarity scoring system matches this metadata against the database of products. The backend uses MongoDB with indexed queries, while the frontend is built with Next.js for scalability and responsiveness.

## 📋 Assignment Compliance

- ✅ Image upload (file + URL)
- ✅ Search interface with filtering
- ✅ Product database (50+ items)
- ✅ Free hosting (Vercel / Render)
- ✅ Mobile responsive
- ✅ Clean, production-ready code
- ✅ Error handling & documentation

## ⚙️ Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/rajeevsingh3108/Visual-Product-Matcher
   cd Visual-Product-Matcher
   npm install
   ```

2. **Setup environment variables**

   Create a `.env.local` file in the root folder and add:
   ```
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key   # Optional
   ```

3. **Run locally**
   ```bash
   npm run dev          # start development server
   npm run build && npm start   # production build
   ```

## 🚀 Deploying on Vercel

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **New Project** → Import Git Repository.
3. Select your GitHub repo (`Visual-Product-Matcher`).
4. Add environment variables in the Vercel Dashboard → Settings → Environment Variables:
   - `MONGODB_URI`
   - `GEMINI_API_KEY` (if using AI)
5. Click **Deploy**.

Once deployed, you’ll get a live URL like:  
`https://visual-product-matcher.vercel.app`

## 🔒 Evaluation Criteria

- Problem-solving ability
- Production-quality code & structure
- Functional, working app
- Clear documentation

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and MongoDB  
**Developer:** Rajeev Singh