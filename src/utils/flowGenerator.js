
import { CheckCircle, Database, Cpu, BarChart3, Play } from 'lucide-react';
import { evaluation } from './config';

// 🔹 STEP MAPPING - Maps display names to internal configurations
const STEP_MAPPING = {
  'Select Payload': {
    key: 'dataset',
    component: 'DatasetSelectionStep',
    icon: Database
  },
  'Select Inference': {
    key: 'model',
    component: 'ModelSelectionStep',
    icon: Cpu
  },
  'Set Metrics': {
    key: 'metrics',
    component: 'MetricsConfigurationStep',
    icon: BarChart3
  },
  'Review & Launch': {
    key: 'review',
    component: 'ReviewAndRunStep',
    icon: Play
  },
  'Success': {
    key: 'success',
    component: 'Success',
    icon: CheckCircle
  }
};

// 🔹 GENERATE STEPS FROM CONFIG
export const generateSteps = (flowConfig = evaluation.flow) => {
  return flowConfig.map((stepName, index) => {
    const mapping = STEP_MAPPING[stepName];
    
    
    
    return {
      id: index + 1,
      name: stepName,
      key: mapping.key,
      component: mapping.component,
      icon: stepName === 'Success' ? <CheckCircle className="w-5 h-5" /> : 'icon',
      iconComponent: mapping.icon,
      showIcon: stepName === 'Success'
    };
  });
};

// 🔹 FLOW NAVIGATION UTILITIES
export class FlowNavigator {
  constructor(flowConfig = evaluation.flow) {
    this.steps = generateSteps(flowConfig);
  }

  getSteps() {
    return this.steps;
  }

  getStepById(id) {
    return this.steps.find(step => step.id === id);
  }

  getStepByKey(key) {
    return this.steps.find(step => step.key === key);
  }

  getStepByName(name) {
    return this.steps.find(step => step.name === name);
  }

  getNextStepId(currentId) {
    const currentIndex = this.steps.findIndex(step => step.id === currentId);
    if (currentIndex === -1 || currentIndex === this.steps.length - 1) {
      return null;
    }
    return this.steps[currentIndex + 1].id;
  }

  getPreviousStepId(currentId) {
    const currentIndex = this.steps.findIndex(step => step.id === currentId);
    if (currentIndex <= 0) {
      return null;
    }
    return this.steps[currentIndex - 1].id;
  }

  getTotalSteps() {
    return this.steps.length;
  }

  getStepComponent(stepId) {
    const step = this.getStepById(stepId);
    return step ? step.component : null;
  }

  getCurrentStepInfo(stepId) {
    const step = this.getStepById(stepId);
    if (!step) return null;

    return {
      current: step,
      next: this.getStepById(this.getNextStepId(stepId)),
      previous: this.getStepById(this.getPreviousStepId(stepId)),
      isFirst: stepId === 1,
      isLast: stepId === this.getTotalSteps()
    };
  }
}

// 🔹 EVALUATION STAGE UTILITIES
export const getEvaluationStages = () => {
  return evaluation.state;
};

export const getEvaluationStatuses = () => {
  return evaluation.status;
};

export const getStageByIndex = (index) => {
  return evaluation.state[index] || null;
};

export const getStatusByIndex = (index) => {
  return evaluation.status[index] || null;
};

export const isValidStage = (stage) => {
  return evaluation.state.includes(stage);
};

export const isValidStatus = (status) => {
  return evaluation.status.map(s => s.toLowerCase()).includes(status.toLowerCase());
};

export const getNextStage = (currentStage) => {
  const currentIndex = evaluation.state.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === evaluation.state.length - 1) {
    return null;
  }
  return evaluation.state[currentIndex + 1];
};

export const getPreviousStage = (currentStage) => {
  const currentIndex = evaluation.state.indexOf(currentStage);
  if (currentIndex <= 0) {
    return null;
  }
  return evaluation.state[currentIndex - 1];
};

export const getStageProgress = (currentStage) => {
  const currentIndex = evaluation.state.indexOf(currentStage);
  if (currentIndex === -1) return 0;
  return Math.round(((currentIndex + 1) / evaluation.state.length) * 100);
};

// 🔹 EXPORTED UTILITIES
export const getSteps = () => generateSteps();
export const createFlowNavigator = (customFlow) => new FlowNavigator(customFlow);

// 🔹 LEGACY EXPORTS (for backward compatibility)
export const STEPS = generateSteps();

export const getStepByIndex = (index) => {
  return STEPS[index];
};

export const getStepByKey = (key) => {
  return STEPS.find(step => step.key === key);
};

export const getStepByName = (name) => {
  return STEPS.find(step => step.name === name);
};

export const getNextStepId = (currentId) => {
  const currentIndex = STEPS.findIndex(step => step.id === currentId);
  if (currentIndex === -1 || currentIndex === STEPS.length - 1) {
    return null;
  }
  return STEPS[currentIndex + 1].id;
};

export const getPreviousStepId = (currentId) => {
  const currentIndex = STEPS.findIndex(step => step.id === currentId);
  if (currentIndex <= 0) {
    return null;
  }
  return STEPS[currentIndex - 1].id;
};

export const getTotalSteps = () => {
  return STEPS.length;
};

export const getStepComponent = (stepId) => {
  const step = STEPS.find(s => s.id === stepId);
  return step ? step.component : null;
};
