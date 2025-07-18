// src/components/evaluation/SystemStatusGrid.tsx
'use client'

import React from 'react';
import { 
  Zap, 
  Cpu, 
  Database, 
  Eye, 
  Thermometer, 
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { SystemStatus } from '../../types/evaluation';

interface SystemStatusGridProps {
  systemStatus: SystemStatus;
  className?: string;
  showAlerts?: boolean;
}

export const SystemStatusGrid: React.FC<SystemStatusGridProps> = ({
  systemStatus,
  className = "",
  showAlerts = true
}) => {
  // Parse numeric values from string formats
  const parseNumericValue = (value: string): number => {
    return parseFloat(value.replace(/[^\d.]/g, ''));
  };

  const metrics = [
    {
      id: 'gpu',
      label: 'GPU',
      value: `${systemStatus.gpuUsage.toFixed(1)}%`,
      numericValue: systemStatus.gpuUsage,
      icon: Zap,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      isPercentage: true
    },
    {
      id: 'cpu',
      label: 'CPU',
      value: `${systemStatus.cpuUsage.toFixed(1)}%`,
      numericValue: systemStatus.cpuUsage,
      icon: Cpu,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      isPercentage: true
    },
    {
      id: 'ram',
      label: 'RAM',
      value: systemStatus.ramUsage,
      numericValue: parseNumericValue(systemStatus.ramUsage),
      icon: Database,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      isPercentage: false
    },
    {
      id: 'vram',
      label: 'VRAM',
      value: systemStatus.vramUsage,
      numericValue: parseNumericValue(systemStatus.vramUsage),
      icon: Eye,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      isPercentage: false
    },
    {
      id: 'temperature',
      label: 'GPU Temp',
      value: systemStatus.temperature,
      numericValue: parseNumericValue(systemStatus.temperature),
      icon: Thermometer,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      isPercentage: false
    },
    {
      id: 'disk',
      label: 'Disk',
      value: systemStatus.diskUsage,
      numericValue: parseNumericValue(systemStatus.diskUsage),
      icon: HardDrive,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-900/20',
      isPercentage: false
    }
  ];

  // Determine status level based on metric values
  const getStatusLevel = (metric: typeof metrics[0]) => {
    const { numericValue, isPercentage, id } = metric;
    
    if (id === 'temperature') {
      if (numericValue > 85) return 'critical';
      if (numericValue > 75) return 'warning';
      return 'normal';
    }
    
    if (isPercentage) {
      if (numericValue > 95) return 'critical';
      if (numericValue > 85) return 'warning';
      return 'normal';
    }
    
    // For memory metrics, we'll assume these are reasonable ranges
    if (id === 'ram' || id === 'vram') {
      if (numericValue > 28) return 'warning'; // Assuming 32GB max
      return 'normal';
    }
    
    return 'normal';
  };

  // Get status icon and color
  const getStatusIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return { 
          icon: AlertTriangle, 
          color: 'text-red-500', 
          bgColor: 'bg-red-100 dark:bg-red-900/20' 
        };
      case 'warning':
        return { 
          icon: AlertTriangle, 
          color: 'text-yellow-500', 
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' 
        };
      default:
        return { 
          icon: CheckCircle, 
          color: 'text-green-500', 
          bgColor: 'bg-green-100 dark:bg-green-900/20' 
        };
    }
  };

  // Calculate overall system health
  const overallHealth = () => {
    const levels = metrics.map(metric => getStatusLevel(metric));
    if (levels.includes('critical')) return 'critical';
    if (levels.includes('warning')) return 'warning';
    return 'healthy';
  };

  const systemHealth = overallHealth();
  const healthStatus = getStatusIcon(systemHealth);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header with System Health Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current System Status
          </h3>
          {showAlerts && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${healthStatus.bgColor}`}>
              <healthStatus.icon className={`w-4 h-4 ${healthStatus.color}`} />
              <span className={healthStatus.color}>
                {systemHealth === 'healthy' ? 'Healthy' : 
                 systemHealth === 'warning' ? 'Warning' : 'Critical'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Activity className="w-4 h-4" />
          <span>Live monitoring</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const statusLevel = getStatusLevel(metric);
          const statusIcon = getStatusIcon(statusLevel);
          
          return (
            <div
              key={metric.id}
              className="relative group hover:scale-105 transition-transform duration-200"
            >
              {/* Status Indicator */}
              {showAlerts && statusLevel !== 'normal' && (
                <div className="absolute -top-1 -right-1 z-10">
                  <statusIcon.icon className={`w-4 h-4 ${statusIcon.color}`} />
                </div>
              )}
              
              <div className={`text-center p-4 rounded-lg border transition-all duration-200 ${
                statusLevel === 'critical' 
                  ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                  : statusLevel === 'warning'
                  ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
              }`}>
                {/* Icon */}
                <div className={`w-8 h-8 mx-auto mb-2 p-1.5 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                
                {/* Value */}
                <div className={`text-xl font-bold mb-1 ${
                  statusLevel === 'critical' 
                    ? 'text-red-600 dark:text-red-400'
                    : statusLevel === 'warning'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {metric.value}
                </div>
                
                {/* Label */}
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {metric.label}
                </div>
                
                {/* Progress Bar for Percentage Metrics */}
                {metric.isPercentage && (
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        statusLevel === 'critical' 
                          ? 'bg-red-500'
                          : statusLevel === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(metric.numericValue, 100)}%` }}
                    />
                  </div>
                )}
              </div>
              
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                {metric.label}: {metric.value}
                {metric.isPercentage && ` (${statusLevel})`}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Health Summary */}
      {showAlerts && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">System Health:</span>
              <span className={`font-medium ${
                systemHealth === 'healthy' 
                  ? 'text-green-600 dark:text-green-400'
                  : systemHealth === 'warning'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {systemHealth === 'healthy' ? 'All systems operational' :
                 systemHealth === 'warning' ? 'Some metrics elevated' :
                 'Critical thresholds exceeded'}
              </span>
            </div>
            
            <div className="text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};