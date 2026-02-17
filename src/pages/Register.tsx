import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authApi, companiesApi } from '@/api/services';
import Spinner from '@/components/Spinner';
import type { CompanyResponse, Role } from '@/types';
import { ROLES, ROLE_LABELS } from '@/types';

export default function RegisterPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('ADMIN');
  const [companyId, setCompanyId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  // For creating a new company
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [creatingCompany, setCreatingCompany] = useState(false);

  useEffect(() => {
    companiesApi
      .list()
      .then((data) => {
        setCompanies(data);
        if (data.length > 0) setCompanyId(data[0].id);
      })
      .catch(() => addToast('Failed to load companies', 'error'))
      .finally(() => setLoadingCompanies(false));
  }, [addToast]);

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) {
      addToast('Company name is required', 'error');
      return;
    }
    setCreatingCompany(true);
    try {
      const co = await companiesApi.create({ name: newCompanyName.trim() });
      setCompanies((prev) => [...prev, co]);
      setCompanyId(co.id);
      setShowNewCompany(false);
      setNewCompanyName('');
      addToast('Company created!', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to create company', 'error');
    } finally {
      setCreatingCompany(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !companyId) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register({
        firstName,
        lastName,
        email,
        password,
        phone: phone || undefined,
        role,
        companyId: companyId as number,
      });
      login(res.token, res.user);
      addToast('Account created!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold text-white">
            S&E
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Join the Maintenance Manager platform</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-field"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-field"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="(555) 555-5555"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="input-field"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>

            {/* Company selection */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Company *</label>
              {loadingCompanies ? (
                <div className="flex items-center gap-2 py-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-gray-500">Loading companies...</span>
                </div>
              ) : showNewCompany ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="input-field"
                    placeholder="Enter company name"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateCompany}
                      disabled={creatingCompany}
                      className="btn-primary py-2 text-sm"
                    >
                      {creatingCompany ? <Spinner size="sm" /> : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCompany(false)}
                      className="rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(Number(e.target.value))}
                    className="input-field"
                  >
                    <option value="" disabled>
                      Select a company
                    </option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCompany(true)}
                    className="mt-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    + Create new company
                  </button>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full"
          >
            {loading ? <Spinner size="sm" /> : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
