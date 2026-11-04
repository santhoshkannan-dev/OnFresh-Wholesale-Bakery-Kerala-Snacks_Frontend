'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  apiGetQualityInspections,
  apiInspectQuality,
  apiGetProductionOrders,
} from '@/lib/api';
import { QualityInspection, ProductionOrder } from '@/types/api';

export default function QualityControlPage() {
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const [pendingOrders, setPendingOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inspection Modal
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [sampleSize, setSampleSize] = useState(5);
  const [appearance, setAppearance] = useState<'pass' | 'marginal' | 'fail'>('pass');
  const [taste, setTaste] = useState<'pass' | 'marginal' | 'fail'>('pass');
  const [moisture, setMoisture] = useState<'pass' | 'fail'>('pass');
  const [seal, setSeal] = useState<'pass' | 'fail'>('pass');
  const [labeling, setLabeling] = useState<'pass' | 'fail'>('pass');
  const [overallResult, setOverallResult] = useState<'passed' | 'failed' | 'quarantined'>('passed');
  const [defectNotes, setDefectNotes] = useState('');
  const [correctiveActions, setCorrectiveActions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [qcRes, ordRes] = await Promise.all([
        apiGetQualityInspections(),
        apiGetProductionOrders({ status: 'quality_check' }),
      ]);
      setInspections(qcRes.data || []);
      setPendingOrders(ordRes.data || []);
      if (qcRes.error) setError(qcRes.error);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load QC inspections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openInspectionModal = (order: ProductionOrder) => {
    setSelectedOrder(order);
    setSampleSize(5);
    setAppearance('pass');
    setTaste('pass');
    setMoisture('pass');
    setSeal('pass');
    setLabeling('pass');
    setOverallResult('passed');
    setDefectNotes('');
    setCorrectiveActions('');
    setInspectModalOpen(true);
  };

  const handleInspectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      const res = await apiInspectQuality({
        production_order: selectedOrder.id,
        sample_size: Number(sampleSize),
        appearance_status: appearance,
        taste_crispness_status: taste,
        moisture_status: moisture,
        packaging_seal_status: seal,
        label_batch_verification: labeling,
        overall_result: overallResult,
        defect_notes: defectNotes,
        corrective_actions: correctiveActions,
      });

      if (res.success) {
        setInspectModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Inspection failed');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error submitting inspection');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Quality Assurance & Batch Inspection Gate"
      subtitle="Sensory evaluation, moisture testing, and nitrogen seal integrity before releasing batches to sellable stock."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="Refresh"
          >
            🔄
          </button>
        </div>
      }
    >
      {error && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* 1. Pending Inspections Queue */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            Awaiting Quality Inspection ({pendingOrders.length})
          </h2>
          <span className="text-xs text-slate-500">
            Quarantined batches blocked from customer purchase until passed
          </span>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
            ✅ No batches awaiting inspection in queue. All kitchen runs verified.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs hover:shadow-xs transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {ord.order_number}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                    Awaiting QC
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-sm mb-1">{ord.product_name}</div>
                <div className="text-xs text-slate-500 font-mono mb-3">
                  {ord.variant_sku} · {ord.produced_quantity} Packets
                </div>

                {ord.batch_number && (
                  <div className="text-xs bg-slate-50 p-2 rounded-xl border border-slate-100 mb-3">
                    <span className="text-slate-400">Batch: </span>
                    <strong className="font-mono text-slate-800">{ord.batch_number}</strong>
                  </div>
                )}

                <button
                  onClick={() => openInspectionModal(ord)}
                  className="w-full py-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>🔬</span> Conduct Inspection
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Completed Quality Inspection Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Quality Inspection Audit Log</h3>
          <span className="text-xs font-semibold text-slate-500">
            {inspections.length} recorded inspections
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">QC Number & Date</th>
                <th className="py-3 px-4">Order / Batch</th>
                <th className="py-3 px-4">Sample Size</th>
                <th className="py-3 px-4">Test Criteria</th>
                <th className="py-3 px-4">Overall Result</th>
                <th className="py-3 px-4">Release Status</th>
                <th className="py-3 px-4">Inspector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading quality inspection logs...
                  </td>
                </tr>
              ) : inspections.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No quality inspection records found.
                  </td>
                </tr>
              ) : (
                inspections.map((qc) => (
                  <tr key={qc.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{qc.inspection_number}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(qc.inspection_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-800 font-semibold">{qc.order_number}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {qc.batch_number || '—'}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {qc.sample_size} pkts
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            qc.appearance_status === 'pass'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          Appr: {qc.appearance_status}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            qc.taste_crispness_status === 'pass'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          Taste: {qc.taste_crispness_status}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            qc.moisture_status === 'pass'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          Moisture: {qc.moisture_status}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            qc.packaging_seal_status === 'pass'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          Seal: {qc.packaging_seal_status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          qc.overall_result === 'passed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : qc.overall_result === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {qc.overall_result}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          qc.release_status === 'released'
                            ? 'bg-emerald-100 text-emerald-800'
                            : qc.release_status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {qc.release_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">
                      {qc.inspector_name}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conduct Inspection Modal */}
      {inspectModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Conduct Quality Test: {selectedOrder.order_number}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Batch: {selectedOrder.batch_number || 'N/A'} · Product: {selectedOrder.product_name} ({selectedOrder.variant_sku})
            </p>

            <form onSubmit={handleInspectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sample Size (Number of Randomly Tested Packets) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              {/* Specific Test Parameters */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Food Quality & Packaging Criteria
                </span>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">1. Appearance & Slice Uniformity</div>
                    <div className="text-[10px] text-slate-400">Golden yellow color, no burnt spots</div>
                  </div>
                  <select
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value as 'pass' | 'marginal' | 'fail')}
                    className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="pass">Pass</option>
                    <option value="marginal">Marginal</option>
                    <option value="fail">Fail</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">2. Crispness & Fresh Aroma</div>
                    <div className="text-[10px] text-slate-400">Signature crunch, fresh coconut oil note</div>
                  </div>
                  <select
                    value={taste}
                    onChange={(e) => setTaste(e.target.value as 'pass' | 'marginal' | 'fail')}
                    className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="pass">Pass</option>
                    <option value="marginal">Marginal</option>
                    <option value="fail">Fail</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">3. Moisture Content Standard</div>
                    <div className="text-[10px] text-slate-400">Moisture &lt; 3.0% for extended shelf life</div>
                  </div>
                  <select
                    value={moisture}
                    onChange={(e) => setMoisture(e.target.value as 'pass' | 'fail')}
                    className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">4. Nitrogen Flush & Seal Integrity</div>
                    <div className="text-[10px] text-slate-400">Hermetic pouch seal, no leaks</div>
                  </div>
                  <select
                    value={seal}
                    onChange={(e) => setSeal(e.target.value as 'pass' | 'fail')}
                    className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">5. Label & MRP Verification</div>
                    <div className="text-[10px] text-slate-400">Batch #, Mfg date, Expiry date legible</div>
                  </div>
                  <select
                    value={labeling}
                    onChange={(e) => setLabeling(e.target.value as 'pass' | 'fail')}
                    className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                  </select>
                </div>
              </div>

              {/* Overall Decision */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Overall QC Decision *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'passed', label: 'Pass & Release', desc: 'Adds to sellable stock', color: 'border-emerald-600 text-emerald-800 bg-emerald-50' },
                    { val: 'quarantined', label: 'Quarantine', desc: 'Hold for re-test', color: 'border-amber-600 text-amber-800 bg-amber-50' },
                    { val: 'failed', label: 'Fail & Reject', desc: 'Discard batch', color: 'border-red-600 text-red-800 bg-red-50' },
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      type="button"
                      onClick={() => setOverallResult(btn.val as 'passed' | 'failed' | 'quarantined')}
                      className={`p-3 rounded-2xl border text-center transition ${
                        overallResult === btn.val ? `${btn.color} ring-2 ring-emerald-500 font-bold` : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold">{btn.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{btn.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Defect Observations / Laboratory Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Record any sensory notes, slice thickness variations, or laboratory metrics..."
                  value={defectNotes}
                  onChange={(e) => setDefectNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Confirm QC Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

