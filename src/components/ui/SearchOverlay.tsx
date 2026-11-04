'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { Product } from '@/types/api';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getProducts({ search: query.trim() });
        if (res.data) {
          setResults(res.data.results.slice(0, 6));
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#281411]/70 backdrop-blur-md transition-opacity duration-300"
      />

      <div className="relative max-w-2xl mx-auto mt-20 px-4">
        <div className="bg-[#FFF9F1] rounded-3xl border border-[#EADBCC] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Search Header */}
          <div className="p-4 sm:p-6 border-b border-[#EADBCC] flex items-center gap-3">
            <Search className="w-5 h-5 text-[#F47735] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search banana chips, tapioca, murukku, mixture..."
              className="flex-1 bg-transparent text-[#281411] placeholder:text-[#A89088] font-bold text-lg sm:text-xl outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-[#735C57] hover:text-[#281411] p-1 text-xs"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F7EFE6] text-[#281411] hover:bg-[#EADBCC] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-[#F47735]">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : query.trim() && results.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-display font-bold text-lg text-[#281411]">No snacks found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-[#735C57] mt-1">Try searching for &quot;Banana&quot;, &quot;Tapioca&quot;, &quot;Murukku&quot;, or &quot;Mixture&quot;.</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#A89088]">
                  Matching Products ({results.length})
                </p>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] hover:border-[#F47735] hover:shadow-md transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#F7EFE6] relative overflow-hidden shrink-0 border border-[#EADBCC]">
                      {product.main_image ? (
                        <Image
                          src={product.main_image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <span className="font-display font-bold text-xs text-[#F47735] flex items-center justify-center h-full">OF</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#281411] group-hover:text-[#F47735] truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#735C57] truncate">{product.category?.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-sm text-[#281411]">
                        ₹{Number(product.min_price || 80).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[#A89088] block">Starting</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#A89088] group-hover:text-[#F47735] group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#A89088] mb-3">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Banana Chips',
                    'Nendran Coconut Oil',
                    'Spicy Mixture',
                    'Tapioca Crisps',
                    'Butter Murukku',
                    'Jackfruit Chips',
                    'Tea Rusks',
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#EADBCC] hover:border-[#F47735] text-xs font-bold text-[#281411] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
