'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [featuredGroups, setFeaturedGroups] = useState<Record<number, any[]>>({});
  const [currentGroup, setCurrentGroup] = useState(1);
  const [maxGroup, setMaxGroup] = useState(1);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase.from('featured_products').select('*, products(*)').order('sort_order');
      if (data && data.length > 0) {
        const groups: Record<number, any[]> = {};
        let maxNum = 1;
        data.forEach((item) => {
          if (!groups[item.group_num]) groups[item.group_num] = [];
          groups[item.group_num].push(item);
          if (item.group_num > maxNum) maxNum = item.group_num;
        });
        setFeaturedGroups(groups);
        setMaxGroup(maxNum);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (maxGroup <= 1) return;
    const timer = setInterval(() => setCurrentGroup(p => p >= maxGroup ? 1 : p + 1), 5000);
    return () => clearInterval(timer);
  }, [maxGroup]);

  return (
    <section className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-end border-b-2 border-gray-900 pb-3 mb-6">
        <h2 className="text-2xl font-black text-gray-900">Featured Products</h2>
        {maxGroup > 1 && (
          <div className="flex gap-1 mb-1">
            {Array.from({ length: maxGroup }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${currentGroup === i + 1 ? 'bg-blue-600 w-4' : 'bg-gray-300'} transition-all`} />
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredGroups[currentGroup]?.map((item) => (
          <Link key={item.id} href={`/products/${item.product_id}`} className="group">
            <div className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-blue-200">
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                {item.products?.image_url ? (
                  <img src={item.products.image_url} alt={item.products.title} className="object-contain w-full h-full" />
                ) : (
                  <span className="text-xs text-gray-400 font-medium text-center">이미지 준비중<br/>({item.products?.title})</span>
                )}
              </div>
              <div className="p-4 bg-white border-t border-gray-50">
                <h3 className="font-bold text-gray-800 text-sm truncate group-hover:text-blue-600">{item.products?.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}