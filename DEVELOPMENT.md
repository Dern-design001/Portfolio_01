# Development Guide

## Project Structure

```
src/
├── App.js          # Main application component
├── components.js   # Reusable UI components
├── index.js        # React entry point
└── index.css       # Global styles and Tailwind
```

## Adding New Features

### Adding a New Page

1. **Add navigation item** in `App.js`:
```javascript
{ id: 'newpage', label: 'New Page', icon: YourIcon }
```

2. **Create page component**:
```javascript
const NewPage = () => (
  <div className="max-w-7xl mx-auto px-6 py-12">
    <SectionHeader title="New Page" icon={YourIcon} />
    {/* Your content */}
  </div>
);
```

3. **Add to main render**:
```javascript
{currentPage === 'newpage' && <NewPage />}
```

### Adding a New Data Type

1. **Create MongoDB model** in `api/models/YourModel.js`:
```javascript
const mongoose = require('mongoose');

const yourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.models.YourModel || mongoose.model('YourModel', yourSchema);
```

2. **Create API endpoint** in `api/yourmodel.js`:
```javascript
const { connectToDatabase } = require('./db');
const YourModel = require('./models/YourModel');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectToDatabase();

  // Handle GET, POST, PUT, DELETE
  // ... implement CRUD operations
};
```

3. **Add state in App.js**:
```javascript
const [yourData, setYourData] = useState([]);
```

4. **Add fetch in useEffect**:
```javascript
const yourDataRes = await fetch(`${API_BASE}/yourmodel`);
const yourDataResult = await yourDataRes.json();
if (yourDataResult.success) setYourData(yourDataResult.data);
```

5. **Create CRUD functions**:
```javascript
const createYourData = async (data) => { /* ... */ };
const updateYourData = async (id, data) => { /* ... */ };
const deleteYourData = async (id) => { /* ... */ };
```

6. **Add form fields** in FormModal component

### Adding a New Component

Create in `src/components.js`:

```javascript
export const YourComponent = ({ prop1, prop2 }) => (
  <div className="your-styles">
    {/* Component content */}
  </div>
);
```

Import in `App.js`:
```javascript
import { Modal, SectionHeader, YourComponent } from './components';
```

## Styling Guidelines

### Color Palette
- Primary: `bg-indigo-600`, `text-indigo-600`
- Secondary: `bg-purple-600`, `text-purple-600`
- Accent: `bg-pink-600`, `text-pink-600`
- Neutral: `bg-slate-100`, `text-slate-600`
- Success: `bg-green-600`, `text-green-600`
- Error: `bg-red-600`, `text-red-600`

### Common Classes
- Cards: `bg-white rounded-2xl shadow-lg p-6 border border-indigo-100`
- Buttons: `px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all`
- Inputs: `w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500`
- Headings: `text-3xl font-bold text-slate-900`

### Responsive Design
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first approach
- Test on multiple screen sizes

## API Development

### Adding a New Endpoint

1. Create file in `api/` directory
2. Export async function: `module.exports = async (req, res) => {}`
3. Add CORS headers
4. Handle OPTIONS for preflight
5. Connect to database
6. Implement HTTP methods (GET, POST, PUT, DELETE)
7. Add error handling
8. Return JSON responses

### Response Format

Success:
```javascript
res.status(200).json({
  success: true,
  data: yourData
});
```

Error:
```javascript
res.status(400).json({
  success: false,
  error: 'Error message'
});
```

## State Management

### Current Approach
- React hooks (useState, useEffect)
- Local component state
- Props drilling for shared state

### Future Considerations
For larger applications, consider:
- Context API for global state
- Redux for complex state management
- React Query for server state

## Form Handling

### Current Pattern
```javascript
const [formData, setFormData] = useState(initialData);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // API call
};
```

### Validation
- HTML5 validation (required, type="email", etc.)
- Custom validation in submit handler
- Display errors with alerts or inline messages

## Testing

### Manual Testing
1. Test all CRUD operations
2. Test form validation
3. Test error states
4. Test loading states
5. Test responsive design
6. Test browser compatibility

### Future: Automated Testing
Consider adding:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

## Performance Optimization

### Current Optimizations
- Parallel API calls with Promise.all
- Conditional rendering
- CSS transitions instead of JS animations

### Future Optimizations
- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for event handlers
- Code splitting with React.lazy
- Image optimization
- API response caching

## Deployment

### Vercel Configuration
- `vercel.json` configures routes
- Build command: `npm run build`
- Output directory: `build`
- Environment variables in dashboard

### Environment Variables
- Development: `.env` file
- Production: Vercel dashboard
- Required: `MONGODB_URI`

## Debugging

### Common Issues

**API not responding:**
- Check Vercel logs
- Verify environment variables
- Test endpoints with curl

**Styling broken:**
- Rebuild Tailwind: `npm run build`
- Check browser console for errors
- Verify Tailwind config

**State not updating:**
- Check React DevTools
- Verify state setter calls
- Look for async issues

### Development Tools
- React DevTools (browser extension)
- MongoDB Compass (database GUI)
- Vercel CLI for local testing
- Browser DevTools (Network, Console)

## Code Style

### Naming Conventions
- Components: PascalCase (`HomePage`, `ProjectCard`)
- Functions: camelCase (`fetchData`, `handleSubmit`)
- Constants: UPPER_SNAKE_CASE (`API_BASE`)
- Files: camelCase or kebab-case

### Best Practices
- Keep components small and focused
- Extract reusable logic into functions
- Use meaningful variable names
- Add comments for complex logic
- Handle errors gracefully
- Validate user input
- Use semantic HTML
- Follow accessibility guidelines

## Git Workflow

### Branching
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes

### Commit Messages
- Use clear, descriptive messages
- Start with verb (Add, Fix, Update, Remove)
- Reference issues when applicable

### Before Committing
- Test locally
- Check for console errors
- Verify no sensitive data in code
- Update documentation if needed

## Resources

### Documentation
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [MongoDB](https://docs.mongodb.com)
- [Vercel](https://vercel.com/docs)
- [Lucide Icons](https://lucide.dev)

### Learning
- React patterns and best practices
- MongoDB schema design
- RESTful API design
- Responsive web design
- Accessibility (WCAG guidelines)

## Support

For issues or questions:
1. Check documentation files
2. Review error messages and logs
3. Search for similar issues online
4. Test in isolation to identify root cause
5. Document the solution for future reference
