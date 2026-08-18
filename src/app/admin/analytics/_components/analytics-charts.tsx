'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useTheme } from 'next-themes';

interface ActionDatum {
  name: string;
  count: number;
}

interface DailyDatum {
  date: string;
  total: number;
  login: number;
  logout: number;
  reset: number;
  other: number;
}

interface ContentDatum {
  label: string;
  value: number;
  color: string;
}

interface CategoryDatum {
  name: string;
  count: number;
}

const ACTION_COLORS = [
  '#175bea', // blue
  '#00c5fb', // cyan
  '#030f2b', // dark
  '#5a6485',
  '#8b9bc7',
  '#94a3b8',
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatActionLabel(action: string): string {
  return action
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function ActivityCharts({
  actionBreakdown,
  dailyActivity,
}: {
  actionBreakdown: ActionDatum[];
  dailyActivity: DailyDatum[];
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(3,15,43,0.06)';
  const axisColor = isDark ? '#8b9bc7' : '#5a6485';
  const tooltipBg = isDark ? '#0a1a3f' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e4e8f1';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Daily activity line chart */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Activity Timeline (last 14 days)
        </p>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyActivity} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fill: axisColor, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: axisColor, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(label) => formatDate(label as string)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="login"
                stroke="#175bea"
                strokeWidth={2}
                dot={{ r: 3, fill: '#175bea' }}
                name="Login"
              />
              <Line
                type="monotone"
                dataKey="logout"
                stroke="#00c5fb"
                strokeWidth={2}
                dot={{ r: 3, fill: '#00c5fb' }}
                name="Logout"
              />
              <Line
                type="monotone"
                dataKey="reset"
                stroke="#5a6485"
                strokeWidth={2}
                dot={{ r: 3, fill: '#5a6485' }}
                name="Reset"
              />
              <Line
                type="monotone"
                dataKey="other"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                name="Other"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action breakdown bar chart */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Action Breakdown
        </p>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={actionBreakdown} layout="vertical" margin={{ top: 8, right: 16, left: 24, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: axisColor, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: axisColor, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatActionLabel}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => [value, formatActionLabel(name)]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {actionBreakdown.map((_, idx) => (
                  <Cell key={idx} fill={ACTION_COLORS[idx % ACTION_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function ContentDistribution({ data }: { data: ContentDatum[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const tooltipBg = isDark ? '#0a1a3f' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e4e8f1';

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            stroke={isDark ? '#030f2b' : '#ffffff'}
            strokeWidth={2}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopSkillsByCategory({ data }: { data: CategoryDatum[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(3,15,43,0.06)';
  const axisColor = isDark ? '#8b9bc7' : '#5a6485';
  const tooltipBg = isDark ? '#0a1a3f' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e4e8f1';

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={ACTION_COLORS[idx % ACTION_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
