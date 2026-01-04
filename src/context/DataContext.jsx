import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [settingsRes, projectsRes, experiencesRes] = await Promise.all([
          fetch(`${API_URL}/api/settings`),
          fetch(`${API_URL}/api/projects`),
          fetch(`${API_URL}/api/experiences`)
        ]);

        if (!settingsRes.ok || !projectsRes.ok || !experiencesRes.ok) {
          throw new Error('Failed to fetch data from server');
        }

        const settingsData = await settingsRes.json();
        const projectsData = await projectsRes.json();
        const experiencesData = await experiencesRes.json();

        setSettings(settingsData);
        setProjects(projectsData);
        setExperiences(experiencesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        // Fall back to localStorage for offline support
        const storedProjects = localStorage.getItem('portfolio_projects_backup');
        const storedSettings = localStorage.getItem('portfolio_settings_backup');
        const storedExperiences = localStorage.getItem('portfolio_experiences_backup');
        
        if (storedProjects) setProjects(JSON.parse(storedProjects));
        if (storedSettings) setSettings(JSON.parse(storedSettings));
        if (storedExperiences) setExperiences(JSON.parse(storedExperiences));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save backups to localStorage when data changes
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('portfolio_projects_backup', JSON.stringify(projects));
    }
    if (Object.keys(settings).length > 0) {
      localStorage.setItem('portfolio_settings_backup', JSON.stringify(settings));
    }
    if (experiences.length > 0) {
      localStorage.setItem('portfolio_experiences_backup', JSON.stringify(experiences));
    }
  }, [projects, settings, experiences]);

  // Settings operations
  const updateSettings = useCallback(async (newSettings) => {
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });

      if (!res.ok) throw new Error('Failed to update settings');

      const data = await res.json();
      setSettings(data);
      return data;
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  }, []);

  // Project operations
  const addProject = useCallback(async (project) => {
    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });

      if (!res.ok) throw new Error('Failed to create project');

      const newProject = await res.json();
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!res.ok) throw new Error('Failed to update project');

      const updatedProject = await res.json();
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete project');

      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  }, []);

  // Experience operations
  const addExperience = useCallback(async (experience) => {
    try {
      const res = await fetch(`${API_URL}/api/experiences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience)
      });

      if (!res.ok) throw new Error('Failed to create experience');

      const newExp = await res.json();
      setExperiences(prev => [...prev, newExp]);
      return newExp;
    } catch (err) {
      console.error('Error creating experience:', err);
      throw err;
    }
  }, []);

  const updateExperience = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/api/experiences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!res.ok) throw new Error('Failed to update experience');

      const updatedExp = await res.json();
      setExperiences(prev => prev.map(e => e.id === id ? updatedExp : e));
      return updatedExp;
    } catch (err) {
      console.error('Error updating experience:', err);
      throw err;
    }
  }, []);

  const deleteExperience = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/experiences/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete experience');

      setExperiences(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting experience:', err);
      throw err;
    }
  }, []);

  // Image upload
  const uploadImage = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Failed to upload image');

      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  }, []);

  // Helper to get setting value by language
  const getSetting = useCallback((key, lang = 'en') => {
    if (!settings[key]) return '';
    return settings[key][lang] || settings[key]['en'] || '';
  }, [settings]);

  // Refresh data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, projectsRes, experiencesRes] = await Promise.all([
        fetch(`${API_URL}/api/settings`),
        fetch(`${API_URL}/api/projects`),
        fetch(`${API_URL}/api/experiences`)
      ]);

      const settingsData = await settingsRes.json();
      const projectsData = await projectsRes.json();
      const experiencesData = await experiencesRes.json();

      setSettings(settingsData);
      setProjects(projectsData);
      setExperiences(experiencesData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{
      projects,
      experiences,
      settings,
      loading,
      error,
      getSetting,
      updateSettings,
      addProject,
      updateProject,
      deleteProject,
      addExperience,
      updateExperience,
      deleteExperience,
      uploadImage,
      refreshData,
      API_URL
    }}>
      {children}
    </DataContext.Provider>
  );
};
