'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import 'react-quill-new/dist/quill.snow.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter(); 
  const [product, setProduct] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single();
      if (prod) {
        setProduct(prod);
        const { data: mat } = await supabase.from('materials').select('*').eq('product_id', id);
        if (mat) setMaterials(mat);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // ★ 수정된 제품 삭제 함수
  const handleDelete = async () => {
    if (!confirm('정말로 이 제품을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
      return;
    }

    // 1. 자료실 파일 연결 기록 삭제 (기존)
    await supabase.from('materials').delete().eq('product_id', id);

    // 2. ★ 새로 추가됨: 추천 상품(featured_products)에 등록된 기록 먼저 삭제
    await supabase.from('featured_products').delete().eq('product_id', id);

    // 3. 마지막으로 제품 데이터 안전하게 삭제
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert('제품 삭제에 실패했습니다: ' + error.message);
    } else {
      alert('제품이 성공적으로 삭제되었습니다.');
      router.push(`/category/${product.category_id}`);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">데이터를 불러오는 중입니다...</div>;
  if (!product) return <div className="p-10 text-center font-bold text-red-500">제품을 찾을 수 없습니다.</div>;

  const materialTypes = ['카탈로그', '사용설명서', '도면'];

  const renderSpecifications = () => {
    if (product.specifications?.html) {
      return product.specifications.html;
    } else if (product.specifications && Object.keys(product.specifications).length > 0) {
      let html = '<table border="1" style="border-collapse: collapse; width: 100%;"><tbody>';
      Object.entries(product.specifications).forEach(([k, v]) => {
        html += `<tr><td style="background-color: #f9fafb; padding: 10px; font-weight: bold; width: 30%; border: 1px solid #d1d5db;">${k}</td><td style="padding: 10px; border: 1px solid #d1d5db;">${v}</td></tr>`;
      });
      html += '</tbody></table>';
      return html;
    }
    return '<p>상세 스펙 내용이 없습니다.</p>';
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        <div className="w-full lg:w-1/2">
          <div className="aspect-[4/3] bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-8">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="object-contain w-full h-full" />
            ) : <span className="text-gray-400 text-sm">이미지 준비중</span>}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4 gap-4">
            <h1 className="text-4xl font-black text-gray-900 break-keep">{product.title}</h1>
            
            <div className="flex gap-2 flex-shrink-0">
              <Link href={`/admin/edit/${product.id}`} className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-700 transition">
                ⚙️ 수정
              </Link>
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 transition shadow-sm">
                🗑️ 삭제
              </button>
            </div>
          </div>
          
          <div className="mb-8 ql-snow">
            <div className="ql-editor px-0 text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description || '<p>상세 설명이 없습니다.</p>' }} />
          </div>

          <Link href="/quote" className="w-full bg-blue-700 text-white text-center py-4 rounded font-bold hover:bg-blue-800 mb-4 shadow-md transition">견적 의뢰하기</Link>
          
          <div className="grid grid-cols-3 gap-2">
            {materialTypes.map(type => {
              const mat = materials.find(m => m.file_type === type);
              return mat ? (
                <a key={type} href={mat.file_url} target="_blank" className="bg-white border-2 border-blue-600 text-blue-600 text-center py-3 rounded text-sm font-bold hover:bg-blue-50">{type} 다운로드</a>
              ) : <button key={type} disabled className="bg-gray-50 border-2 border-gray-200 text-gray-400 py-3 rounded text-sm font-bold cursor-not-allowed">{type} 없음</button>
            })}
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold border-b-2 border-blue-700 pb-3 mb-6">Specifications</h2>
        <div className="ql-snow">
          <div 
            className="ql-editor px-0 text-lg text-gray-800" 
            dangerouslySetInnerHTML={{ __html: renderSpecifications() }} 
          />
        </div>
      </section>
    </div>
  );
}