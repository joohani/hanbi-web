'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      const { data } = await supabase.from('materials').select('*').order('created_at', { ascending: false });
      if (data) setMaterials(data);
      setLoading(false);
    };
    fetchMaterials();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* --- 상단 네비게이션 --- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-blue-700 tracking-tighter">HANBI</Link>
          <div className="hidden md:flex space-x-10 font-bold text-gray-700">
            <Link href="/about" className="hover:text-blue-600 transition">회사 소개</Link>
            <Link href="/quote" className="hover:text-blue-600 transition">견적의뢰</Link>
            <Link href="/materials" className="text-blue-600 transition">자료실</Link>
            <Link href="/as" className="hover:text-blue-600 transition">A/S의뢰</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-16">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-4">자료실</h1>
          <p className="text-gray-600">한비 제품의 카탈로그, 사용설명서, 도면 등을 다운로드할 수 있습니다.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
                <th className="p-4 font-bold text-center w-24">분류</th>
                <th className="p-4 font-bold">자료명</th>
                <th className="p-4 font-bold text-center w-32">등록일</th>
                <th className="p-4 font-bold text-center w-32">다운로드</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-bold">데이터를 불러오는 중입니다...</td></tr>
              ) : materials.length > 0 ? (
                materials.map((mat) => (
                  <tr key={mat.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 text-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                        {mat.file_type}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{mat.title}</td>
                    <td className="p-4 text-center text-sm text-gray-500">
                      {new Date(mat.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <a 
                        href={mat.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        ↓ 다운로드
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">등록된 자료가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}