import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { propertiesApi, workOrdersApi } from '@/api/services';
import type { PropertyResponse, WorkOrderResponse, WorkOrderStatus } from '@/types';
import { STATUS_LABELS, WORK_ORDER_STATUSES } from '@/types';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import Spinner from '@/components/Spinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wo, props] = await Promise.all([
          workOrdersApi.list(),
          user?.role !== 'TECH' ? propertiesApi.list() : Promise.resolve([]),
        ]);
        setWorkOrders(wo);
        setProperties(props);
      } catch {
        // errors handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const statusCounts = WORK_ORDER_STATUSES.reduce(
    (acc, s) => {
      acc[s] = workOrders.filter((wo) => wo.status === s).length;
      return acc;
    },
    {} as Record<WorkOrderStatus, number>,
  );

  const recentOrders = [...workOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Welcome back, {user?.firstName}. Here's an overview.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {user?.role !== 'TECH' && (
          <StatCard
            label={user?.role === 'ADMIN' ? 'Total Properties' : 'My Properties'}
            value={properties.length}
            color="bg-blue-50 text-blue-700"
          />
        )}
        <StatCard
          label={user?.role === 'TECH' ? 'Assigned Work Orders' : 'Total Work Orders'}
          value={workOrders.length}
          color="bg-purple-50 text-purple-700"
        />
        <StatCard
          label="In Progress"
          value={statusCounts.IN_PROGRESS}
          color="bg-yellow-50 text-yellow-700"
        />
        <StatCard
          label="Completed"
          value={statusCounts.COMPLETED}
          color="bg-green-50 text-green-700"
        />
      </div>

      {/* Status breakdown for ADMIN */}
      {user?.role === 'ADMIN' && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Work Orders by Status</h2>
          <div className="grid gap-3 sm:grid-cols-5">
            {WORK_ORDER_STATUSES.map((s) => (
              <div key={s} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{statusCounts[s]}</p>
                <p className="mt-1 text-xs text-gray-500">{STATUS_LABELS[s]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent work orders */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Work Orders</h2>
          <Link
            to="/work-orders"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">No work orders yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((wo) => (
              <Link
                key={wo.id}
                to={`/work-orders/${wo.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{wo.title}</p>
                  <p className="text-xs text-gray-500">
                    {wo.propertyName} · Unit {wo.unitNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={wo.priority} />
                  <StatusBadge status={wo.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`rounded-xl p-5 ${color}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}
