'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ProductDetail() {
  const params = useParams();
  // params가 제대로 왔는지 콘솔에 찍어봅니다.
  console.log("현재 params 전체:", params); 

  // params.id 가 없으면 params['id']로도 시도해 봅니다.
  const id = params?.id;
  
  const [product, setProduct] = useState<any>(null);
  const [status, setStatus] = useState('초기화 중...'); // 현재 상태 표시용
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setStatus('URL에서 ID를 찾을 수 없습니다.');
        return;
      }
      
      try {
        setStatus(`데이터 조회 시작... (ID: ${id})`);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("Supabase 상세 에러:", error);
          setErrorMsg(error.message);
          setStatus('데이터를 가져오는 중 에러 발생');
        } else if (!data) {
          setStatus('해당 ID의 제품이 DB에 없습니다.');
        } else {
          setProduct(data);
          setStatus('완료');
        }
      } catch (e: any) {
        console.error("시스템 에러:", e);
        setErrorMsg(e.message);
        setStatus('시스템 에러 발생');
      }
    };

    fetchProduct();
  }, [id]);

  if (status !== '완료') {
    return (
      <div className="p-20 text-center">
        <p className="text-xl font-bold">{status}</p>
        {errorMsg && <p className="text-red-500 mt-4">에러 내용: {errorMsg}</p>}
        <Link href="/" className="mt-8 inline-block text-blue-500 underline">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-8 block">← 목록으로 돌아가기</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">이미지 준비중</div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl font-bold text-blue-600 mb-6">{product.price?.toLocaleString()}원</p>
          <div className="border-t pt-6 text-gray-600">{product.description}</div>
        </div>
      </div>
    </main>
  );
}