import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { workOrdersApi } from '@/api/services';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import Spinner from '@/components/Spinner';
import type { WorkOrderResponse, WorkOrderStatus, Priority, WorkOrderCategory } from '@/types';
import {
  WORK_ORDER_STATUSES,
  STATUS_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
  WORK_ORDER_CATEGORIES,
  CATEGORY_LABELS,
} from '@/types';

export default function WorkOrdersPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const propertyIdFilter = searchParams.get('propertyId');

  const [workOrders, setWorkOrders] = useState<WorkOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<WorkOrderCategory | ''>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    workOrdersApi
      .list()
      .then(setWorkOrders)
      .catch(() => addToast('Failed to load work orders', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let result = [...workOrders];
    if (propertyIdFilter) {
      result = result.filter((wo) => wo.propertyId === Number(propertyIdFilter));
    }
    if (statusFilter) result = result.filter((wo) => wo.status === statusFilter);
    if (priorityFilter) result = result.filter((wo) => wo.priority === priorityFilter);
    if (categoryFilter) result = result.filter((wo) => wo.category === categoryFilter);
    result.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });
    return result;
  }, [workOrders, statusFilter, priorityFilter, categoryFilter, sortOrder, propertyIdFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="mt-1 text-sm text-gray-500">{filtered.length} work orders</p>
        </div>
        {user?.role !== 'TECH' && (
          <Link to="/work-orders/new" className="btn-primary">
            + New Work Order
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as WorkOrderStatus | '')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {WORK_ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as WorkOrderCategory | '')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {WORK_ORDER_CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Work orders table */}
      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-400">No work orders match your filters.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Title</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Property</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Category</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Priority</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Assigned To</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((wo) => (
                  <tr key={wo.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/work-orders/${wo.id}`}
                        className="font-medium text-brand-600 hover:text-brand-700"
                      >
                        {wo.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {wo.propertyName} · {wo.unitNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {CATEGORY_LABELS[wo.category]}
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={wo.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={wo.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {wo.assignedToName || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(wo.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {filtered.map((wo) => (
              <Link
                key={wo.id}
                to={`/work-orders/${wo.id}`}
                className="block px-4 py-3 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{wo.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {wo.propertyName} · Unit {wo.unitNumber}
                    </p>
                  </div>
                  <PriorityBadge priority={wo.priority} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge status={wo.status} />
                  <span className="text-xs text-gray-400">
                    {new Date(wo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
