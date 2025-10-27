'use client';

import { useState, useEffect } from 'react';
import Logo from './Logo';
import { IconSettings, IconUsers, IconFileText, IconToggleRight } from '@tabler/icons-react';

export default function OnboardingBuilder({ onboarding, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    number: '',
    description: '',
    status: 'draft',
    enablePersonalityTest: true,
    enableAIBot: true,
    employees: [],
    videos: [],
    documents: [],
  });

  const [csvInput, setCsvInput] = useState('');
  const [parseError, setParseError] = useState('');
  const [selectedTab, setSelectedTab] = useState('basic');
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentType, setContentType] = useState('video');
  const [contentForm, setContentForm] = useState({ name: '', url: '', category: '', file: null });

  // Initialize with existing onboarding if editing
  useEffect(() => {
    if (onboarding) {
      setFormData(onboarding);
    }
  }, [onboarding]);

  const handleBasicChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateOnboardingId = () => {
    const code = formData.code.toUpperCase() || '';
    const number = String(formData.number || '000').padStart(3, '0');
    return `onboarding-${code}-${number}`;
  };

  const parseCSV = (text) => {
    setParseError('');
    const lines = text.trim().split('\n').filter(line => line.trim());
    const employees = [];

    lines.forEach((line, index) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 2) {
        setParseError(`Line ${index + 1}: Invalid format. Expected: email,password`);
        return;
      }

      const [email, password] = parts;
      
      if (!email.includes('@')) {
        setParseError(`Line ${index + 1}: Invalid email format`);
        return;
      }

      if (password.length < 4) {
        setParseError(`Line ${index + 1}: Password too short (min 4 characters)`);
        return;
      }

      employees.push({
        id: `emp-${Date.now()}-${index}`,
        email,
        password,
        createdAt: new Date(),
      });
    });

    if (parseError) return;

    setFormData(prev => ({
      ...prev,
      employees: [...prev.employees, ...employees],
    }));
    setCsvInput('');
  };

  const handleAddEmployeeFromCSV = () => {
    if (!csvInput.trim()) {
      setParseError('Please paste CSV data');
      return;
    }
    parseCSV(csvInput);
  };

  const handleRemoveEmployee = (id) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.filter(e => e.id !== id),
    }));
  };

  const handleAddContent = () => {
    if (!contentForm.name.trim()) {
      alert('Please enter a content name');
      return;
    }

    const newContent = {
      id: `content-${Date.now()}`,
      type: contentType,
      name: contentForm.name,
      url: contentForm.url,
      category: contentForm.category || 'General',
      file: contentForm.file,
      createdAt: new Date(),
    };

    if (contentType === 'video' || contentType === 'youtube') {
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, newContent],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newContent],
      }));
    }

    setContentForm({ name: '', url: '', category: '', file: null });
    setShowContentModal(false);
  };

  const handleRemoveContent = (id, type) => {
    if (type === 'video') {
      setFormData(prev => ({
        ...prev,
        videos: prev.videos.filter(v => v.id !== id),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d.id !== id),
      }));
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setContentForm(prev => ({ ...prev, file: files[0] }));
    }
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.code.trim() || !formData.number) {
      alert('Please fill in all required fields in Basic Info tab');
      return;
    }

    const finalData = {
      ...formData,
      id: formData.id || generateOnboardingId(),
      createdAt: formData.createdAt || new Date(),
    };

    onSave(finalData);
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="glass-morphism border-b border-gray-200/50 dark:border-gray-800/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-6" />
              <div className="hidden sm:block border-l border-gray-300 dark:border-gray-700 pl-3">
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {onboarding ? 'Edit Onboarding' : 'Create New Onboarding'}
                </h1>
                <p className="text-xs text-gray-500">Onboarding Builder</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {[
              { id: 'basic', label: 'Basic', icon: IconSettings },
              { id: 'employees', label: 'Employees', icon: IconUsers },
              { id: 'content', label: 'Content', icon: IconFileText },
              { id: 'features', label: 'Features', icon: IconToggleRight },
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-3 sm:px-6 py-3 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
                    selectedTab === tab.id
                      ? 'text-openpurple-600 dark:text-openpurple-400 border-openpurple-600 dark:border-openpurple-400'
                      : 'text-gray-500 dark:text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Basic Info Tab */}
          {selectedTab === 'basic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleBasicChange('code', e.target.value.toUpperCase())}
                      placeholder="SF"
                      maxLength="3"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-openpurple-500 focus:ring-2 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">e.g., SF, BOS</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Number *</label>
                    <input
                      type="number"
                      value={formData.number}
                      onChange={(e) => handleBasicChange('number', e.target.value)}
                      placeholder="001"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-openpurple-500 focus:ring-2 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Sequential</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleBasicChange('status', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-openpurple-500 focus:ring-2 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Program Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleBasicChange('name', e.target.value)}
                    placeholder="e.g., San Francisco Engineering Team"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-openpurple-500 focus:ring-2 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleBasicChange('description', e.target.value)}
                    placeholder="Describe the onboarding program..."
                    rows="3"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-openpurple-500 focus:ring-2 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30 resize-none"
                  />
                </div>

                {/* ID Preview */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span className="font-semibold">ID:</span> <span className="text-openpurple-600 dark:text-openpurple-400">{generateOnboardingId()}</span>
                  </p>
                  {formData.name && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Name:</span> {formData.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {selectedTab === 'employees' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Bulk Add Employees</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Paste employee data in CSV format: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">email,password</code> (one per line)
                </p>

                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Password Format</p>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p>• Use DOB format: <code className="bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded">19900315</code> (YYYYMMDD)</p>
                    <p>• Example: <code className="bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded">john.doe@opengov.com,19900315</code></p>
                  </div>
                </div>

                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="john.doe@opengov.com,19900315&#10;jane.smith@opengov.com,19851220&#10;mike.johnson@opengov.com,19920707"
                  rows="5"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-openpurple-500 focus:ring-2 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30 mb-3 resize-none"
                />

                {parseError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2.5 mb-3 flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-red-700 dark:text-red-300">{parseError}</span>
                  </div>
                )}

                <button
                  onClick={handleAddEmployeeFromCSV}
                  className="w-full px-4 py-2 border-2 border-openpurple-600 dark:border-openpurple-500 text-openpurple-600 dark:text-openpurple-400 hover:bg-openpurple-50 dark:hover:bg-openpurple-900/20 rounded-lg font-medium transition-all text-sm"
                >
                  + Add to List
                </button>
              </div>

              {/* Employees List */}
              {formData.employees.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Added Employees ({formData.employees.length})
                  </h3>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {formData.employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{employee.email}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">••••••••</p>
                        </div>
                        <button
                          onClick={() => handleRemoveEmployee(employee.id)}
                          className="ml-2 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Tab */}
          {selectedTab === 'content' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Add Content Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setContentType('video');
                    setShowContentModal(true);
                  }}
                  className="p-4 bg-white dark:bg-gray-900 hover:bg-openpurple-50 dark:hover:bg-openpurple-900/20 border-2 border-gray-200 dark:border-gray-800 hover:border-openpurple-300 dark:hover:border-openpurple-700 rounded-xl transition-all text-center"
                >
                  <svg className="w-8 h-8 mx-auto mb-2 text-openpurple-600 dark:text-openpurple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Video File</p>
                  <p className="text-xs text-gray-500 mt-1">Upload MP4</p>
                </button>

                <button
                  onClick={() => {
                    setContentType('youtube');
                    setShowContentModal(true);
                  }}
                  className="p-4 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700 rounded-xl transition-all text-center"
                >
                  <svg className="w-8 h-8 mx-auto mb-2 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">YouTube</p>
                  <p className="text-xs text-gray-500 mt-1">Add link</p>
                </button>

                <button
                  onClick={() => {
                    setContentType('pdf');
                    setShowContentModal(true);
                  }}
                  className="p-4 bg-white dark:bg-gray-900 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl transition-all text-center"
                >
                  <svg className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">PDF</p>
                  <p className="text-xs text-gray-500 mt-1">Upload file</p>
                </button>

                <button
                  onClick={() => {
                    setContentType('link');
                    setShowContentModal(true);
                  }}
                  className="p-4 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl transition-all text-center"
                >
                  <svg className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Web Link</p>
                  <p className="text-xs text-gray-500 mt-1">Add URL</p>
                </button>
              </div>

              {/* Videos List */}
              {formData.videos.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Videos ({formData.videos.length})
                  </h3>
                  <div className="space-y-2">
                    {formData.videos.map((video) => (
                      <div key={video.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          video.type === 'youtube' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-openpurple-100 dark:bg-openpurple-900/30'
                        }`}>
                          {video.type === 'youtube' ? (
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-openpurple-600 dark:text-openpurple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{video.name}</p>
                          <p className="text-xs text-gray-500 truncate">{video.category}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveContent(video.id, 'video')}
                          className="px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents List */}
              {formData.documents.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Documents ({formData.documents.length})
                  </h3>
                  <div className="space-y-2">
                    {formData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          doc.type === 'link' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                        }`}>
                          {doc.type === 'link' ? (
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.name}</p>
                          <p className="text-xs text-gray-500 truncate">{doc.category}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveContent(doc.id, 'document')}
                          className="px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Modal */}
              {showContentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowContentModal(false)}>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Add {contentType === 'video' ? 'Video File' : contentType === 'youtube' ? 'YouTube Video' : contentType === 'pdf' ? 'PDF Document' : 'Web Link'}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Content Name *</label>
                        <input
                          type="text"
                          value={contentForm.name}
                          onChange={(e) => setContentForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Welcome to OpenGov"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-openpurple-500 focus:ring-2 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                        <input
                          type="text"
                          value={contentForm.category}
                          onChange={(e) => setContentForm(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Orientation, Training, Culture"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-openpurple-500 focus:ring-2 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30"
                        />
                      </div>

                      {(contentType === 'youtube' || contentType === 'link') && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">URL *</label>
                          <input
                            type="url"
                            value={contentForm.url}
                            onChange={(e) => setContentForm(prev => ({ ...prev, url: e.target.value }))}
                            placeholder={contentType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-openpurple-500 focus:ring-2 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30"
                          />
                        </div>
                      )}

                      {(contentType === 'video' || contentType === 'pdf') && (
                        <div
                          onDrop={handleFileDrop}
                          onDragOver={(e) => e.preventDefault()}
                          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-openpurple-400 dark:hover:border-openpurple-600 transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50"
                        >
                          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {contentForm.file ? contentForm.file.name : 'Drop file here or click to browse'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {contentType === 'video' ? 'MP4, WebM, MOV (max 500MB)' : 'PDF (max 50MB)'}
                          </p>
                          <input
                            type="file"
                            accept={contentType === 'video' ? 'video/*' : 'application/pdf'}
                            onChange={(e) => setContentForm(prev => ({ ...prev, file: e.target.files[0] }))}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="mt-3 inline-block px-4 py-2 bg-openpurple-100 dark:bg-openpurple-900/30 text-openpurple-700 dark:text-openpurple-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-openpurple-200 dark:hover:bg-openpurple-800/50 transition-colors">
                            Choose File
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => {
                          setShowContentModal(false);
                          setContentForm({ name: '', url: '', category: '', file: null });
                        }}
                        className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddContent}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-openpurple-600 to-openpurple-700 hover:from-openpurple-700 hover:to-openpurple-800 text-white rounded-lg font-semibold transition-all text-sm"
                      >
                        Add Content
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features Tab */}
          {selectedTab === 'features' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Feature Configuration</h2>

                <div className="space-y-3">
                  <label className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-openpurple-400 dark:hover:border-openpurple-600 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={formData.enablePersonalityTest}
                      onChange={(e) => handleBasicChange('enablePersonalityTest', e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-openpurple-600 focus:ring-2 focus:ring-openpurple-500"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Personality Assessment</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Allow employees to take the personality test</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-openpurple-400 dark:hover:border-openpurple-600 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={formData.enableAIBot}
                      onChange={(e) => handleBasicChange('enableAIBot', e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-openpurple-600 focus:ring-2 focus:ring-openpurple-500"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">AI Assistant</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Provide AI chat support for onboarding questions</p>
                    </div>
                  </label>
                </div>

                {(formData.enablePersonalityTest || formData.enableAIBot) && (
                  <div className="mt-4 p-3 bg-openpurple-50 dark:bg-openpurple-900/20 rounded-lg border border-openpurple-200 dark:border-openpurple-800">
                    <p className="text-xs font-semibold text-openpurple-700 dark:text-openpurple-300 mb-1">Active Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.enablePersonalityTest && (
                        <span className="text-xs px-2 py-1 bg-white dark:bg-openpurple-900/40 text-openpurple-700 dark:text-openpurple-300 rounded">Personality Test</span>
                      )}
                      {formData.enableAIBot && (
                        <span className="text-xs px-2 py-1 bg-white dark:bg-openpurple-900/40 text-openpurple-700 dark:text-openpurple-300 rounded">AI Assistant</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 items-center justify-end">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2.5 bg-gradient-to-r from-openpurple-600 to-openpurple-700 hover:from-openpurple-700 hover:to-openpurple-800 text-white rounded-lg font-semibold transition-all text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {onboarding ? 'Update Onboarding' : 'Create Onboarding'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
