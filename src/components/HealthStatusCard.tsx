'use client';

import { useState, useEffect } from 'react';
import { getBackendHealth, API_BASE_URL } from '@/lib/api';
import { HealthCheckResponse } from '@/types/api';

export default function HealthStatusCard() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkStatus = async () => {
    setLoading(true);
    const result = await getBackendHealth();
    setHealth(result.data);
    setError(result.error);
    setLoading(false);
    setLastChecked(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    let isSubscribed = true;
    getBackendHealth().then((result) => {
      if (isSubscribed) {
        setHealth(result.data);
        setError(result.error);
        setLoading(false);
        setLastChecked(new Date().toLocaleTimeString());
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-md border border-amber-200/60 shadow-xl rounded-2xl p-6 sm:p-8 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-amber-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  health?.status === 'healthy'
                    ? 'bg-emerald-400'
                    : health
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  health?.status === 'healthy'
                    ? 'bg-emerald-500'
                    : health
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
            </span>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Backend & Database Connectivity
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Endpoint: <code className="bg-amber-50 px-2 py-0.5 rounded text-amber-900 font-mono text-[11px]">{API_BASE_URL}/health/</code>
          </p>
        </div>

        <button
          onClick={checkStatus}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-lg shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Checking...
            </span>
          ) : (
            'Refresh Status'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {/* Django API Service */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-gray-500">
              Django REST API
            </div>
            <div className="text-lg font-bold text-gray-800 mt-1">
              {loading ? (
                'Checking...'
              ) : health ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Connected
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Offline
                </span>
              )}
            </div>
          </div>
          <div className="text-[11px] text-gray-500 mt-2 font-mono">
            {health?.service || 'backend:8000'}
          </div>
        </div>

        {/* Database Engine */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-gray-500">
              Database Engine
            </div>
            <div className="text-lg font-bold text-gray-800 mt-1 uppercase font-mono">
              {health?.database.engine || 'postgresql'}
            </div>
          </div>
          <div className="text-[11px] text-gray-500 mt-2">
            Target DB: <span className="font-semibold">{health?.database.name || 'onfresh_db'}</span>
          </div>
        </div>

        {/* Database Status */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-gray-500">
              PostgreSQL Status
            </div>
            <div className="text-lg font-bold mt-1">
              {loading ? (
                <span className="text-gray-500">Checking...</span>
              ) : health?.database.status === 'connected' ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Connected
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Pending Setup
                </span>
              )}
            </div>
          </div>
          <div className="text-[11px] text-gray-500 mt-2">
            {health?.database.status === 'connected' ? 'Ready for queries' : 'Awaiting credentials'}
          </div>
        </div>
      </div>

      {/* Diagnostics / Error reporting */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl mb-4">
          <div className="flex items-start gap-2.5">
            <span className="text-rose-600 font-bold text-sm">Connection Note:</span>
            <p className="text-xs text-rose-800 leading-relaxed font-mono break-all">{error}</p>
          </div>
          <p className="text-[11px] text-rose-600 mt-2">
            Tip: Run Django server in another terminal via: <code className="bg-rose-100 px-1 py-0.5 rounded">python backend/manage.py runserver</code>
          </p>
        </div>
      )}

      {health?.database.error_detail && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl mb-4">
          <div className="flex items-start gap-2.5">
            <span className="text-amber-800 font-bold text-xs uppercase tracking-wide">
              PostgreSQL Note:
            </span>
            <div className="text-xs text-amber-900 leading-relaxed">
              Backend API is running. PostgreSQL connection details:
              <pre className="mt-1.5 p-2 bg-amber-100/60 rounded text-[11px] font-mono whitespace-pre-wrap break-all text-amber-950">
                {health.database.error_detail}
              </pre>
              <p className="mt-1.5 text-[11px] text-amber-800">
                Update <code className="bg-amber-100 px-1 rounded">DB_PASSWORD</code> in <code className="bg-amber-100 px-1 rounded">backend/.env</code> to match your local PostgreSQL service.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-amber-100/60 gap-1">
        <span>Server Time: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}</span>
        <span>Last checked: {lastChecked || 'Initial page load'}</span>
      </div>
    </div>
  );
}
