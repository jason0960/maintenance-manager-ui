import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertiesApi, workOrdersApi } from '@/api/services';
import { useToast } from '@/contexts/ToastContext';
import Spinner from '@/components/Spinner';
import type { PropertyResponse, UnitResponse, WorkOrderCategory, Priority } from '@/types';
import {
  WORK_ORDER_CATEGORIES,
  CATEGORY_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
} from '@/types';

export default function CreateWorkOrderPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [units, setUnits] = useState<UnitResponse[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [propertyId, setPropertyId] = useState<number | ''>('');
  const [unitId, setUnitId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkOrderCategory>('GENERAL');
  const [priority, setPriority] = useState<Priority>('MEDIUM');

  useEffect(() => {
    propertiesApi
      .list()
      .then(setProperties)
      .catch(() => addToast('Failed to load properties', 'error'))
      .finally(() => setLoadingProps(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When property changes, fetch its units
  useEffect(() => {
    if (!propertyId) {
      setUnits([]);
      setUnitId('');
      return;
    }
    setLoadingUnits(true);
    propertiesApi
      .get(propertyId as number)
      .then((p) => {
        setUnits(p.units || []);
        setUnitId('');
      })
      .catch(() => addToast('Failed to load units', 'error'))
      .finally(() => setLoadingUnits(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!propertyId || !unitId || !title.trim()) {
      addToast('Property, unit, and title are required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await workOrdersApi.create({
        propertyId: propertyId as number,
        unitId: unitId as number,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
      });
      addToast('Work order created!', 'success');
      navigate('/work-orders');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to create work order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Create Work Order</h1>
      <p className="mt-1 text-sm text-gray-500">Submit a new maintenance work order.</p>

      {loadingProps ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-4">
            {/* Property */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Property *</label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(Number(e.target.value))}
                className="input-field"
              >
                <option value="" disabled>
                  Select property
                </option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Unit *</label>
              {loadingUnits ? (
                <div className="flex items-center gap-2 py-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-gray-500">Loading units...</span>
                </div>
              ) : (
                <select
                  value={unitId}
                  onChange={(e) => setUnitId(Number(e.target.value))}
                  className="input-field"
                  disabled={!propertyId}
                >
                  <option value="" disabled>
                    {propertyId ? 'Select unit' : 'Select a property first'}
                  </option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.unitNumber}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="e.g. Leaking kitchen faucet"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Provide additional details..."
              />
            </div>

            {/* Category + Priority row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WorkOrderCategory)}
                  className="input-field"
                >
                  {WORK_ORDER_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Priority *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="input-field"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_LABELS[p]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/work-orders')}
              className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary py-2">
              {submitting ? <Spinner size="sm" /> : 'Submit Work Order'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
