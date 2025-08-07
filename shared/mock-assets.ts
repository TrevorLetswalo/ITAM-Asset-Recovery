export interface AssetRecord {
  id: string;
  asset_tag: string;
  serial_number: string;
  recovery_type: 'Exit' | 'Swap' | 'Loaner';
  sla_stage: 'Initial' | 'Follow-Up' | 'Escalation' | 'Final Warning' | 'Breach';
  recovery_age: number; // Days in recovery
  status: 'Pending' | 'In Progress' | 'Escalated' | 'Completed' | 'Breach';
  user_name: string;
  user_email: string;
  asset_type: string;
  location: string;
  assigned_to: string;
  created_date: string;
  last_contact: string;
  sla_due_date: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  email_count: number;
}

export const mockAssets: AssetRecord[] = [
  {
    id: 'AST-001',
    asset_tag: 'LAP-001234',
    serial_number: 'SN789456123',
    recovery_type: 'Exit',
    sla_stage: 'Breach',
    recovery_age: 45,
    status: 'Breach',
    user_name: 'John Smith',
    user_email: 'john.smith@company.com',
    asset_type: 'MacBook Pro 16"',
    location: 'New York Office',
    assigned_to: 'Sarah Johnson',
    created_date: '2024-01-15',
    last_contact: '2024-01-30',
    sla_due_date: '2024-01-22',
    priority: 'Critical',
    email_count: 8
  },
  {
    id: 'AST-002',
    asset_tag: 'DSK-005678',
    serial_number: 'SN123789456',
    recovery_type: 'Swap',
    sla_stage: 'Follow-Up',
    recovery_age: 12,
    status: 'In Progress',
    user_name: 'Emily Chen',
    user_email: 'emily.chen@company.com',
    asset_type: 'Dell OptiPlex 7090',
    location: 'San Francisco Office',
    assigned_to: 'Mike Rodriguez',
    created_date: '2024-02-20',
    last_contact: '2024-02-28',
    sla_due_date: '2024-03-05',
    priority: 'Medium',
    email_count: 3
  },
  {
    id: 'AST-003',
    asset_tag: 'MON-009876',
    serial_number: 'SN456123789',
    recovery_type: 'Loaner',
    sla_stage: 'Initial',
    recovery_age: 5,
    status: 'Pending',
    user_name: 'Robert Wilson',
    user_email: 'robert.wilson@company.com',
    asset_type: 'Dell UltraSharp 27"',
    location: 'Austin Office',
    assigned_to: 'Lisa Thompson',
    created_date: '2024-02-27',
    last_contact: '2024-02-27',
    sla_due_date: '2024-03-06',
    priority: 'Low',
    email_count: 1
  },
  {
    id: 'AST-004',
    asset_tag: 'LAP-002468',
    serial_number: 'SN987654321',
    recovery_type: 'Exit',
    sla_stage: 'Escalation',
    recovery_age: 28,
    status: 'Escalated',
    user_name: 'Maria Garcia',
    user_email: 'maria.garcia@company.com',
    asset_type: 'MacBook Air 13"',
    location: 'Chicago Office',
    assigned_to: 'David Brown',
    created_date: '2024-02-05',
    last_contact: '2024-02-25',
    sla_due_date: '2024-02-12',
    priority: 'High',
    email_count: 6
  },
  {
    id: 'AST-005',
    asset_tag: 'TAB-001357',
    serial_number: 'SN135792468',
    recovery_type: 'Swap',
    sla_stage: 'Final Warning',
    recovery_age: 35,
    status: 'Escalated',
    user_name: 'James Taylor',
    user_email: 'james.taylor@company.com',
    asset_type: 'iPad Pro 12.9"',
    location: 'Boston Office',
    assigned_to: 'Jennifer Lee',
    created_date: '2024-01-28',
    last_contact: '2024-02-20',
    sla_due_date: '2024-02-04',
    priority: 'High',
    email_count: 7
  },
  {
    id: 'AST-006',
    asset_tag: 'LAP-003691',
    serial_number: 'SN369147258',
    recovery_type: 'Exit',
    sla_stage: 'Follow-Up',
    recovery_age: 18,
    status: 'In Progress',
    user_name: 'Amanda Davis',
    user_email: 'amanda.davis@company.com',
    asset_type: 'Lenovo ThinkPad X1',
    location: 'Seattle Office',
    assigned_to: 'Kevin White',
    created_date: '2024-02-14',
    last_contact: '2024-02-26',
    sla_due_date: '2024-02-28',
    priority: 'Medium',
    email_count: 4
  },
  {
    id: 'AST-007',
    asset_tag: 'DSK-007531',
    serial_number: 'SN753159486',
    recovery_type: 'Loaner',
    sla_stage: 'Initial',
    recovery_age: 8,
    status: 'Pending',
    user_name: 'Christopher Moore',
    user_email: 'chris.moore@company.com',
    asset_type: 'HP EliteDesk 800',
    location: 'Denver Office',
    assigned_to: 'Rachel Green',
    created_date: '2024-02-24',
    last_contact: '2024-02-24',
    sla_due_date: '2024-03-03',
    priority: 'Low',
    email_count: 1
  },
  {
    id: 'AST-008',
    asset_tag: 'LAP-004825',
    serial_number: 'SN482516973',
    recovery_type: 'Exit',
    sla_stage: 'Breach',
    recovery_age: 52,
    status: 'Breach',
    user_name: 'Laura Martinez',
    user_email: 'laura.martinez@company.com',
    asset_type: 'Surface Laptop 4',
    location: 'Miami Office',
    assigned_to: 'Alex Johnson',
    created_date: '2024-01-10',
    last_contact: '2024-01-25',
    sla_due_date: '2024-01-17',
    priority: 'Critical',
    email_count: 9
  },
  {
    id: 'AST-009',
    asset_tag: 'MON-012468',
    serial_number: 'SN124681357',
    recovery_type: 'Swap',
    sla_stage: 'Follow-Up',
    recovery_age: 15,
    status: 'In Progress',
    user_name: 'Daniel Kim',
    user_email: 'daniel.kim@company.com',
    asset_type: 'LG UltraWide 34"',
    location: 'Portland Office',
    assigned_to: 'Megan Clark',
    created_date: '2024-02-17',
    last_contact: '2024-02-29',
    sla_due_date: '2024-03-02',
    priority: 'Medium',
    email_count: 3
  },
  {
    id: 'AST-010',
    asset_tag: 'LAP-005937',
    serial_number: 'SN593741826',
    recovery_type: 'Loaner',
    sla_stage: 'Escalation',
    recovery_age: 32,
    status: 'Escalated',
    user_name: 'Michelle Brown',
    user_email: 'michelle.brown@company.com',
    asset_type: 'MacBook Pro 14"',
    location: 'Las Vegas Office',
    assigned_to: 'Tom Wilson',
    created_date: '2024-01-31',
    last_contact: '2024-02-22',
    sla_due_date: '2024-02-07',
    priority: 'High',
    email_count: 5
  }
];

