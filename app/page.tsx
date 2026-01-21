'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // 만약 에러 나면 '../lib/supabase'로 수정
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error('Error:', error);
      else setProducts(data || []);
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b pb-6">
          <h1 className="text-2xl font-bold text-gray-800">HANBI (한비)</h1>
          <nav className="space-x-4 text-gray-600">
            <span className="cursor-pointer hover:text-blue-600">홈</span>
            <span className="cursor-pointer hover:text-blue-600">제품소개</span>
            <span className="cursor-pointer hover:text-blue-600">고객지원</span>
          </nav>
        </header>

        <section>
          <h2 className="text-xl font-semibold mb-6">주요 제품목록</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div key={product.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                      Image Placeholder
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{product.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                    <p className="mt-4 text-blue-600 font-bold">{product.price?.toLocaleString()}원</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">등록된 제품이 없습니다. Supabase에서 데이터를 추가해 보세요!</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}