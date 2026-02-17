import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { companiesApi } from '@/api/services';
import Spinner from '@/components/Spinner';
import type { CompanyResponse } from '@/types';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    if (!user) return;
    companiesApi
      .get(user.companyId)
      .then((c) => {
        setCompany(c);
        setForm({
          name: c.name || '',
          phone: c.phone || '',
          address: c.address || '',
          city: c.city || '',
          state: c.state || '',
          zip: c.zip || '',
        });
      })
      .catch(() => addToast('Failed to load company', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.companyId]);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!company || !form.name.trim()) {
      addToast('Company name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const updated = await companiesApi.update(company.id, {
        name: form.name.trim(),
        phone: form.phone || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        zip: form.zip || undefined,
      });
      setCompany(updated);
      await refreshUser();
      addToast('Company settings saved!', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your company details.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Company Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => set('state', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Zip</label>
              <input
                type="text"
                value={form.zip}
                onChange={(e) => set('zip', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary py-2">
            {saving ? <Spinner size="sm" /> : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
