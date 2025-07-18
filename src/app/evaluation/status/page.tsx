// src/app/evaluation/status/page.tsx
'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { EvaluationStatusScreen } from '../../../components/Evalstatus/EvaluationStatusScreen';

export default function EvaluationStatusPage() {
  const searchParams = useSearchParams();
  const evaluationName = searchParams.get('name') || 'Unknown Evaluation';

  return (
    <EvaluationStatusScreen 
      evaluationName={evaluationName}
    />
  );
}