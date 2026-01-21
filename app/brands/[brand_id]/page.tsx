'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// CSV 구조에 맞춘 인터페이스 정의
interface Brand {
  brand_id: number;
  brand_name: string;
  country: string;
  website_url: string;
  description: string;
}

interface Product {
  product_id: number;
  brand_id: number;
  model_name: string;
  spec_summary: string;
  description_text: string;
  // 가격 정보가 CSV에 없으므로 예시로 추가하거나 제외해야 함. 여기선 UI 유지를 위해 임의 처리
  price?: number; 
}

export default function BrandDetail() {
  const params = useParams();
  const brandId = params.brand_id; // URL에서 ID 추출

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandAndProducts = async () => {
      if (!brandId) return;

      try {
        setLoading(true);

        // 1. 브랜드 정보 조회
        const { data: brandData, error: brandError } = await supabase
          .from('brands')
          .select('*')
          .eq('brand_id', brandId) // CSV 컬럼명 기준
          .single();

        if (brandError) throw brandError;
        setBrand(brandData);

        // 2. 해당 브랜드의 제품 목록 조회
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('brand_id', brandId); // 외래키 기준 조회

        if (productError) throw productError;
        setProducts(productData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandAndProducts();
  }, [brandId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!brand) return <div className="min-h-screen flex items-center justify-center">Brand not found</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="border-b border-gray-100 h-20 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between">
            <Link href="/" className="text-2xl font-black tracking-tighter text-blue-600">HANBI</Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">← 메인으로 돌아가기</Link>
        </div>
      </nav>

      {/* 브랜드 헤더 */}
      <header className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
            <span className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-4 block">
                {brand.country} Brand
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">{brand.brand_name}</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">{brand.description}</p>
            {brand.website_url && (
                <a 
                  href={brand.website_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center text-blue-600 font-bold hover:underline"
                >
                    공식 웹사이트 방문 →
                </a>
            )}
        </div>
      </header>

      {/* 해당 브랜드 제품 리스트 */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-2xl font-bold mb-10 border-l-4 border-blue-600 pl-4">
            {brand.brand_name} Products
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product.product_id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition">
                        <div className="bg-gray-100 aspect-video flex items-center justify-center">
                            <span className="text-gray-400 font-medium">{product.model_name}</span>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{product.model_name}</h3>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                    {product.spec_summary.split('/')[0]} 
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                {product.description_text}
                            </p>
                            <div className="text-sm text-gray-400">
                                Spec: {product.spec_summary}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-10 text-center text-gray-400 bg-gray-50 rounded-xl">
                    이 브랜드에 등록된 제품이 아직 없습니다.
                </div>
            )}
        </div>
      </section>
    </div>
  );
}