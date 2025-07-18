// src/utils/config.js - Simple configuration replacement

import { CheckCircle } from 'lucide-react';

// Replace your hardcoded evaluation object
export const evaluation = {
  flow: [
    'Data selection',
    'Choose model', 
    'Configure metrics',
    'Review & run',
    'Success'
  ],
  state: [
    'Dataset Loading',
    'Model Setup', 
    'Evaluation',
    'Analysis'
  ],
  status: [
    'Completed',
    'Queued',
    'Running', 
    'Failed',
    'Created'
  ]
};

// Replace your hardcoded STEPS array
export const STEPS = [
  { id: 1, name: 'Data Selection', key: 'dataset', icon: 'database' },
  { id: 2, name: 'Choose Model', key: 'model', icon: 'cpu' },
  { id: 3, name: 'Configure Metrics', key: 'metrics', icon: 'bar-chart' },
  { id: 4, name: 'Review & Run', key: 'review', icon: 'play' },
  { id: 5, name: 'Success', key: 'success', icon: <CheckCircle className="w-5 h-5" />, showIcon: true }
];