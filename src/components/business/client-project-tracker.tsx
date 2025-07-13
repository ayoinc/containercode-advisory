'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Calendar,
  FileText,
  Target,
  ArrowRight
} from 'lucide-react';

interface ProjectStatus {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  progress: number;
  timeline: string;
  team: number;
  priority: 'low' | 'medium' | 'high';
}

const mockProjects: ProjectStatus[] = [
  {
    id: '1',
    name: 'Cloud Migration Strategy',
    client: 'TechCorp Ltd',
    status: 'in-progress',
    progress: 75,
    timeline: '2 weeks remaining',
    team: 4,
    priority: 'high'
  },
  {
    id: '2', 
    name: 'Security Assessment',
    client: 'FinanceGroup PLC',
    status: 'review',
    progress: 90,
    timeline: 'Under review',
    team: 3,
    priority: 'medium'
  },
  {
    id: '3',
    name: 'DevOps Implementation',
    client: 'StartupCo',
    status: 'planning',
    progress: 15,
    timeline: '6 weeks',
    team: 5,
    priority: 'medium'
  },
  {
    id: '4',
    name: 'Digital Transformation',
    client: 'RetailChain Ltd',
    status: 'completed',
    progress: 100,
    timeline: 'Completed',
    team: 6,
    priority: 'high'
  }
];

export function ClientProjectTracker() {
  const [projects, setProjects] = useState<ProjectStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Simulate loading projects
    const timer = setTimeout(() => {
      setProjects(mockProjects);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Set time on client side only to avoid hydration mismatch
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: ProjectStatus['status']) => {
    switch (status) {
      case 'planning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-progress':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: ProjectStatus['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityColor = (priority: ProjectStatus['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-red-100 text-red-800';
    }
  };

  const activeProjects = projects.filter(p => p.status !== 'completed');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const currentProjects = activeTab === 'active' ? activeProjects : completedProjects;

  const stats = {
    totalActive: activeProjects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: completedProjects.length,
    avgProgress: Math.round(activeProjects.reduce((acc, p) => acc + p.progress, 0) / activeProjects.length) || 0
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary-600" />
            Client Project Tracker
          </h3>
          <p className="text-sm text-gray-600 mt-1">Real-time project progress and status</p>
        </div>
        <motion.div 
          className="w-3 h-3 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{stats.totalActive}</div>
          <div className="text-xs text-gray-600">Active Projects</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-xs text-gray-600">In Progress</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <div className="text-lg font-bold text-primary-600">{stats.avgProgress}%</div>
          <div className="text-xs text-gray-600">Avg Progress</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'active' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Active ({activeProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'completed' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed ({completedProjects.length})
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {currentProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{project.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{project.client}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(project.status)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-primary-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{project.team} team members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{project.timeline}</span>
                </div>
              </div>
              <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium">
                <span>View</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {currentProjects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No {activeTab} projects found</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <span>Last updated: {currentTime}</span>
        <span>Next sync: {currentTime ? new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString() : '--:--:--'}</span>
      </div>
    </div>
  );
}