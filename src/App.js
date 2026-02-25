import React, { useState, useEffect } from 'react';
import { Modal, SectionHeader } from './components';
import { 
  Home, Code, Palette, User, Calendar, 
  Edit2, Trash2, Save, X, ExternalLink, 
  Github, Linkedin, Mail, Sparkles 
} from 'lucide-react';

// API base URL - use relative path for Vercel deployment
const API_BASE = '/api';

const App = () => {
  // State management
  const [currentPage, setCurrentPage] = useState('home');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [ventures, setVentures] = useState([]);
  const [milestones, setMilestones] = useState([]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, projectsRes, venturesRes, milestonesRes] = await Promise.all([
        fetch(`${API_BASE}/profile`),
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/ventures`),
        fetch(`${API_BASE}/milestones`)
      ]);

      const profileData = await profileRes.json();
      const projectsData = await projectsRes.json();
      const venturesData = await venturesRes.json();
      const milestonesData = await milestonesRes.json();

      if (profileData.success) setProfile(profileData.data);
      if (projectsData.success) setProjects(projectsData.data);
      if (venturesData.success) setVentures(venturesData.data);
      if (milestonesData.success) setMilestones(milestonesData.data);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // API handlers for Profile
  const updateProfile = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        setProfile(result.data);
        return true;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
      return false;
    }
  };

  // API handlers for Projects
  const createProject = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        setProjects([result.data, ...projects]);
        return true;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Failed to create project');
      return false;
    }
  };

  const updateProject = async (id, data) => {
    try {
      const res = await fetch(`${API_BASE}/projects?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        setProjects(projects.map(p => p._id === id ? result.data : p));
        return true;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Failed to update project');
      return false;
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`${API_BASE}/projects?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setProjects(projects.filter(p => p._id !== id));
        return true;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
      return false;
    }
  };

  // API handlers for Ventures
  const createVenture = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/ventures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        setVentures([result.data, ...ventures]);
        return true;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('Error creating venture:', err);
      alert('Failed to create venture');
      return false;
    }
  };

  const updateVenture = async (id, data) => {
    try {
      const res = await fetch(`${API_BASE}/ventures?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        setVentures(ventures.map(v => v._id === id ? result.data : v));
        return true;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('Error updating venture:', err);
      alert('Failed to update venture');
      return false;
    }
  };

  const deleteVenture = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venture?')) return;
    try {
      const res = await fetch(`${API_BASE}/ventures?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setVentures(ventures.filter(v => v._id !== id));
        return true;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('Error deleting venture:', err);
      alert('Failed to delete venture');
      return false;
    }
  };

  // API handlers for Milestones
  const createMilestone = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        setMilestones([result.data, ...milestones]);
        return true;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('Error creating milestone:', err);
      alert('Failed to create milestone');
      return false;
    }
  };

  const updateMilestone = async (id, data) => {
    try {
      const res = await fetch(`${API_BASE}/milestones?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        setMilestones(milestones.map(m => m._id === id ? result.data : m));
        return true;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('Error updating milestone:', err);
      alert('Failed to update milestone');
      return false;
    }
  };

  const deleteMilestone = async (id) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;
    try {
      const res = await fetch(`${API_BASE}/milestones?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setMilestones(milestones.filter(m => m._id !== id));
        return true;
      }
      throw new Error(result.error);
    } catch (err) {
      console.error('Error deleting milestone:', err);
      alert('Failed to delete milestone');
      return false;
    }
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  // Navigation component
  const Navigation = () => (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Michelle.Hub
            </h1>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'projects', label: 'Projects', icon: Code },
              { id: 'ventures', label: 'Ventures', icon: Palette },
              { id: 'about', label: 'About', icon: User }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  currentPage === id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-indigo-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-xl transition-all ${
              isEditMode
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isEditMode ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>
    </nav>
  );

  // Home Page
  const HomePage = () => (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-4xl animate-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
            {profile?.name?.charAt(0) || 'M'}
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {profile?.name || 'Loading...'}
          </h1>
          <p className="text-2xl text-slate-600 mb-6">{profile?.title || ''}</p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {profile?.bio || ''}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer"
               className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
              <Github className="w-6 h-6 text-slate-700" />
            </a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
               className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
              <Linkedin className="w-6 h-6 text-slate-700" />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`}
               className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
              <Mail className="w-6 h-6 text-slate-700" />
            </a>
          )}
        </div>
        {isEditMode && (
          <button
            onClick={() => openModal('profile', profile)}
            className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );

  // Projects Page
  const ProjectsPage = () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SectionHeader 
        title="Technical Projects" 
        icon={Code}
        onAdd={isEditMode ? () => openModal('project') : null}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-indigo-100">
            <h3 className="text-xl font-bold text-slate-800 mb-3">{project.title}</h3>
            <p className="text-slate-600 mb-4 line-clamp-3">{project.description}</p>
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm">
                  <ExternalLink className="w-4 h-4" /> View Project
                </a>
              )}
              {isEditMode && (
                <>
                  <button onClick={() => openModal('project', project)}
                          className="ml-auto p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteProject(project._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No projects yet. {isEditMode && 'Click "Add New" to create one!'}
        </div>
      )}
    </div>
  );

  // Ventures Page
  const VenturesPage = () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SectionHeader 
        title="Creative Ventures" 
        icon={Palette}
        onAdd={isEditMode ? () => openModal('venture') : null}
      />
      <div className="grid md:grid-cols-2 gap-6">
        {ventures.map(venture => (
          <div key={venture._id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-purple-100">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-slate-800">{venture.title}</h3>
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">
                {venture.type}
              </span>
            </div>
            <p className="text-slate-600 mb-4">{venture.description}</p>
            <div className="flex gap-2 mt-4">
              {venture.link && (
                <a href={venture.link} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm">
                  <ExternalLink className="w-4 h-4" /> View More
                </a>
              )}
              {isEditMode && (
                <>
                  <button onClick={() => openModal('venture', venture)}
                          className="ml-auto p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteVenture(venture._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {ventures.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No ventures yet. {isEditMode && 'Click "Add New" to create one!'}
        </div>
      )}
    </div>
  );

  // About Page
  const AboutPage = () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <SectionHeader title="About Me" icon={User} />
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Profile</h3>
              <p className="text-slate-600 mb-4">{profile?.bio || ''}</p>
              <div className="space-y-2">
                {profile?.email && (
                  <p className="text-slate-600"><strong>Email:</strong> {profile.email}</p>
                )}
                {profile?.location && (
                  <p className="text-slate-600"><strong>Location:</strong> {profile.location}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full">
                    {skill}
                  </span>
                )) || <p className="text-slate-500">No skills listed</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionHeader 
          title="Milestones" 
          icon={Calendar}
          onAdd={isEditMode ? () => openModal('milestone') : null}
        />
        <div className="space-y-4">
          {milestones.map(milestone => (
            <div key={milestone._id} className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{milestone.title}</h3>
                  {milestone.description && (
                    <p className="text-slate-600 mb-2">{milestone.description}</p>
                  )}
                  <p className="text-sm text-indigo-600">
                    {new Date(milestone.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                {isEditMode && (
                  <div className="flex gap-2">
                    <button onClick={() => openModal('milestone', milestone)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMilestone(milestone._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {milestones.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No milestones yet. {isEditMode && 'Click "Add New" to create one!'}
          </div>
        )}
      </div>
    </div>
  );

  // Form Modal Component
  const FormModal = () => {
    const [formData, setFormData] = useState(editingItem || {});

    const handleSubmit = async (e) => {
      e.preventDefault();
      let success = false;

      switch (modalType) {
        case 'profile':
          success = await updateProfile(formData);
          break;
        case 'project':
          if (editingItem) {
            success = await updateProject(editingItem._id, formData);
          } else {
            success = await createProject(formData);
          }
          break;
        case 'venture':
          if (editingItem) {
            success = await updateVenture(editingItem._id, formData);
          } else {
            success = await createVenture(formData);
          }
          break;
        case 'milestone':
          if (editingItem) {
            success = await updateMilestone(editingItem._id, formData);
          } else {
            success = await createMilestone(formData);
          }
          break;
        default:
          break;
      }

      if (success) closeModal();
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleArrayChange = (name, value) => {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(Boolean)
      }));
    };

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
    const labelClass = "block text-sm font-semibold text-slate-700 mb-2";

    return (
      <Modal title={`${editingItem ? 'Edit' : 'Add'} ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalType === 'profile' && (
            <>
              <div>
                <label className={labelClass}>Name *</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Title *</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Bio</label>
                <textarea name="bio" value={formData.bio || ''} onChange={handleChange} className={inputClass} rows="4" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Skills (comma-separated)</label>
                <input type="text" value={formData.skills?.join(', ') || ''} onChange={(e) => handleArrayChange('skills', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>GitHub URL</label>
                <input type="url" name="github" value={formData.github || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input type="url" name="linkedin" value={formData.linkedin || ''} onChange={handleChange} className={inputClass} />
              </div>
            </>
          )}

          {modalType === 'project' && (
            <>
              <div>
                <label className={labelClass}>Title *</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} className={inputClass} rows="4" required />
              </div>
              <div>
                <label className={labelClass}>Technologies (comma-separated)</label>
                <input type="text" value={formData.technologies?.join(', ') || ''} onChange={(e) => handleArrayChange('technologies', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Project Link</label>
                <input type="url" name="link" value={formData.link || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>GitHub URL</label>
                <input type="url" name="github" value={formData.github || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="featured" checked={formData.featured || false} onChange={handleChange} className="w-4 h-4" />
                <label className="text-sm text-slate-700">Featured Project</label>
              </div>
            </>
          )}

          {modalType === 'venture' && (
            <>
              <div>
                <label className={labelClass}>Title *</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Type *</label>
                <input type="text" name="type" value={formData.type || ''} onChange={handleChange} className={inputClass} placeholder="e.g., Poetry, Design, Art" required />
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} className={inputClass} rows="4" required />
              </div>
              <div>
                <label className={labelClass}>Link</label>
                <input type="url" name="link" value={formData.link || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="featured" checked={formData.featured || false} onChange={handleChange} className="w-4 h-4" />
                <label className="text-sm text-slate-700">Featured Venture</label>
              </div>
            </>
          )}

          {modalType === 'milestone' && (
            <>
              <div>
                <label className={labelClass}>Title *</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} className={inputClass} rows="3" />
              </div>
              <div>
                <label className={labelClass}>Date *</label>
                <input type="date" name="date" value={formData.date?.split('T')[0] || ''} onChange={handleChange} className={inputClass} required />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
              <Save className="w-4 h-4" /> Save
            </button>
            <button type="button" onClick={closeModal} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // Loading and Error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-100 text-red-700 p-6 rounded-2xl mb-4">
            <p className="font-semibold mb-2">Error Loading Data</p>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={fetchAllData}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navigation />
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'projects' && <ProjectsPage />}
        {currentPage === 'ventures' && <VenturesPage />}
        {currentPage === 'about' && <AboutPage />}
      </main>
      {showModal && <FormModal />}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-indigo-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600">
          <p>&copy; 2026 {profile?.name || 'Michelle.Hub'}. Built with React & MongoDB.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
