import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, X, Check, Settings, FolderOpen, Upload, Image, ArrowLeft, RefreshCw, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { 
    projects, settings, 
    addProject, updateProject, deleteProject, 
    updateSettings, uploadImage, refreshData,
    API_URL
  } = useData();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('settings');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  
  // Project form state
  const initialProjectForm = {
    title: '',
    description_en: '',
    description_es: '',
    impact_en: '',
    impact_es: '',
    stack: '',
    link: '',
    images: [],
    featured: false
  };
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const fileInputRef = useRef(null);

  // Update settings form when settings load
  React.useEffect(() => {
    if (Object.keys(settings).length > 0) {
      setSettingsForm(settings);
    }
  }, [settings]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // ============ SETTINGS HANDLERS ============
  const handleSettingChange = (key, lang, value) => {
    setSettingsForm(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [lang]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateSettings(settingsForm);
      showMessage('success', 'Settings saved successfully!');
    } catch (err) {
      showMessage('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // ============ PROJECT HANDLERS ============
  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setProjectForm({
      ...project,
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : project.stack,
      images: project.images || [],
      featured: project.featured || false
    });
    setIsAddingProject(false);
  };

  const handleSaveProject = async () => {
    setSaving(true);
    try {
      const projectData = {
        ...projectForm,
        stack: projectForm.stack.split(',').map(s => s.trim()).filter(s => s)
      };

      if (editingProjectId) {
        await updateProject(editingProjectId, projectData);
        showMessage('success', 'Project updated!');
      } else {
        await addProject(projectData);
        showMessage('success', 'Project created!');
      }
      resetProjectForm();
    } catch (err) {
      showMessage('error', 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        showMessage('success', 'Project deleted');
      } catch (err) {
        showMessage('error', 'Failed to delete project');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSaving(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }
      
      setProjectForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      showMessage('success', `${files.length} image(s) uploaded`);
    } catch (err) {
      showMessage('error', 'Failed to upload image(s)');
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setProjectForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetProjectForm = () => {
    setProjectForm(initialProjectForm);
    setEditingProjectId(null);
    setIsAddingProject(false);
  };

  // ============ RENDER ============
  return (
    <div className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </Link>
          <h2 className="mono" style={{ margin: 0 }}>{t('admin.dashboard_title')}</h2>
        </div>
        <button onClick={refreshData} style={iconBtnStyle} title="Refresh data">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div style={{
          ...toastStyle,
          background: message.type === 'success' ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 68, 68, 0.1)',
          borderColor: message.type === 'success' ? '#00c853' : '#ff4444'
        }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('settings')}
          style={{ ...tabStyle, ...(activeTab === 'settings' ? tabActiveStyle : {}) }}
        >
          <Settings size={16} /> Site Settings
        </button>
        <button 
          onClick={() => setActiveTab('projects')}
          style={{ ...tabStyle, ...(activeTab === 'projects' ? tabActiveStyle : {}) }}
        >
          <FolderOpen size={16} /> Projects
        </button>
        <button 
          onClick={() => setActiveTab('experiences')}
          style={{ ...tabStyle, ...(activeTab === 'experiences' ? tabActiveStyle : {}) }}
        >
          <Briefcase size={16} /> Experiences
        </button>
      </div>

      {/* ============ SETTINGS TAB ============ */}
      {activeTab === 'settings' && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '2rem', color: 'var(--accent-color)' }}>Site Configuration</h3>
          
          {/* Name */}
          <SettingField 
            label="Name / Nombre"
            keyName="name"
            values={settingsForm.name}
            onChange={handleSettingChange}
          />

          {/* Role */}
          <SettingField 
            label="Role / Rol"
            keyName="role"
            values={settingsForm.role}
            onChange={handleSettingChange}
          />

          {/* Status */}
          <SettingField 
            label="Status / Estado"
            keyName="status"
            values={settingsForm.status}
            onChange={handleSettingChange}
          />

          {/* Location */}
          <SettingField 
            label="Location / Ubicación"
            keyName="location"
            values={settingsForm.location}
            onChange={handleSettingChange}
          />

          {/* Bio Short */}
          <SettingField 
            label="Short Bio / Bio Corta"
            keyName="bio_short"
            values={settingsForm.bio_short}
            onChange={handleSettingChange}
            multiline
          />

          {/* Bio Long */}
          <SettingField 
            label="Long Bio / Bio Larga"
            keyName="bio_long"
            values={settingsForm.bio_long}
            onChange={handleSettingChange}
            multiline
          />

          {/* Philosophy */}
          <SettingField 
            label="Philosophy / Filosofía"
            keyName="philosophy"
            values={settingsForm.philosophy}
            onChange={handleSettingChange}
            multiline
          />

          {/* Specializations */}
          <SettingField 
            label="Specializations (comma separated)"
            keyName="specializations"
            values={settingsForm.specializations}
            onChange={handleSettingChange}
          />

          <h3 style={{ marginBottom: '1.5rem', marginTop: '3rem', color: 'var(--accent-color)' }}>About Section Extras</h3>

          <SettingField 
            label="Primary Tech (Top 3, comma separated)"
            keyName="primary_tech"
            values={settingsForm.primary_tech}
            onChange={handleSettingChange}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {[1, 2, 3, 4].map(n => (
                  <div key={n} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Specialty Card {n}</h4>
                      <SettingField 
                        label={`Label ${n} / Título ${n}`}
                        keyName={`specialty_${n}_label`}
                        values={settingsForm[`specialty_${n}_label`] || {}}
                        onChange={handleSettingChange}
                      />
                      <SettingField 
                        label={`Desc ${n} / Descripción ${n}`}
                        keyName={`specialty_${n}_desc`}
                        values={settingsForm[`specialty_${n}_desc`] || {}}
                        onChange={handleSettingChange}
                      />
                  </div>
              ))}
          </div>

          <button 
            onClick={handleSaveSettings} 
            disabled={saving}
            style={{ ...btnPrimaryStyle, marginTop: '2rem' }}
          >
            <Check size={18} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}

      {/* ============ PROJECTS TAB ============ */}
      {activeTab === 'projects' && (
        <div>
          {/* Add button */}
          {!isAddingProject && !editingProjectId && (
            <button 
              onClick={() => setIsAddingProject(true)}
              className="glass"
              style={{ padding: '0.8rem 1.2rem', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', color: 'var(--accent-color)', marginBottom: '2rem' }}
            >
              <Plus size={18} /> {t('admin.add_project')}
            </button>
          )}

          {/* Project Form */}
          {(isAddingProject || editingProjectId) && (
            <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
                {editingProjectId ? 'Edit Project' : 'New Project'}
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <input 
                  placeholder="Project Title" 
                  value={projectForm.title} 
                  onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                  style={inputStyle}
                />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Description (English)</label>
                    <textarea 
                      value={projectForm.description_en}
                      onChange={e => setProjectForm({...projectForm, description_en: e.target.value})}
                      style={{ ...inputStyle, minHeight: '100px' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Descripción (Español)</label>
                    <textarea 
                      value={projectForm.description_es}
                      onChange={e => setProjectForm({...projectForm, description_es: e.target.value})}
                      style={{ ...inputStyle, minHeight: '100px' }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Impact (English)</label>
                    <input 
                      value={projectForm.impact_en}
                      onChange={e => setProjectForm({...projectForm, impact_en: e.target.value})}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Impacto (Español)</label>
                    <input 
                      value={projectForm.impact_es}
                      onChange={e => setProjectForm({...projectForm, impact_es: e.target.value})}
                      style={inputStyle}
                    />
                  </div>
                </div>
                
                <input 
                  placeholder="Tech Stack (comma separated: React, Node, ...)" 
                  value={projectForm.stack}
                  onChange={e => setProjectForm({...projectForm, stack: e.target.value})}
                  style={inputStyle}
                />
                
                <input 
                  placeholder="Project Link (URL)" 
                  value={projectForm.link} 
                  onChange={e => setProjectForm({...projectForm, link: e.target.value})}
                  style={inputStyle}
                />

                {/* Featured Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0, 245, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(0, 245, 255, 0.1)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      onChange={e => setProjectForm({...projectForm, featured: e.target.checked})}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--accent-color)' }}
                    />
                    <span style={{ color: 'var(--accent-color)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                      ⭐ Featured Project
                    </span>
                  </label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    (Shown in "Selected Projects" section with carousel)
                  </span>
                </div>

                {/* Image Upload */}
                <div style={{ marginTop: '1rem' }}>
                  <label style={labelStyle}>Project Images</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                    {projectForm.images.map((img, index) => (
                      <div key={index} style={imagePreviewStyle}>
                        <img 
                          src={img.startsWith('http') ? img : `${API_URL}${img}`} 
                          alt={`Preview ${index}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <button 
                          onClick={() => removeImage(index)}
                          style={imageRemoveBtn}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Upload button */}
                    <label style={uploadBoxStyle}>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <Upload size={24} style={{ color: 'var(--text-dim)' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Upload</span>
                    </label>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={handleSaveProject} disabled={saving} style={btnPrimaryStyle}>
                    <Check size={18} /> {saving ? 'Saving...' : t('admin.save')}
                  </button>
                  <button onClick={resetProjectForm} style={btnSecondaryStyle}>
                    <X size={18} /> {t('admin.cancel')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Projects List */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.map(p => (
              <div key={p.id} className="glass" style={{ padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {p.images && p.images.length > 0 && (
                    <div style={{ width: '60px', height: '40px', borderRadius: '6px', overflow: 'hidden' }}>
                      <img 
                        src={p.images[0].startsWith('http') ? p.images[0] : `${API_URL}${p.images[0]}`}
                        alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  {(!p.images || p.images.length === 0) && (
                    <div style={{ width: '60px', height: '40px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image size={16} style={{ color: 'var(--text-dim)' }} />
                    </div>
                  )}
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{p.title}</h4>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                      {p.stack?.join(', ')} • {p.images?.length || 0} images
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditProject(p)} style={iconBtnStyle}><Edit2 size={18} /></button>
                  <button onClick={() => handleDeleteProject(p.id)} style={{...iconBtnStyle, color: '#ff4444'}}><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ EXPERIENCES TAB ============ */}
      {activeTab === 'experiences' && (
        <ExperiencesManager 
          t={t} 
          showMessage={showMessage} 
        />
      )}
    </div>
  );
};

// Sub-component for Experiences
const ExperiencesManager = ({ t, showMessage }) => {
  const { experiences, addExperience, updateExperience, deleteExperience } = useData();
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const initialForm = {
    role: '',
    company: '',
    period: '',
    description_en: '',
    description_es: '',
    tech: '',
    type: 'main',
    context: '',
    layout_delay: '0.2s'
  };
  const [form, setForm] = useState(initialForm);

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setForm({
      ...exp,
      tech: Array.isArray(exp.tech) ? exp.tech.join(', ') : exp.tech
    });
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete experience?')) {
      try {
        await deleteExperience(id);
        showMessage('success', 'Experience deleted');
      } catch (e) {
        showMessage('error', 'Failed to delete');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        tech: form.tech.split(',').map(s => s.trim()).filter(s => s)
      };

      if (editingId) {
        await updateExperience(editingId, data);
        showMessage('success', 'Experience updated');
      } else {
        await addExperience(data);
        showMessage('success', 'Experience created');
      }
      resetForm();
    } catch (e) {
      showMessage('error', 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div>
      {!isAdding && !editingId && (
        <button 
          onClick={() => setIsAdding(true)}
          className="glass"
          style={{ padding: '0.8rem 1.2rem', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', color: 'var(--accent-color)', marginBottom: '2rem' }}
        >
          <Plus size={18} /> Add Experience
        </button>
      )}

      {(isAdding || editingId) && (
        <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
            {editingId ? 'Edit Experience' : 'New Experience'}
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Role</label>
                <input style={inputStyle} value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>Company</label>
                <input style={inputStyle} value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Period</label>
                <input style={inputStyle} value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>Type</label>
                <select style={inputStyle} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="main">Main (Card)</option>
                  <option value="minor">Minor (List Item)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Description (EN)</label>
                <textarea style={{...inputStyle, minHeight: '80px'}} value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>Description (ES)</label>
                <textarea style={{...inputStyle, minHeight: '80px'}} value={form.description_es} onChange={e => setForm({...form, description_es: e.target.value})} />
              </div>
            </div>

            {form.type === 'main' && (
              <div>
                 <label style={labelStyle}>Tech Stack (comma separated)</label>
                 <input style={inputStyle} value={form.tech} onChange={e => setForm({...form, tech: e.target.value})} />
              </div>
            )}
            
            {form.type === 'minor' && (
               <div>
                 <label style={labelStyle}>Context (e.g. Various Clients)</label>
                 <input style={inputStyle} value={form.context} onChange={e => setForm({...form, context: e.target.value})} />
               </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={handleSave} disabled={saving} style={btnPrimaryStyle}>
                <Check size={18} /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={resetForm} style={btnSecondaryStyle}>
                <X size={18} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {experiences.map(exp => (
          <div key={exp.id} className="glass" style={{ padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
               <h4 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 {exp.role} 
                 <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: exp.type === 'main' ? 'rgba(0,245,255,0.1)' : 'rgba(255,255,255,0.1)', color: exp.type === 'main' ? 'var(--accent-color)' : 'var(--text-dim)' }}>
                   {exp.type.toUpperCase()}
                 </span>
               </h4>
               <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{exp.company} • {exp.period}</p>
             </div>
             <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(exp)} style={iconBtnStyle}><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(exp.id)} style={{...iconBtnStyle, color: '#ff4444'}}><Trash2 size={18} /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reusable Setting Field Component
const SettingField = ({ label, keyName, values, onChange, multiline = false }) => {
  const Component = multiline ? 'textarea' : 'input';
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
        <div>
          <span style={langLabelStyle}>EN</span>
          <Component
            value={values?.en || ''}
            onChange={e => onChange(keyName, 'en', e.target.value)}
            style={{ ...inputStyle, ...(multiline ? { minHeight: '80px' } : {}) }}
          />
        </div>
        <div>
          <span style={langLabelStyle}>ES</span>
          <Component
            value={values?.es || ''}
            onChange={e => onChange(keyName, 'es', e.target.value)}
            style={{ ...inputStyle, ...(multiline ? { minHeight: '80px' } : {}) }}
          />
        </div>
      </div>
    </div>
  );
};

// ============ STYLES ============
const inputStyle = {
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid var(--border-color)',
  padding: '0.8rem',
  borderRadius: '6px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  width: '100%',
  resize: 'vertical'
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  fontWeight: 500
};

const langLabelStyle = {
  display: 'inline-block',
  marginBottom: '0.3rem',
  fontSize: '0.7rem',
  color: 'var(--accent-color)',
  fontFamily: 'var(--font-mono)'
};

const btnPrimaryStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.8rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  background: 'var(--accent-color)',
  color: '#000',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
  transition: 'all 0.2s ease'
};

const btnSecondaryStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.8rem 1.5rem',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  background: 'transparent',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)'
};

const iconBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '0.5rem',
  transition: 'color 0.2s',
  display: 'flex',
  alignItems: 'center'
};

const tabStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.8rem 1.2rem',
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.9rem',
  borderRadius: '8px 8px 0 0',
  transition: 'all 0.2s ease'
};

const tabActiveStyle = {
  color: 'var(--accent-color)',
  background: 'rgba(0, 245, 255, 0.05)',
  borderBottom: '2px solid var(--accent-color)'
};

const toastStyle = {
  padding: '1rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  border: '1px solid',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.9rem'
};

const imagePreviewStyle = {
  width: '100px',
  height: '100px',
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)'
};

const imageRemoveBtn = {
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: 'rgba(255, 68, 68, 0.9)',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0
};

const uploadBoxStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '8px',
  border: '2px dashed var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: 'rgba(255,255,255,0.02)'
};

export default AdminDashboard;
