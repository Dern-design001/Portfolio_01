# Testing Guide

## Manual Testing Checklist

### 1. Initial Load
- [ ] App loads without errors
- [ ] Loading spinner appears while fetching data
- [ ] Data loads from MongoDB successfully
- [ ] Navigation bar is visible and functional

### 2. Navigation
- [ ] Home page displays correctly
- [ ] Projects page displays correctly
- [ ] Ventures page displays correctly
- [ ] About page displays correctly
- [ ] Active page is highlighted in navigation

### 3. Home Page
- [ ] Profile name displays
- [ ] Profile title displays
- [ ] Bio text displays
- [ ] Social media icons appear (if URLs provided)
- [ ] Social media links work correctly
- [ ] Edit Profile button appears in edit mode

### 4. Projects Page
- [ ] All projects display in grid layout
- [ ] Project cards show title, description, technologies
- [ ] External links work correctly
- [ ] "Add New" button appears in edit mode
- [ ] Edit/Delete buttons appear on cards in edit mode
- [ ] Empty state message shows when no projects exist

### 5. Ventures Page
- [ ] All ventures display in grid layout
- [ ] Venture cards show title, type, description
- [ ] External links work correctly
- [ ] "Add New" button appears in edit mode
- [ ] Edit/Delete buttons appear on cards in edit mode
- [ ] Empty state message shows when no ventures exist

### 6. About Page
- [ ] Profile information displays correctly
- [ ] Skills display as tags
- [ ] Milestones display in chronological order
- [ ] Dates format correctly
- [ ] "Add New" button appears in edit mode for milestones
- [ ] Edit/Delete buttons appear on milestones in edit mode

### 7. Edit Mode
- [ ] Edit button toggles edit mode on/off
- [ ] Edit button changes appearance when active
- [ ] All edit controls appear/disappear correctly

### 8. Profile Editing
- [ ] Edit Profile modal opens
- [ ] All fields populate with current data
- [ ] Form validation works (required fields)
- [ ] Save updates profile successfully
- [ ] Cancel closes modal without saving
- [ ] Changes reflect immediately after save

### 9. Project CRUD Operations
- [ ] Create: Modal opens with empty form
- [ ] Create: Required fields are validated
- [ ] Create: New project appears after save
- [ ] Update: Modal opens with existing data
- [ ] Update: Changes save successfully
- [ ] Delete: Confirmation dialog appears
- [ ] Delete: Project removes after confirmation

### 10. Venture CRUD Operations
- [ ] Create: Modal opens with empty form
- [ ] Create: Required fields are validated
- [ ] Create: New venture appears after save
- [ ] Update: Modal opens with existing data
- [ ] Update: Changes save successfully
- [ ] Delete: Confirmation dialog appears
- [ ] Delete: Venture removes after confirmation

### 11. Milestone CRUD Operations
- [ ] Create: Modal opens with empty form
- [ ] Create: Required fields are validated
- [ ] Create: Date picker works correctly
- [ ] Create: New milestone appears after save
- [ ] Update: Modal opens with existing data
- [ ] Update: Changes save successfully
- [ ] Delete: Confirmation dialog appears
- [ ] Delete: Milestone removes after confirmation

### 12. Error Handling
- [ ] Network errors display user-friendly message
- [ ] Failed API calls show appropriate alerts
- [ ] Retry button works after error
- [ ] Invalid data shows validation errors

### 13. Responsive Design
- [ ] Layout adapts to mobile screens
- [ ] Navigation works on mobile
- [ ] Cards stack properly on small screens
- [ ] Modals are usable on mobile
- [ ] Touch interactions work correctly

### 14. Performance
- [ ] Initial load is reasonably fast
- [ ] Page transitions are smooth
- [ ] No unnecessary re-renders
- [ ] API calls are optimized

## API Testing

### Test Profile Endpoint

```bash
# Get profile
curl http://localhost:3000/api/profile

# Update profile
curl -X PUT http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Michelle Susan Ezhilarasi",
    "title": "Computer Science Engineer",
    "bio": "Passionate about technology and creativity",
    "email": "michelle@example.com",
    "skills": ["React", "Node.js", "MongoDB"]
  }'
```

### Test Projects Endpoint

```bash
# Get all projects
curl http://localhost:3000/api/projects

# Create project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Portfolio Website",
    "description": "A modern portfolio built with React",
    "technologies": ["React", "MongoDB", "Vercel"],
    "featured": true
  }'

# Update project (replace <id> with actual ID)
curl -X PUT "http://localhost:3000/api/projects?id=<id>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Portfolio Website"
  }'

# Delete project (replace <id> with actual ID)
curl -X DELETE "http://localhost:3000/api/projects?id=<id>"
```

### Test Ventures Endpoint

```bash
# Get all ventures
curl http://localhost:3000/api/ventures

# Create venture
curl -X POST http://localhost:3000/api/ventures \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Poetry Collection",
    "description": "A collection of modern poetry",
    "type": "Poetry",
    "featured": true
  }'
```

### Test Milestones Endpoint

```bash
# Get all milestones
curl http://localhost:3000/api/milestones

# Create milestone
curl -X POST http://localhost:3000/api/milestones \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Graduated University",
    "description": "Completed Computer Science degree",
    "date": "2024-05-15"
  }'
```

## Browser Testing

Test in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Color contrast is sufficient
- [ ] Alt text for images (if any)
- [ ] Screen reader compatibility

## Common Issues and Solutions

### Issue: "Failed to load data"
**Solution**: Check MongoDB connection string and network connectivity

### Issue: Changes don't save
**Solution**: Verify API endpoints are working and check browser console for errors

### Issue: Styling looks broken
**Solution**: Ensure Tailwind CSS is properly configured and built

### Issue: Modal doesn't close
**Solution**: Check for JavaScript errors in console, verify event handlers

### Issue: Delete confirmation doesn't appear
**Solution**: Check browser popup blocker settings
