'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('products')
      .insert([{ title, description, price: Number(price) }]);

    if (error) {
      alert('등록 실패: ' + error.message);
    } else {
      alert('제품이 등록되었습니다!');
      setTitle('');
      setDescription('');
      setPrice('');
    }
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">새 제품 등록 (관리자)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">제품명</label>
          <input 
            className="w-full border p-2 rounded" 
            value={title} onChange={(e) => setTitle(e.target.value)} required 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">설명</label>
          <textarea 
            className="w-full border p-2 rounded" 
            value={description} onChange={(e) => setDescription(e.target.value)} 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">가격</label>
          <input 
            type="number" className="w-full border p-2 rounded" 
            value={price} onChange={(e) => setPrice(e.target.value)} required 
          />
        </div>
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? '등록 중...' : '제품 등록하기'}
        </button>
      </form>
    </main>
  );
}