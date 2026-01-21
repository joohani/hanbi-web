'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CategoryPage() {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!id) return;
      setLoading(true);

      // 1. 현재 카테고리 정보 가져오기 (level 확인을 위해 전체 필드 선택)
      const { data: currentCat } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (currentCat) {
        setCategoryName(currentCat.name);

        // 2. 카테고리 레벨에 따른 분기 처리
        if (currentCat.level === 1) {
          // [대분류인 경우] 기존 로직 유지: 하위 중분류와 그 제품들을 가져옴
          const { data: subCats } = await supabase
            .from('categories')
            .select('*')
            .eq('parent_id', id)
            .order('display_order', { ascending: true });
          
          if (subCats && subCats.length > 0) {
            setSubCategories(subCats);
            const subCatIds = subCats.map(c => c.id);
            const { data: prodData } = await supabase
              .from('products')
              .select('*')
              .in('category_id', subCatIds);
            if (prodData) setProducts(prodData);
          }
        } else {
          // [중분류인 경우] 본인(ID 15 등)을 리스트에 넣어 UI를 재사용하고, 본인 제품만 가져옴
          setSubCategories([currentCat]); 
          const { data: prodData } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', id);
          if (prodData) setProducts(prodData);
        }
      }
      setLoading(false);
    };

    fetchCategoryData();
  }, [id]);

  const stripHtml = (html: string) => {
    if (!html) return '제품 상세 설명을 확인하세요.';
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  };

  if (loading) return <div className="py-10 text-center text-gray-500 font-bold">데이터를 로드 중입니다...</div>;

  return (
    <div className="w-full">
      <div className="mb-10 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-3xl font-black text-gray-900 mb-2">{categoryName}</h1>
        <p className="text-gray-500">한비시스템이 제공하는 {categoryName}의 세부 라인업입니다.</p>
      </div>

      {subCategories.length > 0 ? (
        <div className="space-y-16">
          {subCategories.map((subCat) => {
            const subProducts = products.filter(p => p.category_id === subCat.id);

            return (
              <section key={subCat.id}>
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-600 inline-block rounded-sm"></span>
                  {subCat.name}
                </h2>
                
                {subProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {subProducts.map(product => (
                      <Link href={`/products/${product.id}`} key={product.id} className="group">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:border-blue-400 h-full flex flex-col">
                          <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.title} className="object-contain w-full h-full group-hover:scale-105 transition-transform" />
                            ) : (
                              <span className="text-gray-300 text-sm">이미지 준비중</span>
                            )}
                          </div>
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 mb-2">{product.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                              {stripHtml(product.description)}
                            </p>
                            <div className="mt-auto text-blue-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              자세히 보기 →
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 border border-dashed border-gray-200 rounded text-center text-gray-400 text-sm">
                    등록된 제품이 없습니다.
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-400 bg-white border border-gray-200 rounded-lg">
          등록된 제품 또는 하위 카테고리가 없습니다.
        </div>
      )}
    </div>
  );
}