// Generate additional 40 records programmatically
const additionalAssets: AssetRecord[] = [];

const assetTypes = [
  'MacBook Pro 16"', 'MacBook Pro 14"', 'MacBook Air 13"', 'Dell OptiPlex 7090', 
  'HP EliteDesk 800', 'Lenovo ThinkPad X1', 'Surface Laptop 4', 'iPad Pro 12.9"',
  'Dell UltraSharp 27"', 'LG UltraWide 34"', 'iPhone 14 Pro', 'Samsung Galaxy Tab'
];

const locations = [
  'New York Office', 'San Francisco Office', 'Austin Office', 'Chicago Office',
  'Boston Office', 'Seattle Office', 'Denver Office', 'Miami Office', 
  'Portland Office', 'Las Vegas Office', 'Remote'
];

const assignees = [
  'Sarah Johnson', 'Mike Rodriguez', 'Lisa Thompson', 'David Brown',
  'Jennifer Lee', 'Kevin White', 'Rachel Green', 'Alex Johnson',
  'Megan Clark', 'Tom Wilson'
];

const firstNames = ['Alex', 'Sam', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Quinn', 'Sage', 'River'];
const lastNames = ['Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Anderson', 'Thomas', 'Jackson'];

for (let i = 11; i <= 50; i++) {
  const recoveryTypes: ('Exit' | 'Swap' | 'Loaner')[] = ['Exit', 'Swap', 'Loaner'];
  const slaStages: ('Initial' | 'Follow-Up' | 'Escalation' | 'Final Warning' | 'Breach')[] = 
    ['Initial', 'Follow-Up', 'Escalation', 'Final Warning', 'Breach'];
  const statuses: ('Pending' | 'In Progress' | 'Escalated' | 'Completed' | 'Breach')[] = 
    ['Pending', 'In Progress', 'Escalated', 'Completed', 'Breach'];
  const priorities: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];

  const recoveryType = recoveryTypes[Math.floor(Math.random() * recoveryTypes.length)];
  const slaStage = slaStages[Math.floor(Math.random() * slaStages.length)];
  const status = slaStage === 'Breach' ? 'Breach' : statuses[Math.floor(Math.random() * (statuses.length - 1))];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  
  const recoveryAge = Math.floor(Math.random() * 60) + 1;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const userName = `${firstName} ${lastName}`;
  const userEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
  
  const createdDate = new Date(2024, Math.floor(Math.random() * 2) + 1, Math.floor(Math.random() * 28) + 1);
  const slaDate = new Date(createdDate);
  slaDate.setDate(slaDate.getDate() + 7);
  const lastContactDate = new Date(createdDate);
  lastContactDate.setDate(lastContactDate.getDate() + Math.floor(Math.random() * recoveryAge));

  additionalAssets.push({
    id: `AST-${i.toString().padStart(3, '0')}`,
    asset_tag: `${['LAP', 'DSK', 'MON', 'TAB'][Math.floor(Math.random() * 4)]}-${Math.floor(Math.random() * 900000) + 100000}`,
    serial_number: `SN${Math.floor(Math.random() * 900000000) + 100000000}`,
    recovery_type: recoveryType,
    sla_stage: slaStage,
    recovery_age: recoveryAge,
    status: status,
    user_name: userName,
    user_email: userEmail,
    asset_type: assetTypes[Math.floor(Math.random() * assetTypes.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    assigned_to: assignees[Math.floor(Math.random() * assignees.length)],
    created_date: createdDate.toISOString().split('T')[0],
    last_contact: lastContactDate.toISOString().split('T')[0],
    sla_due_date: slaDate.toISOString().split('T')[0],
    priority: priority,
    email_count: Math.floor(Math.random() * 10) + 1
  });
}

export const allMockAssets = [...mockAssets, ...additionalAssets];

// Helper functions for dashboard calculations
export const getDashboardStats = () => {
  const totalPending = allMockAssets.filter(asset => asset.status === 'Pending' || asset.status === 'In Progress').length;
  const slaBreaches = allMockAssets.filter(asset => asset.sla_stage === 'Breach').length;
  const recoveredThisMonth = allMockAssets.filter(asset => asset.status === 'Completed').length;
  const openExitTickets = allMockAssets.filter(asset => asset.recovery_type === 'Exit' && asset.status !== 'Completed').length;
  
  return {
    totalPending,
    slaBreaches,
    recoveredThisMonth,
    openExitTickets
  };
};

export const getRecoveryByType = () => {
  const exit = allMockAssets.filter(asset => asset.recovery_type === 'Exit').length;
  const swap = allMockAssets.filter(asset => asset.recovery_type === 'Swap').length;
  const loaner = allMockAssets.filter(asset => asset.recovery_type === 'Loaner').length;
  
  return { exit, swap, loaner };
};

export const getSlaComplianceRate = () => {
  const total = allMockAssets.length;
  const compliant = allMockAssets.filter(asset => asset.sla_stage !== 'Breach').length;
  return Math.round((compliant / total) * 100);
};
