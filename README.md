# VibeConnect - Social Networking Platform

Connect with friends, share moments, and engage with your community

## 🌟 Features

- **User Authentication** - Sign up and sign in securely
- **User Profiles** - Create and customize your profile
- **Posts & Feed** - Share text and images with the community
- **Social Interactions** - Like and comment on posts
- **Friend System** - Send friend requests and build connections
- **Real-time Updates** - See new posts instantly
- **Responsive Design** - Works perfectly on all devices

## 🚀 Live Demo
Check out the live version: [VibeConnect Demo](https://vibeeconnect.netlify.app/)
## 🚀 Getting Started

### Prerequisites

Before you start, make sure you have:
- Node.js (version 16 or higher)
- npm or yarn package manager
- A Supabase account (free tier works great!)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rali22212/VibeConnect.git
   cd vibeconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Go to [Supabase](https://supabase.com) and create a new project
   - Get your project URL and API key from the project settings
   - Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy and paste the SQL from `supabase/migrations/20250730173504_fading_glade.sql`
   - Run the SQL to create all necessary tables and security policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Visit `http://localhost:5173`
   - Create an account and start using VibeConnect!

## 📱 How to Use

### Creating an Account
1. Click "Create Account" on the login page
2. Fill in your email, password, username, and full name
3. Click "Create Account" to register
4. You're ready to start connecting!

### Making Your First Post
1. On the home page, you'll see a "What's on your mind?" box
2. Type your message
3. Optionally add an image URL
4. Click "Post" to share with the community

### Connecting with Friends
1. Go to the "Friends" page from the navigation
2. Browse suggested users
3. Click "Add Friend" to send a friend request
4. Accept incoming friend requests from the "Requests" tab

### Interacting with Posts
- **Like posts** by clicking the heart icon
- **Comment** by clicking the comment icon and typing your message
- **View profiles** by clicking on usernames

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for beautiful, responsive design
- **Backend**: Supabase (PostgreSQL database with real-time features)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📁 Project Structure

```
vibeconnect/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthGuard.tsx   # Protects authenticated routes
│   │   ├── CreatePost.tsx  # Post creation component
│   │   ├── Layout.tsx      # Main app layout
│   │   ├── Navbar.tsx      # Navigation bar
│   │   └── PostCard.tsx    # Individual post display
│   ├── contexts/           # React context providers
│   │   └── AuthContext.tsx # Authentication state management
│   ├── lib/                # Utility libraries
│   │   └── supabase.ts     # Supabase client configuration
│   ├── pages/              # Main application pages
│   │   ├── AuthPage.tsx    # Login/signup page
│   │   ├── FriendsPage.tsx # Friends management
│   │   ├── HomePage.tsx    # Main feed
│   │   └── ProfilePage.tsx # User profiles
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── supabase/
│   └── migrations/         # Database schema
└── public/                 # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🎨 Customization

### Changing Colors
The app uses Tailwind CSS. You can customize colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```


## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test them
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Contribution Guidelines
- Write clear, descriptive commit messages
- Follow the existing code style
- Test your changes thoroughly
- Update documentation if needed



---

**Made with ❤️ by the Ali Raza**

*Connect, Share, Engage - Welcome to VibeConnect!*
