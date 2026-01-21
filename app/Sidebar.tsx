'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Sidebar() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('level', 1)
        .order('id');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    // 화면 크기에 따라 너비가 능동적으로 변하도록 수정
    <aside className="w-full md:w-64 lg:w-72 xl:w-80 flex-shrink-0">
      <div className="bg-blue-700 text-white font-bold p-4 rounded-t-lg shadow-sm">
        제품 카테고리
      </div>
      <ul className="bg-white border border-t-0 border-gray-200 rounded-b-lg shadow-sm overflow-hidden">
        {categories.map((cat) => (
          <li key={cat.id} className="border-b last:border-0 hover:bg-blue-50 transition">
            {/* break-keep: 한글 단어가 중간에 잘리지 않고 깔끔하게 줄바꿈 되도록 설정 */}
            <Link href={`/category/${cat.id}`} className="block p-4 text-sm font-medium text-gray-800 break-keep leading-relaxed">
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}