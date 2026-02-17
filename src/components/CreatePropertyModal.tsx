import { useState, type FormEvent } from 'react';
import { propertiesApi } from '@/api/services';
import { useToast } from '@/contexts/ToastContext';
import Spinner from './Spinner';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreatePropertyModal({ onClose, onCreated }: Props) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: 'TX',
    zip: '',
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.city || !form.state || !form.zip) {
      addToast('All fields are required', 'error');
      return;
    }
    setLoading(true);
    try {
      await propertiesApi.create(form);
      addToast('Property created!', 'success');
      onCreated();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to create property', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Create Property</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Property Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="input-field"
              placeholder="Sunset Apartments"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Address *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              className="input-field"
              placeholder="123 Main St"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">City *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className="input-field"
                placeholder="Dallas"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">State *</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => set('state', e.target.value)}
                className="input-field"
                placeholder="TX"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Zip *</label>
              <input
                type="text"
                value={form.zip}
                onChange={(e) => set('zip', e.target.value)}
                className="input-field"
                placeholder="75001"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary py-2">
              {loading ? <Spinner size="sm" /> : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
