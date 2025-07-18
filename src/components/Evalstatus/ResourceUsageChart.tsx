// src/components/evaluation/ResourceUsageChart.tsx
'use client'

import React from 'react';
import { Zap, Cpu, Database, Eye } from 'lucide-react';
import { EvaluationData } from '../../types/evaluation';

interface ResourceUsageChartProps {
  evaluation: EvaluationData;
  className?: string;
}

export const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({
  evaluation,
  className = ""
}) => {
  const { systemStatus } = evaluation;

  // Generate mock historical data for resource usage trends
  const generateResourceData = () => {
    const dataPoints = [];
    const currentTask = evaluation.metrics.currentTask;
    const interval = Math.max(1, Math.floor(currentTask / 20));
    
    for (let i = 0; i <= currentTask; i += interval) {
      dataPoints.push({
        task: i,
        cpu: Math.max(10, systemStatus.cpuUsage + (Math.random() - 0.5) * 20),
        gpu: Math.max(40, systemStatus.gpuUsage + (Math.random() - 0.5) * 30),
        ram: parseFloat(systemStatus.ramUsage) + (Math.random() - 0.5) * 4,
        vram: parseFloat(systemStatus.vramUsage) + (Math.random() - 0.5) * 6
      });
    }
    return dataPoints;
  };

  const resourceData = generateResourceData();

  // Get current resource values as numbers
  const currentResources = {
    cpu: systemStatus.cpuUsage,
    gpu: systemStatus.gpuUsage,
    ram: parseFloat(systemStatus.ramUsage),
    vram: parseFloat(systemStatus.vramUsage),
    temperature: parseFloat(systemStatus.temperature),
    disk: parseFloat(systemStatus.diskUsage)
  };

  // Get status color based on usage percentage
  const getUsageColor = (usage: number, type: 'percentage' | 'temperature' = 'percentage') => {
    if (type === 'temperature') {
      if (usage > 80) return 'text-red-500';
      if (usage > 70) return 'text-yellow-500';
      return 'text-green-500';
    }
    
    if (usage > 90) return 'text-red-500';
    if (usage > 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Resource Usage
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Real-time monitoring
        </div>
      </div>

      {/* Current Resource Usage Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className={`text-2xl font-bold ${getUsageColor(currentResources.gpu)}`}>
            {currentResources.gpu.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" />
            GPU
          </div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className={`text-2xl font-bold ${getUsageColor(currentResources.cpu)}`}>
            {currentResources.cpu.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
            <Cpu className="w-3 h-3" />
            CPU
          </div>
        </div>
        
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {currentResources.ram.toFixed(1)}GB
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
            <Database className="w-3 h-3" />
            RAM
          </div>
        </div>
        
        <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {currentResources.vram.toFixed(1)}GB
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
            <Eye className="w-3 h-3" />
            VRAM
          </div>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative overflow-hidden">
        {/* Chart Background Grid */}
        <div className="absolute inset-4 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div 
              key={`h-${i}`} 
              className="border-b border-gray-300 dark:border-gray-600 h-1/5"
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <div 
              key={`v-${i}`} 
              className="border-r border-gray-300 dark:border-gray-600 w-1/6 h-full absolute" 
              style={{ left: `${i * 16.666}%` }}
            />
          ))}
        </div>
        
        {/* Chart Lines */}
        <div className="relative h-full">
          {/* GPU Usage Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 240" preserveAspectRatio="none">
            <path
              d="M 0 160 Q 80 140 160 120 T 320 100"
              stroke="#10B981"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
            />
          </svg>
          
          {/* CPU Usage Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 240" preserveAspectRatio="none">
            <path
              d="M 0 180 Q 80 170 160 165 T 320 150"
              stroke="#8B5CF6"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
          </svg>
          
          {/* RAM Usage Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 240" preserveAspectRatio="none">
            <path
              d="M 0 190 Q 80 185 160 180 T 320 170"
              stroke="#F59E0B"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </svg>
          
          {/* VRAM Usage Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 240" preserveAspectRatio="none">
            <path
              d="M 0 140 Q 80 130 160 125 T 320 115"
              stroke="#EF4444"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '1.5s' }}
            />
          </svg>
        </div>
        
        {/* Chart Legend */}
        <div className="absolute bottom-2 left-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-green-500" />
            <span className="text-gray-600 dark:text-gray-300">GPU %</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-purple-500" />
            <span className="text-gray-600 dark:text-gray-300">CPU %</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-yellow-500" />
            <span className="text-gray-600 dark:text-gray-300">RAM GB</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-red-500" />
            <span className="text-gray-600 dark:text-gray-300">VRAM GB</span>
          </div>
        </div>

        {/* Temperature Warning Overlay */}
        {currentResources.temperature > 80 && (
          <div className="absolute top-2 right-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs font-medium">
            High Temp: {systemStatus.temperature}
          </div>
        )}
      </div>

      {/* Chart Footer */}
      <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Resource Utilization</span>
        <div className="flex items-center gap-4">
          <span>Temp: {systemStatus.temperature}</span>
          <span>Disk: {systemStatus.diskUsage}</span>
        </div>
      </div>
    </div>
  );
};