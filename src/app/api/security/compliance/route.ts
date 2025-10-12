import { NextRequest, NextResponse } from 'next/server';

interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  requirements: ComplianceRequirement[];
  certificationLevel: 'Type I' | 'Type II';
  auditFrequency: 'quarterly' | 'annual' | 'continuous';
  lastAudit: string;
  nextAudit: string;
  status: 'compliant' | 'non-compliant' | 'in-progress' | 'not-applicable';
  complianceScore: number;
}

interface ComplianceRequirement {
  id: string;
  framework: string;
  category: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'compliant' | 'non-compliant' | 'in-progress' | 'not-applicable';
  evidence: string[];
  lastAssessment: string;
  assignedTo: string;
  dueDate: string;
  controls: ComplianceControl[];
}

interface ComplianceControl {
  id: string;
  name: string;
  type: 'preventive' | 'detective' | 'corrective';
  automated: boolean;
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  lastExecution: string;
  status: 'active' | 'inactive' | 'failed';
  metrics: Record<string, any>;
}

interface DataPrivacyConfig {
  dataRetentionPolicies: Array<{
    dataType: string;
    retentionPeriod: number; // days
    deletionMethod: 'soft' | 'hard' | 'anonymization';
    jurisdiction: string;
  }>;
  consentManagement: {
    cookieConsent: boolean;
    dataProcessingConsent: boolean;
    marketingConsent: boolean;
    consentWithdrawalProcess: string;
  };
  dataSubjectRights: {
    rightToAccess: boolean;
    rightToRectification: boolean;
    rightToErasure: boolean;
    rightToPortability: boolean;
    rightToObject: boolean;
    rightToRestrictProcessing: boolean;
  };
  privacyByDesign: {
    dataMinimization: boolean;
    purposeLimitation: boolean;
    storageMinimization: boolean;
    encryption: 'at-rest' | 'in-transit' | 'both';
  };
}

const SOC2_FRAMEWORK: ComplianceFramework = {
  id: 'soc2',
  name: 'SOC 2 Type II',
  version: '2017',
  description: 'System and Organization Controls 2 Type II certification for security, availability, and confidentiality',
  requirements: [
    {
      id: 'cc1.1',
      framework: 'soc2',
      category: 'Control Environment',
      title: 'Demonstrates Commitment to Integrity and Ethical Values',
      description: 'The entity demonstrates a commitment to integrity and ethical values.',
      priority: 'critical',
      status: 'compliant',
      evidence: ['code-of-conduct.pdf', 'ethics-training-records.xlsx'],
      lastAssessment: '2025-09-15T00:00:00Z',
      assignedTo: 'compliance-team',
      dueDate: '2025-12-15T00:00:00Z',
      controls: [
        {
          id: 'cc1.1-c1',
          name: 'Ethics Training Program',
          type: 'preventive',
          automated: false,
          frequency: 'quarterly',
          lastExecution: '2025-09-01T00:00:00Z',
          status: 'active',
          metrics: { completionRate: 98, participantCount: 45 }
        }
      ]
    },
    {
      id: 'cc6.1',
      framework: 'soc2',
      category: 'Logical and Physical Access Controls',
      title: 'Logical and Physical Access Controls',
      description: 'The entity implements logical and physical access controls to meet the objectives of the applicable trust services criteria.',
      priority: 'critical',
      status: 'compliant',
      evidence: ['access-control-matrix.xlsx', 'security-policy.pdf'],
      lastAssessment: '2025-10-01T00:00:00Z',
      assignedTo: 'security-team',
      dueDate: '2025-11-01T00:00:00Z',
      controls: [
        {
          id: 'cc6.1-c1',
          name: 'Multi-Factor Authentication',
          type: 'preventive',
          automated: true,
          frequency: 'continuous',
          lastExecution: '2025-10-11T00:00:00Z',
          status: 'active',
          metrics: { mfaAdoptionRate: 100, failedAttempts: 0 }
        }
      ]
    }
  ],
  certificationLevel: 'Type II',
  auditFrequency: 'annual',
  lastAudit: '2025-08-15T00:00:00Z',
  nextAudit: '2026-08-15T00:00:00Z',
  status: 'compliant',
  complianceScore: 94
};

