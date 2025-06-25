# SysAdmin AI Ops Dashboard

A comprehensive system administration dashboard with AI integration, built with React and Supabase.

## Features

### Core Functionality
- **Dashboard**: Real-time overview of system health, tasks, and vulnerabilities
- **User Management**: Role-based access control (Manager/Worker)
- **Task Management**: Kanban-style task board with drag-and-drop functionality
- **AI Assistant**: OpenRouter integration for system administration help
- **Voice Tools**: Speech-to-text and text-to-speech capabilities
- **Backup Tracker**: Monitor and analyze backup operations
- **Vulnerability Management**: Track and manage security vulnerabilities
- **Google Workspace Integration**: Calendar, Drive, and Sheets integration
- **JS Tools**: JSON validator, regex tester, cron parser, Base64 encoder/decoder

### AI Capabilities
- Log analysis and insights
- Script generation
- Vulnerability explanations
- Chat-based assistance
- Voice-to-AI interaction

### Technical Features
- Dark/Light theme support
- Responsive design
- Real-time updates
- File upload and management
- Export/import functionality

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- Supabase account
- OpenRouter API key (for AI features)
- Google Cloud Console project (for Google integration)

### 1. Environment Setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key
```

### 2. Supabase Database Setup

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'worker' CHECK (role IN ('manager', 'worker')),
  enabled BOOLEAN DEFAULT true,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Managers can update any user" ON users FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'manager'
  )
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'review', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "Users can view all tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Users can create tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update assigned tasks" ON tasks FOR UPDATE USING (
  auth.uid() = assigned_to OR auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'manager')
);

-- Backups table
CREATE TABLE backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_name TEXT NOT NULL,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'warning', 'failed')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  report TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all backups" ON backups FOR SELECT USING (true);
CREATE POLICY "Users can create backups" ON backups FOR INSERT WITH CHECK (true);

-- Vulnerabilities table
CREATE TABLE vulnerabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cve_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  system TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'unverified' CHECK (status IN ('unverified', 'in-progress', 'resolved')),
  cvss_score DECIMAL(3,1),
  affected_versions TEXT,
  remediation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE vulnerabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all vulnerabilities" ON vulnerabilities FOR SELECT USING (true);
CREATE POLICY "Users can create vulnerabilities" ON vulnerabilities FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update vulnerabilities" ON vulnerabilities FOR UPDATE USING (true);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true);

-- Storage policies
CREATE POLICY "Users can upload files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'files' AND auth.role() = 'authenticated'
);
CREATE POLICY "Users can view files" ON storage.objects FOR SELECT USING (
  bucket_id = 'files' AND auth.role() = 'authenticated'
);
```

### 3. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Google Cloud Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable APIs: Calendar API, Drive API, Sheets API
4. Create credentials (OAuth 2.0 Client ID)
5. Add your domain to authorized origins
6. Copy Client ID and API Key to `.env`

### 5. OpenRouter Setup (Optional)

1. Visit [OpenRouter](https://openrouter.ai/)
2. Create account and get API key
3. Users can add their API keys in the app settings

## Usage

### Default Login
- Create an account through the signup form
- First user becomes a manager automatically
- Subsequent users are workers by default

### User Roles
- **Manager**: Full access to all features, can manage users and assign tasks
- **Worker**: Can view dashboards, manage assigned tasks, use tools

### AI Features
- Configure OpenRouter API key in Settings → API Keys
- Use AI Assistant for system administration help
- Generate scripts with natural language descriptions
- Analyze logs and get vulnerability explanations

### Google Integration
- Connect Google account in Google Workspace section
- Create calendar events for tasks and maintenance
- Upload reports to Google Drive
- Export data to Google Sheets

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts for state management
├── lib/               # External service integrations
├── pages/             # Main application pages
├── common/            # Common utilities and components
└── App.jsx            # Main application component
```

### Key Technologies
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend and database
- **React Router** - Navigation
- **OpenRouter** - AI integration
- **Google APIs** - Workspace integration

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set environment variables
3. Deploy

### Deploy to Custom Server
1. Build the project: `npm run build`
2. Serve the `dist` folder with any static file server
3. Configure environment variables

## Security Notes

- All API keys are stored locally in the browser
- Supabase handles authentication and authorization
- Row Level Security (RLS) is enabled on all tables
- File uploads are restricted to authenticated users
- HTTPS is recommended for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the GitHub issues
2. Review the documentation
3. Create a new issue with details

---

**SysAdmin AI Ops Dashboard** - Streamlining system administration with AI-powered insights and automation.