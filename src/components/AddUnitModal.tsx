import { useState, type FormEvent } from 'react';
import { propertiesApi } from '@/api/services';
import { useToast } from '@/contexts/ToastContext';
import Spinner from './Spinner';

interface Props {
  propertyId: number;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddUnitModal({ propertyId, onClose, onAdded }: Props) {
  const { addToast } = useToast();
  const [unitNumber, setUnitNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!unitNumber.trim()) {
      addToast('Unit number is required', 'error');
      return;
    }
    setLoading(true);
    try {
      await propertiesApi.addUnit(propertyId, { unitNumber: unitNumber.trim() });
      addToast('Unit added!', 'success');
      onAdded();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to add unit', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add Unit</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Unit Number *</label>
            <input
              type="text"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              className="input-field"
              placeholder="e.g. 101A"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary py-2">
              {loading ? <Spinner size="sm" /> : 'Add Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
