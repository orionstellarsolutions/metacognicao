export interface NavItem {
  label: string;
  href: string;
}

export interface ResearchLine {
  id: string;
  title: string;
  description: string;
  accentColor: 'purple' | 'blue' | 'amber';
  href: string;
}

export interface MetricItem {
  value: string;
  label: string;
}
