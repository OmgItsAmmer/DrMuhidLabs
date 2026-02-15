<div align="center">

# 🎓 DR Muhid Lab - Learning Platform

### A Modern Next.js Learning Management System

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 👥 For Students
- 🔐 **Secure Authentication** - Google OAuth integration
- 📚 **Course Catalog** - Browse available courses with rich media
- 💳 **Easy Payment** - Submit payment proof with transaction ID
- 🎥 **Video Learning** - Access YouTube-integrated course content
- ⭐ **Review System** - Rate and review purchased courses
- 📱 **Responsive Design** - Learn on any device

</td>
<td width="50%">

### 👨‍💼 For Administrators
- 📊 **Admin Dashboard** - Centralized management interface
- ➕ **Course Management** - Full CRUD operations for courses
- ✅ **Payment Verification** - Review and approve purchases
- 👥 **Customer Management** - View user data and access control
- 🔒 **Role-Based Access** - Secure admin-only features
- 📈 **Platform Overview** - Monitor platform activity

</td>
</tr>
</table>

---

## 🎯 Demo

### Customer Experience
```
Login → Browse Courses → View Details → Submit Payment → Access Content → Leave Review
```

### Admin Workflow
```
Login → Manage Courses → Verify Payments → Grant Access → Monitor Users
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:
- Node.js 20 or higher installed
- A [Supabase](https://supabase.com) account
- A [Google Cloud Console](https://console.cloud.google.com) project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dr-muhid-lab.git
   cd dr-muhid-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. **Set up Supabase database**
   - Go to your Supabase project dashboard
   - Open SQL Editor
   - Run the SQL from `supabase/schema.sql`

5. **Configure Google OAuth**
   - Create OAuth credentials in Google Cloud Console
   - Add redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Enable Google provider in Supabase Authentication settings

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation

### Creating Your First Admin User

After signing in with Google for the first time:

1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL query:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```
3. Refresh the page to see the Admin Dashboard

### Project Structure

```
dr-muhid-lab/
├── app/
│   ├── (auth)/           # Authentication routes
│   ├── dashboard/        # Customer dashboard
│   ├── courses/          # Course pages
│   ├── admin/            # Admin dashboard
│   └── auth/callback/    # OAuth callback
├── components/
│   ├── admin/            # Admin components
│   └── course/           # Course components
├── lib/
│   ├── supabase/         # Database client
│   ├── actions/          # Server actions
│   └── types.ts          # TypeScript definitions
└── supabase/
    └── schema.sql        # Database schema
```

### Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles with role management |
| `courses` | Course information and metadata |
| `course_images` | Multiple images per course |
| `reviews` | Student course reviews |
| `payments` | Payment submission records |
| `user_course_access` | Course access control |

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth + Google OAuth |
| **Styling** | Tailwind CSS |
| **Video** | YouTube Embed API |
| **Deployment** | Vercel |

</div>

---

## 🔒 Security Features

- ✅ Row Level Security (RLS) on all database tables
- ✅ Role-based access control (Customer/Admin)
- ✅ Secure authentication with Google OAuth
- ✅ Server-side validation for all actions
- ✅ Protected API routes with middleware
- ✅ SQL injection prevention via Supabase client

---

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Post-Deployment Steps

Update your Supabase settings:
- **Authentication → URL Configuration**
  - Site URL: Your production URL
  - Redirect URLs: Add `https://yourdomain.com/**`
- **Google Cloud Console**
  - Add production URL to authorized origins
  - Add production callback URL to redirect URIs

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><b>"Not authenticated" errors</b></summary>

- Verify `.env.local` has correct Supabase credentials
- Check if Supabase project is active
- Clear browser cookies and try again
</details>

<details>
<summary><b>OAuth redirect issues</b></summary>

- Verify redirect URLs in Google Cloud Console
- Check Supabase Auth URL Configuration matches
- Ensure callback URL is exactly: `https://[PROJECT-REF].supabase.co/auth/v1/callback`
</details>

<details>
<summary><b>Admin access not working</b></summary>

- Confirm SQL update was executed successfully
- Check `profiles` table in Supabase for role value
- Sign out completely and sign in again
</details>

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment platform

---

<div align="center">

### 💬 Support

Have questions? [Open an issue](https://github.com/yourusername/dr-muhid-lab/issues)

**Made with ❤️ by Your Team**

⭐ Star this repo if you find it helpful!

</div># DrMuhidLabs