const GDPR_FRAMEWORK: ComplianceFramework = {
  id: 'gdpr',
  name: 'General Data Protection Regulation',
  version: '2018',
  description: 'EU General Data Protection Regulation compliance for data privacy and protection',
  requirements: [
    {
      id: 'art5',
      framework: 'gdpr',
      category: 'Principles',
      title: 'Principles relating to processing of personal data',
      description: 'Personal data must be processed lawfully, fairly and transparently',
      priority: 'critical',
      status: 'compliant',
      evidence: ['privacy-policy.pdf', 'data-processing-records.xlsx'],
      lastAssessment: '2025-10-01T00:00:00Z',
      assignedTo: 'privacy-officer',
      dueDate: '2025-12-31T00:00:00Z',
      controls: [
        {
          id: 'art5-c1',
          name: 'Data Processing Audit',
          type: 'detective',
          automated: true,
          frequency: 'monthly',
          lastExecution: '2025-10-01T00:00:00Z',
          status: 'active',
          metrics: { dataProcessingActivities: 15, complianceRate: 100 }
        }
      ]
    }
  ],
  certificationLevel: 'Type I',
  auditFrequency: 'annual',
  lastAudit: '2025-09-01T00:00:00Z',
  nextAudit: '2026-09-01T00:00:00Z',
  status: 'compliant',
  complianceScore: 96
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const framework = searchParams.get('framework');
    const requirement = searchParams.get('requirement');
    const assessment = searchParams.get('assessment');

    if (assessment === 'dashboard') {
      const dashboard = await getComplianceDashboard();
      return NextResponse.json({ success: true, data: dashboard });
    }

    if (framework) {
      const frameworkData = await getComplianceFramework(framework);
      return NextResponse.json({ success: true, data: frameworkData });
    }

    if (requirement) {
      const requirementData = await getComplianceRequirement(requirement);
      return NextResponse.json({ success: true, data: requirementData });
    }

    // Return all frameworks
    const frameworks = await getAllComplianceFrameworks();
    return NextResponse.json({ success: true, data: frameworks });

  } catch (error) {
    console.error('Compliance retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'run_assessment':
        return await runComplianceAssessment(data);
      case 'update_control':
        return await updateComplianceControl(data);
      case 'generate_report':
        return await generateComplianceReport(data);
      case 'schedule_audit':
        return await scheduleComplianceAudit(data);
      case 'remediate_finding':
        return await remediateFinding(data);
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Compliance operation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getComplianceDashboard() {
  const frameworks = [SOC2_FRAMEWORK, GDPR_FRAMEWORK];
  const overallScore = frameworks.reduce((sum, f) => sum + f.complianceScore, 0) / frameworks.length;
  
  const totalRequirements = frameworks.reduce((sum, f) => sum + f.requirements.length, 0);
  const compliantRequirements = frameworks.reduce((sum, f) => 
    sum + f.requirements.filter(r => r.status === 'compliant').length, 0
  );
  
  const criticalFindings = frameworks.reduce((sum, f) => 
    sum + f.requirements.filter(r => r.status === 'non-compliant' && r.priority === 'critical').length, 0
  );

  return {
    overview: {
      overallComplianceScore: Math.round(overallScore),
      totalFrameworks: frameworks.length,
      compliantFrameworks: frameworks.filter(f => f.status === 'compliant').length,
      totalRequirements,
      compliantRequirements,
      complianceRate: Math.round((compliantRequirements / totalRequirements) * 100),
      criticalFindings,
      upcomingAudits: frameworks.filter(f => 
        new Date(f.nextAudit) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      ).length
    },
    frameworks: frameworks.map(f => ({
      id: f.id,
      name: f.name,
      status: f.status,
      complianceScore: f.complianceScore,
      nextAudit: f.nextAudit,
      criticalFindings: f.requirements.filter(r => r.status === 'non-compliant' && r.priority === 'critical').length
    })),
    recentActivities: [
      {
        id: 'activity_1',
        type: 'assessment',
        framework: 'SOC 2',
        description: 'Completed quarterly access control review',
        timestamp: '2025-10-10T14:30:00Z',
        status: 'completed'
      },
      {
        id: 'activity_2',
        type: 'remediation',
        framework: 'GDPR',
        description: 'Updated data retention policies',
        timestamp: '2025-10-09T16:45:00Z',
        status: 'completed'
      }
    ],
    upcomingTasks: [
      {
        id: 'task_1',
        title: 'Prepare SOC 2 evidence package',
        framework: 'SOC 2',
        dueDate: '2025-10-25T00:00:00Z',
        priority: 'high',
        assignedTo: 'compliance-team'
      }
    ]
  };
}

async function getComplianceFramework(frameworkId: string) {
  switch (frameworkId) {
    case 'soc2':
      return SOC2_FRAMEWORK;
    case 'gdpr':
      return GDPR_FRAMEWORK;
    default:
      throw new Error(`Framework not found: ${frameworkId}`);
  }
}

async function getComplianceRequirement(requirementId: string) {
  const allRequirements = [...SOC2_FRAMEWORK.requirements, ...GDPR_FRAMEWORK.requirements];
  const requirement = allRequirements.find(r => r.id === requirementId);
  
  if (!requirement) {
    throw new Error(`Requirement not found: ${requirementId}`);
  }

  return requirement;
}

async function getAllComplianceFrameworks() {
  return [SOC2_FRAMEWORK, GDPR_FRAMEWORK];
}

async function runComplianceAssessment(data: any) {
  const { frameworkId, requirementIds } = data;
  
  const framework = await getComplianceFramework(frameworkId);
  const requirements = requirementIds 
    ? framework.requirements.filter(r => requirementIds.includes(r.id))
    : framework.requirements;

  const assessmentResults = await Promise.all(
    requirements.map(async (requirement) => {
      const result = await assessRequirement(requirement);
      return {
        requirementId: requirement.id,
        title: requirement.title,
        status: result.status,
        score: result.score,
        findings: result.findings,
        recommendations: result.recommendations
      };
    })
  );

  const assessmentReport = {
    id: `assessment_${Date.now()}`,
    frameworkId,
    executedAt: new Date().toISOString(),
    overallScore: assessmentResults.reduce((sum, r) => sum + r.score, 0) / assessmentResults.length,
    results: assessmentResults,
    summary: {
      total: assessmentResults.length,
      compliant: assessmentResults.filter(r => r.status === 'compliant').length,
      nonCompliant: assessmentResults.filter(r => r.status === 'non-compliant').length,
      inProgress: assessmentResults.filter(r => r.status === 'in-progress').length
    }
  };

  return NextResponse.json({
    success: true,
    data: assessmentReport,
    message: 'Compliance assessment completed'
  });
}

async function assessRequirement(requirement: ComplianceRequirement) {
  // Simulate automated compliance assessment
  const mockResults = {
    status: Math.random() > 0.2 ? 'compliant' : 'non-compliant',
    score: Math.floor(Math.random() * 40) + 60, // 60-100 range
    findings: Math.random() > 0.7 ? ['Minor documentation gap identified'] : [],
    recommendations: Math.random() > 0.8 ? ['Update control documentation', 'Implement additional monitoring'] : []
  };

  return mockResults;
}

async function updateComplianceControl(data: any) {
  const { controlId, updates } = data;
  
  // Update control configuration
  const updatedControl = {
    id: controlId,
    ...updates,
    lastModified: new Date().toISOString()
  };

  return NextResponse.json({
    success: true,
    data: updatedControl,
    message: 'Compliance control updated'
  });
}

async function generateComplianceReport(data: any) {
  const { frameworkId, format, sections } = data;
  
  const framework = await getComplianceFramework(frameworkId);
  
  const report = {
    id: `report_${Date.now()}`,
    framework: framework.name,
    generatedAt: new Date().toISOString(),
    format,
    sections: sections || ['executive-summary', 'detailed-findings', 'recommendations', 'evidence'],
    content: {
      executiveSummary: `This report provides an assessment of ${framework.name} compliance status as of ${new Date().toLocaleDateString()}.`,
      overallScore: framework.complianceScore,
      keyFindings: [
        'All critical security controls are operational',
        'Access control policies are properly implemented',
        'Data encryption is in place for all sensitive data'
      ],
      recommendations: [
        'Continue quarterly access reviews',
        'Update incident response procedures',
        'Enhance security awareness training'
      ],
      evidenceCount: framework.requirements.reduce((sum, r) => sum + r.evidence.length, 0)
    },
    downloadUrl: `https://reports.pulsebridge.ai/compliance/${frameworkId}/${Date.now()}.pdf`
  };

  return NextResponse.json({
    success: true,
    data: report,
    message: 'Compliance report generated'
  });
}

async function scheduleComplianceAudit(data: any) {
  const { frameworkId, auditDate, auditorId, scope } = data;
  
  const audit = {
    id: `audit_${Date.now()}`,
    frameworkId,
    scheduledDate: auditDate,
    auditorId,
    scope: scope || 'full',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    estimatedDuration: '5 days',
    requiredParticipants: ['security-team', 'compliance-team', 'it-team']
  };

  return NextResponse.json({
    success: true,
    data: audit,
    message: 'Compliance audit scheduled'
  });
}

async function remediateFinding(data: any) {
  const { findingId, action, assignedTo, dueDate, comments } = data;
  
  const remediation = {
    id: `remediation_${Date.now()}`,
    findingId,
    action,
    assignedTo,
    dueDate,
    comments,
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    estimatedEffort: '2-4 hours',
    priority: 'high'
  };

  return NextResponse.json({
    success: true,
    data: remediation,
    message: 'Remediation plan created'
  });
}

// Data Privacy Management
export async function PUT(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'update_privacy_settings':
        return await updatePrivacySettings(data);
      case 'process_data_subject_request':
        return await processDataSubjectRequest(data);
      case 'update_retention_policy':
        return await updateRetentionPolicy(data);
      case 'consent_management':
        return await updateConsentManagement(data);
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Privacy management error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updatePrivacySettings(data: DataPrivacyConfig) {
  // Update privacy configuration
  return NextResponse.json({
    success: true,
    data: data,
    message: 'Privacy settings updated'
  });
}

async function processDataSubjectRequest(data: any) {
  const { requestType, dataSubjectId, requestDetails } = data;
  
  const request = {
    id: `dsr_${Date.now()}`,
    type: requestType, // 'access', 'rectification', 'erasure', 'portability', 'objection', 'restriction'
    dataSubjectId,
    details: requestDetails,
    status: 'received',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    assignedTo: 'privacy-team'
  };

  return NextResponse.json({
    success: true,
    data: request,
    message: 'Data subject request received and processing initiated'
  });
}

async function updateRetentionPolicy(data: any) {
  const { dataType, retentionPeriod, deletionMethod, jurisdiction } = data;
  
  const policy = {
    id: `policy_${Date.now()}`,
    dataType,
    retentionPeriod,
    deletionMethod,
    jurisdiction,
    updatedAt: new Date().toISOString(),
    nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
  };

  return NextResponse.json({
    success: true,
    data: policy,
    message: 'Data retention policy updated'
  });
}

async function updateConsentManagement(data: any) {
  const consentRecord = {
    id: `consent_${Date.now()}`,
    ...data,
    updatedAt: new Date().toISOString(),
    version: '1.0'
  };

  return NextResponse.json({
    success: true,
    data: consentRecord,
    message: 'Consent management settings updated'
  });
}