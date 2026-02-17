import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workOrdersApi, usersApi } from '@/api/services';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import Spinner from '@/components/Spinner';
import type { WorkOrderResponse, UserResponse, WorkOrderStatus } from '@/types';
import {
  CATEGORY_LABELS,
  WORK_ORDER_STATUSES,
  STATUS_LABELS,
} from '@/types';

export default function WorkOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [wo, setWo] = useState<WorkOrderResponse | null>(null);
  const [techs, setTechs] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Update form state
  const [newStatus, setNewStatus] = useState<WorkOrderStatus | ''>('');
  const [newTechId, setNewTechId] = useState<number | ''>('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [woData, techData] = await Promise.all([
          workOrdersApi.get(Number(id)),
          user?.role !== 'TECH' ? usersApi.listByRole('TECH') : Promise.resolve([]),
        ]);
        setWo(woData);
        setTechs(techData);
        setNewStatus(woData.status);
        setNewTechId(woData.assignedToId || '');
      } catch {
        addToast('Failed to load work order', 'error');
        navigate('/work-orders');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async () => {
    if (!wo) return;
    const payload: any = {};
    if (newStatus && newStatus !== wo.status) payload.status = newStatus;
    if (newTechId && newTechId !== wo.assignedToId) payload.assignedToId = newTechId;

    if (Object.keys(payload).length === 0) {
      addToast('No changes to save', 'info');
      return;
    }

    setUpdating(true);
    try {
      const updated = await workOrdersApi.update(wo.id, payload);
      setWo(updated);
      setNewStatus(updated.status);
      setNewTechId(updated.assignedToId || '');
      addToast('Work order updated!', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!wo) return null;

  const canEdit = user?.role === 'ADMIN' || user?.role === 'PROPERTY_MANAGER';

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back link */}
      <button
        onClick={() => navigate('/work-orders')}
        className="mb-4 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        ← Back to Work Orders
      </button>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{wo.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Work Order #{wo.id} · Created {new Date(wo.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={wo.priority} />
              <StatusBadge status={wo.status} />
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid gap-6 px-6 py-5 sm:grid-cols-2">
          <DetailItem label="Property" value={wo.propertyName} />
          <DetailItem label="Unit" value={wo.unitNumber} />
          <DetailItem label="Category" value={CATEGORY_LABELS[wo.category]} />
          <DetailItem label="Submitted By" value={wo.submittedByName} />
          <DetailItem label="Assigned To" value={wo.assignedToName || 'Unassigned'} />
          <DetailItem
            label="Last Updated"
            value={new Date(wo.updatedAt).toLocaleString()}
          />
        </div>

        {/* Description */}
        {wo.description && (
          <div className="border-t border-gray-100 px-6 py-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Description</h3>
            <p className="whitespace-pre-wrap text-sm text-gray-600">{wo.description}</p>
          </div>
        )}

        {/* Update panel — only ADMIN and PROPERTY_MANAGER */}
        {canEdit && (
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Update Work Order</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as WorkOrderStatus)}
                  className="input-field"
                >
                  {WORK_ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Assign Tech</label>
                <select
                  value={newTechId}
                  onChange={(e) => setNewTechId(Number(e.target.value))}
                  className="input-field"
                >
                  <option value="">Unassigned</option>
                  {techs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="btn-primary py-2"
              >
                {updating ? <Spinner size="sm" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
