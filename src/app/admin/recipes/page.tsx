'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  apiGetRecipes,
  apiCreateRecipe,
  apiCheckRecipeAvailability,
  apiGetRawMaterials,
} from '@/lib/api';
import { Recipe, RawMaterial, IngredientAvailabilityCheck } from '@/types/api';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Availability Check Modal
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [targetBatchUnits, setTargetBatchUnits] = useState('200');
  const [availabilityResult, setAvailabilityResult] = useState<IngredientAvailabilityCheck | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Create Recipe Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [recipeCode, setRecipeCode] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [outputUnits, setOutputUnits] = useState('200');
  const [laborCost, setLaborCost] = useState('600');
  const [overheadCost, setOverheadCost] = useState('350');
  const [instructions, setInstructions] = useState('');
  const [ingLines, setIngLines] = useState<
    Array<{ material_id: number | ''; quantity: string; unit: string; wastage: string }>
  >([
    { material_id: '', quantity: '60', unit: 'kg', wastage: '8' },
  ]);
  const [pkgLines, setPkgLines] = useState<
    Array<{ packaging_material_id: number | ''; quantity: string; unit: string; notes: string }>
  >([
    { packaging_material_id: '', quantity: '200', unit: 'pcs', notes: 'Retail printed pouch' },
  ]);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [recRes, matRes] = await Promise.all([
        apiGetRecipes({ search: search || undefined }),
        apiGetRawMaterials(),
      ]);
      setRecipes(recRes.data || []);
      setMaterials(matRes.data || []);
      if (recRes.error) setError(recRes.error);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRunAvailabilityCheck = async (rec: Recipe, unitsStr: string) => {
    setSelectedRecipe(rec);
    setTargetBatchUnits(unitsStr);
    setCheckModalOpen(true);
    setCheckingAvailability(true);
    try {
      const res = await apiCheckRecipeAvailability(rec.id, Number(unitsStr) || 100);
      setAvailabilityResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const addIngredientLine = () => {
    setIngLines([...ingLines, { material_id: '', quantity: '10', unit: 'kg', wastage: '0' }]);
  };

  const addPackagingLine = () => {
    setPkgLines([...pkgLines, { packaging_material_id: '', quantity: '100', unit: 'pcs', notes: '' }]);
  };

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recipes.length === 0) {
      alert('Product catalogue required');
      return;
    }
    setCreateSubmitting(true);
    try {
      const baseProduct = recipes[0].product; // Use first existing product or default
      const res = await apiCreateRecipe({
        product: baseProduct,
        recipe_code: recipeCode,
        name: recipeName,
        batch_output_quantity: outputUnits,
        output_unit: 'packets',
        target_variant_units: Number(outputUnits),
        estimated_labor_cost: laborCost,
        estimated_overhead_cost: overheadCost,
        instructions,
        ingredients: ingLines
          .filter((i) => i.material_id)
          .map((i) => ({
            material_id: Number(i.material_id),
            quantity: i.quantity,
            unit: i.unit,
            wastage_percentage: i.wastage,
          })),
        packaging_materials: pkgLines
          .filter((p) => p.packaging_material_id)
          .map((p) => ({
            packaging_material_id: Number(p.packaging_material_id),
            quantity: p.quantity,
            unit: p.unit,
            notes: p.notes,
          })),
      });

      if (res.success) {
        setCreateModalOpen(false);
        setRecipeCode('');
        setRecipeName('');
        loadData();
      } else {
        alert(res.message || 'Failed to create recipe');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating recipe');
    } finally {
      setCreateSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Recipe & Bill of Materials (BOM) Management"
      subtitle="Standard Kerala snack formulations, ingredient wastage ratios, packaging rules, and production cost breakdowns."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#093725] to-[#15803d] text-amber-300 rounded-xl text-xs font-bold hover:shadow-md transition"
          >
            + Create Master Recipe
          </button>
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

      {/* Search Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search recipe code, snack name, product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600 w-80"
        />
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{recipes.length}</span> master recipes
        </div>
      </div>

      {/* Recipe Cards List */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            Loading master recipes & bill of materials...
          </div>
        ) : recipes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No recipes created yet. Click &quot;+ Create Master Recipe&quot; to define standard formulations.
          </div>
        ) : (
          recipes.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 hover:shadow-xs transition"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{rec.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                      v{rec.version}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono">
                    <span className="text-emerald-800 font-semibold">{rec.recipe_code}</span>
                    <span>•</span>
                    <span>Product: {rec.product_name}</span>
                    {rec.variant_sku && (
                      <>
                        <span>•</span>
                        <span>Variant: {rec.variant_sku} ({rec.variant_weight})</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Cost Calculation Summary Badge */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-right">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Est. Cost Per Packet
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{Number(rec.estimated_cost_per_unit || 0).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Batch Total: ₹{Number(rec.estimated_total_cost || 0).toFixed(2)} ({rec.target_variant_units} pkts)
                  </div>
                </div>
              </div>

              {/* Ingredients & Packaging Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
                {/* 1. Raw Material Ingredients */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>🌾 Agricultural & Oil Ingredients</span>
                    <span className="text-slate-500 font-normal">
                      Subtotal: ₹{Number(rec.estimated_raw_material_cost).toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {rec.ingredients?.map((ing) => (
                      <div
                        key={ing.id}
                        className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{ing.material_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Base: {ing.quantity} {ing.unit}
                            {Number(ing.wastage_percentage) > 0 && ` (+${ing.wastage_percentage}% waste)`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">
                            {Number(ing.effective_quantity).toFixed(2)} {ing.unit}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            ₹{Number(ing.effective_cost).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Packaging Materials */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>📦 Packaging Requirements</span>
                    <span className="text-slate-500 font-normal">
                      Subtotal: ₹{Number(rec.estimated_packaging_cost).toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {rec.packaging_materials?.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{pkg.material_name}</div>
                          <div className="text-[10px] text-slate-400">{pkg.notes || 'Packaging unit'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">
                            {Number(pkg.quantity).toFixed(0)} {pkg.unit}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            ₹{Number(pkg.effective_cost).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Manufacturing Instructions preview */}
              {rec.instructions && (
                <div className="mb-4 text-xs bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-2xl text-slate-700">
                  <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <span>🍳 Kitchen Production Guidelines</span>
                  </div>
                  <div className="whitespace-pre-line text-slate-600 text-[11px] leading-relaxed">
                    {rec.instructions}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Labor: <strong>₹{rec.estimated_labor_cost}</strong> · Overhead: <strong>₹{rec.estimated_overhead_cost}</strong>
                </div>
                <button
                  onClick={() => handleRunAvailabilityCheck(rec, String(rec.target_variant_units || 200))}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>🔍</span> Check Ingredient Availability
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stock Availability Modal */}
      {checkModalOpen && selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Check Stock for: {selectedRecipe.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Calculates required raw materials and packaging against Vandiperiyar stock.
                </p>
              </div>
              <button
                onClick={() => setCheckModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-4 flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Planned Batch Units (Packets):</label>
              <input
                type="number"
                min="1"
                value={targetBatchUnits}
                onChange={(e) => setTargetBatchUnits(e.target.value)}
                className="w-28 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
              <button
                type="button"
                onClick={() => handleRunAvailabilityCheck(selectedRecipe, targetBatchUnits)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                Re-calculate
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {checkingAvailability ? (
                <div className="p-8 text-center text-xs text-slate-400">Verifying inventory balances...</div>
              ) : !availabilityResult ? (
                <div className="p-8 text-center text-xs text-slate-400">No availability data</div>
              ) : (
                <>
                  <div
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                      availabilityResult.is_sufficient
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}
                  >
                    <span>
                      {availabilityResult.is_sufficient
                        ? '✅ Sufficient Stock Available for Production Run'
                        : `❌ Stock Shortfall: ${availabilityResult.shortfalls.length} items missing`}
                    </span>
                  </div>

                  <table className="w-full text-left text-xs mt-3">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Material</th>
                        <th className="py-2.5 px-3">Required</th>
                        <th className="py-2.5 px-3">Available</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {availabilityResult.requirements.map((req) => (
                        <tr key={req.material_id}>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900">{req.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{req.material_code}</div>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">
                            {Number(req.required_quantity).toFixed(2)} {req.unit}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-600">
                            {Number(req.available_quantity).toFixed(2)} {req.unit}
                          </td>
                          <td className="py-2.5 px-3">
                            {req.has_shortfall ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                                Short: {Number(req.shortfall_quantity).toFixed(2)} {req.unit}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                In Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setCheckModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Recipe Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Master Recipe (BOM)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Specify standard batch output, raw ingredients with peeling/frying wastage, and packaging.
            </p>

            <form onSubmit={handleCreateRecipe} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipe Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RCP-MUR-001"
                    value={recipeCode}
                    onChange={(e) => setRecipeCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipe Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Traditional Kerala Murukku 200 Pkts"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Output Units (Packets) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={outputUnits}
                    onChange={(e) => setOutputUnits(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Labor Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Overhead Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={overheadCost}
                    onChange={(e) => setOverheadCost(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Dynamic Ingredients */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Raw Material Ingredients
                  </span>
                  <button
                    type="button"
                    onClick={addIngredientLine}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    + Add Ingredient
                  </button>
                </div>
                <div className="space-y-2">
                  {ingLines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <select
                          required
                          value={line.material_id}
                          onChange={(e) => {
                            const updated = [...ingLines];
                            updated[idx].material_id = Number(e.target.value);
                            setIngLines(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="">Select Ingredient</option>
                          {materials.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.unit_of_measure})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          step="0.001"
                          placeholder="Qty"
                          required
                          value={line.quantity}
                          onChange={(e) => {
                            const updated = [...ingLines];
                            updated[idx].quantity = e.target.value;
                            setIngLines(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="w-16">
                        <input
                          type="text"
                          placeholder="Unit"
                          value={line.unit}
                          onChange={(e) => {
                            const updated = [...ingLines];
                            updated[idx].unit = e.target.value;
                            setIngLines(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Waste %"
                          value={line.wastage}
                          onChange={(e) => {
                            const updated = [...ingLines];
                            updated[idx].wastage = e.target.value;
                            setIngLines(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                          title="Peeling or moisture loss percentage"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Packaging */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Packaging Materials
                  </span>
                  <button
                    type="button"
                    onClick={addPackagingLine}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    + Add Packaging
                  </button>
                </div>
                <div className="space-y-2">
                  {pkgLines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <select
                          required
                          value={line.packaging_material_id}
                          onChange={(e) => {
                            const updated = [...pkgLines];
                            updated[idx].packaging_material_id = Number(e.target.value);
                            setPkgLines(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="">Select Packaging Material</option>
                          {materials.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.material_code})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          step="1"
                          placeholder="Qty"
                          required
                          value={line.quantity}
                          onChange={(e) => {
                            const updated = [...pkgLines];
                            updated[idx].quantity = e.target.value;
                            setPkgLines(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kitchen Frying & Cooking Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Step by step preparation instructions..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 disabled:opacity-50"
                >
                  {createSubmitting ? 'Saving...' : 'Save Master Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

