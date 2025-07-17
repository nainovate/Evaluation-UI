// src/components/common/DatasetTips.tsx
import React from 'react';
import { Info, LucideIcon } from 'lucide-react';

// 🔹 TYPE DEFINITIONS
// These interfaces define the structure of our configuration data

interface TipSection {
  icon: LucideIcon;        // Lucide React icon component (e.g., Target, BarChart)
  iconColor: string;       // Tailwind color class (e.g., "text-blue-500")
  title: string;           // Section heading text
  description: string;     // Section description text
}

interface TaskType {
  name: string;           // Name of supported task type
}

interface BestPractice {
  title: string;          // Best practice section title
  description: string;    // Best practice description
  bgColor: string;        // Background color class
  borderColor: string;    // Border color class  
  titleColor: string;     // Title text color class
  textColor: string;      // Description text color class
}

// 🔹 MAIN CONFIGURATION INTERFACE
// This is exported so constants.ts can use the same type structure
export interface TipsConfig {
  title: string;           // Main component title
  sections: TipSection[];  // Array of tip sections
  taskTypes: TaskType[];   // Array of supported task types
  bestPractices: BestPractice; // Best practices configuration
}

// 🔹 COMPONENT PROPS INTERFACE
interface DatasetTipsProps {
  config: TipsConfig;      // Configuration object from constants
  className?: string;      // Optional additional CSS classes
}

// 🔹 MAIN COMPONENT
export const DatasetTips: React.FC<DatasetTipsProps> = ({
  config,
  className = ""
}) => {
  // 🔸 DESTRUCTURE CONFIG
  // Extract all the configuration values for easier use
  const { title, sections, taskTypes, bestPractices } = config;

  return (
    // 🔸 MAIN CONTAINER
    // Sticky positioning keeps it visible while scrolling
    <div className={`sticky top-20 z-30 ${className}`}>
      
      {/* 🔸 CARD WRAPPER */}
      {/* White/gray card with rounded corners and shadow */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        
        {/* 🔸 HEADER SECTION */}
        {/* Icon + Title combination */}
        <div className="flex items-center space-x-2 mb-4">
          <Info className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        
        {/* 🔸 CONTENT AREA */}
        <div className="space-y-4 text-sm">
          
          {/* 🔸 DYNAMIC SECTIONS */}
          {/* Maps through the sections array from config */}
          {sections.map((section, index) => (
            <div key={index}>
              {/* Section header with icon and title */}
              <div className="flex items-center space-x-2 mb-2">
                <section.icon className={`h-4 w-4 ${section.iconColor}`} />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {section.title}
                </h4>
              </div>
              {/* Section description with left margin for alignment */}
              <p className="text-gray-600 dark:text-gray-400 ml-6">
                {section.description}
              </p>
            </div>
          ))}

          {/* 🔸 DYNAMIC TASK TYPES */}
          {/* Only renders if taskTypes array exists and has items */}
          {taskTypes && taskTypes.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Supported Task Types
              </h4>
              {/* Maps through task types as bullet list */}
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                {taskTypes.map((task, index) => (
                  <div key={index}>• {task.name}</div>
                ))}
              </div>
            </div>
          )}

          {/* 🔸 DYNAMIC BEST PRACTICES */}
          {/* Colored box with best practice information */}
          <div className={`${bestPractices.bgColor} border ${bestPractices.borderColor} rounded-md p-3`}>
            <h4 className={`font-medium ${bestPractices.titleColor} mb-1`}>
              {bestPractices.title}
            </h4>
            <p className={`${bestPractices.textColor} text-xs`}>
              {bestPractices.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};