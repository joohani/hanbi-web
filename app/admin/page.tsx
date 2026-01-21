'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// 서버 사이드 렌더링 에러 방지를 위한 동적 임포트
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false, 
  loading: () => <p className="text-gray-400 p-4 border rounded bg-gray-50">에디터를 불러오는 중입니다...</p> 
});

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'product' | 'featured' | 'material'>('product');
  const [loading, setLoading] = useState(false);

  // --- 데이터 상태 ---
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [featuredList, setFeaturedList] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);

  // --- [1. 제품 등록용 상태] ---
  const [level1Id, setLevel1Id] = useState<string>('');
  const [level2Id, setLevel2Id] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [specHtml, setSpecHtml] = useState('');

  // --- [2. 추천 상품 관리용 상태] ---
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [groupNum, setGroupNum] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<number>(1);

  // --- [3. 자료실 관리용 상태] ---
  const [matLevel1Id, setMatLevel1Id] = useState<string>('');
  const [matLevel2Id, setMatLevel2Id] = useState<string>('');
  const [matProductId, setMatProductId] = useState<string>('');
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState('카탈로그');
  const [matFile, setMatFile] = useState<File | null>(null);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      const { data: catData } = await supabase.from('categories').select('*').order('id');
      if (catData) setCategories(catData);
      
      const { data: prodData } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (prodData) setProducts(prodData);

      fetchFeaturedList();
      fetchMaterials();
    };
    fetchData();
  }, [activeTab]);

  const fetchFeaturedList = async () => {
    const { data } = await supabase.from('featured_products').select('*, products(title)').order('group_num').order('sort_order');
    if (data) setFeaturedList(data);
  };

  const fetchMaterials = async () => {
    const { data } = await supabase.from('materials').select('*, products(title)').order('created_at', { ascending: false });
    if (data) setMaterials(data);
  };

  // --- [로직 1: 제품 등록] ---
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!level2Id) return alert('중분류를 선택해주세요!');
    setLoading(true);

    let uploadedImageUrl = ''; 
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, imageFile);
      if (uploadError) {
        alert('이미지 업로드 실패: ' + uploadError.message);
        setLoading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName);
      uploadedImageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase.from('products').insert([{
      category_id: Number(level2Id), 
      title, 
      description,
      image_url: uploadedImageUrl,
      specifications: { html: specHtml } 
    }]).select();

    if (error) {
      alert('등록 실패: ' + error.message);
    } else {
      alert(`[${title}] 등록 성공! 상세 페이지로 이동합니다.`);
      router.push(`/products/${data[0].id}`);
    }
    setLoading(false);
  };

  // --- [로직 2: 추천 상품 관리] ---
  const handleFeaturedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return alert('제품을 선택해주세요!');
    setLoading(true);
    const { error } = await supabase.from('featured_products').insert([{ 
      product_id: Number(selectedProductId), 
      group_num: groupNum, 
      sort_order: sortOrder 
    }]);
    if (error) alert('등록 실패: ' + error.message);
    else { alert('추천 상품으로 등록되었습니다.'); fetchFeaturedList(); }
    setLoading(false);
  };

  const handleDeleteFeatured = async (id: number) => {
    if (!confirm('추천 목록에서 삭제하시겠습니까?')) return;
    await supabase.from('featured_products').delete().eq('id', id);
    fetchFeaturedList();
  };

  // --- [로직 3: 자료실 관리] ---
  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matFile) return alert('파일을 선택해주세요!');
    setLoading(true);

    const fileExt = matFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('materials').upload(fileName, matFile);
    if (uploadError) { alert('파일 업로드 실패: ' + uploadError.message); setLoading(false); return; }

    const { data: publicUrlData } = supabase.storage.from('materials').getPublicUrl(fileName);
    const { error: dbError } = await supabase.from('materials').insert([{
      title: matTitle, 
      file_type: matType, 
      file_url: publicUrlData.publicUrl,
      product_id: matProductId ? Number(matProductId) : null 
    }]);

    if (dbError) alert('DB 등록 실패: ' + dbError.message);
    else {
      alert('자료 등록 성공!');
      setMatTitle(''); setMatFile(null); fetchMaterials();
    }
    setLoading(false);
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('자료를 삭제하시겠습니까?')) return;
    await supabase.from('materials').delete().eq('id', id);
    fetchMaterials();
  };

  const quillModules = {
    toolbar: [[{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike'], [{ color: [] }, { background: [] }], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'image', 'video'], ['clean']],
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      <nav className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold flex items-center gap-2"><span>⚙️</span> HANBI 관리자</div>
          <Link href="/" className="text-sm bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">홈페이지로</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-10">
        {/* 탭 메뉴 */}
        <div className="flex mb-6 border-b-2 border-gray-200 overflow-x-auto">
          <button onClick={() => setActiveTab('product')} className={`px-8 py-3 text-lg font-bold whitespace-nowrap transition-colors ${activeTab === 'product' ? 'bg-blue-600 text-white rounded-t-lg' : 'text-gray-500 hover:text-blue-600'}`}>1. 새 제품 등록</button>
          <button onClick={() => setActiveTab('featured')} className={`px-8 py-3 text-lg font-bold whitespace-nowrap transition-colors ${activeTab === 'featured' ? 'bg-blue-600 text-white rounded-t-lg' : 'text-gray-500 hover:text-blue-600'}`}>2. 메인 추천상품 관리</button>
          <button onClick={() => setActiveTab('material')} className={`px-8 py-3 text-lg font-bold whitespace-nowrap transition-colors ${activeTab === 'material' ? 'bg-blue-600 text-white rounded-t-lg' : 'text-gray-500 hover:text-blue-600'}`}>3. 자료실 관리</button>
        </div>

        <div className="bg-white p-8 rounded-b-lg rounded-tr-lg shadow-sm border border-gray-200">
          
          {/* [1. 제품 등록 탭] */}
          {activeTab === 'product' && (
            <form onSubmit={handleProductSubmit} className="space-y-8">
              <h2 className="text-xl font-bold border-b pb-2 mb-4">새 제품 추가</h2>
              <div className="grid grid-cols-2 gap-4">
                <select className="border p-3 rounded bg-white" value={level1Id} onChange={(e) => { setLevel1Id(e.target.value); setLevel2Id(''); }} required>
                  <option value="">1. 대분류 선택</option>
                  {categories.filter(c => c.level === 1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="border p-3 rounded bg-white" value={level2Id} onChange={(e) => setLevel2Id(e.target.value)} disabled={!level1Id} required>
                  <option value="">2. 중분류 선택 (필수)</option>
                  {categories.filter(c => c.level === 2 && c.parent_id === Number(level1Id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">제품명</label>
                <input className="w-full border p-3 rounded mb-6" value={title} onChange={e => setTitle(e.target.value)} required />
                <label className="block text-sm font-bold text-gray-700 mb-2">상세 설명</label>
                <div className="mb-6 bg-white"><ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} className="h-64 mb-12" /></div>
                <label className="block text-sm font-bold text-gray-700 mb-2 mt-8">대표 썸네일 첨부</label>
                <input type="file" accept="image/*" className="w-full border p-2 rounded bg-white" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
              </div>
              <div className="space-y-4 pt-6 border-t border-gray-200 mt-8">
                <h2 className="text-lg font-bold text-gray-800 mb-2">상세 스펙 (웹 에디터)</h2>
                <div className="mb-6 bg-white"><ReactQuill theme="snow" value={specHtml} onChange={setSpecHtml} modules={quillModules} className="h-64 mb-12" /></div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white font-bold py-4 rounded-lg hover:bg-blue-800 text-lg shadow-md transition">{loading ? '등록 중...' : '제품 DB에 등록하기'}</button>
            </form>
          )}

          {/* [2. 추천 상품 관리 탭] - 복구됨 */}
          {activeTab === 'featured' && (
            <div className="space-y-8">
              <form onSubmit={handleFeaturedSubmit} className="bg-gray-50 p-6 rounded border space-y-4">
                <h3 className="font-bold text-lg mb-2">메인 추천 상품 추가</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select className="border p-3 rounded bg-white" value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} required>
                    <option value="">제품 선택</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                  <input type="number" placeholder="그룹번호" className="border p-3 rounded" value={groupNum} onChange={e => setGroupNum(Number(e.target.value))} required />
                  <input type="number" placeholder="순서" className="border p-3 rounded" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition">추천 상품으로 등록</button>
              </form>
              <div>
                <h3 className="font-bold text-lg mb-4 border-b pb-2">현재 추천 상품 목록</h3>
                <ul className="space-y-2">
                  {featuredList.map(item => (
                    <li key={item.id} className="flex justify-between bg-white border p-4 rounded hover:border-blue-400">
                      <div className="flex items-center gap-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">그룹 {item.group_num}</span>
                        <span className="font-bold">{item.products?.title}</span>
                      </div>
                      <button onClick={() => handleDeleteFeatured(item.id)} className="text-red-500 font-bold hover:text-red-700">삭제 (X)</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* [3. 자료실 관리 탭] - 복구됨 */}
          {activeTab === 'material' && (
            <div className="space-y-8">
              <form onSubmit={handleMaterialSubmit} className="bg-blue-50 p-6 rounded-lg border border-blue-100 space-y-4">
                <h3 className="font-bold text-lg mb-2 text-blue-900">새 자료 업로드</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded border">
                  <select className="border p-2 rounded text-sm" value={matLevel1Id} onChange={e => { setMatLevel1Id(e.target.value); setMatLevel2Id(''); }}>
                    <option value="">대분류 선택 (공통 자료)</option>
                    {categories.filter(c => c.level === 1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select className="border p-2 rounded text-sm" value={matLevel2Id} onChange={e => setMatLevel2Id(e.target.value)} disabled={!matLevel1Id}>
                    <option value="">중분류 선택</option>
                    {categories.filter(c => c.level === 2 && c.parent_id === Number(matLevel1Id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select className="border p-2 rounded text-sm" value={matProductId} onChange={e => setMatProductId(e.target.value)} disabled={!matLevel2Id}>
                    <option value="">제품 선택 (전체 적용)</option>
                    {products.filter(p => p.category_id === Number(matLevel2Id)).map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select className="border p-3 rounded bg-white" value={matType} onChange={e => setMatType(e.target.value)}>
                    <option value="카탈로그">카탈로그</option>
                    <option value="사용설명서">사용설명서</option>
                    <option value="도면">도면</option>
                    <option value="기타">기타</option>
                  </select>
                  <input className="border p-3 rounded" value={matTitle} onChange={e => setMatTitle(e.target.value)} placeholder="자료 제목" required />
                </div>
                <input type="file" className="w-full border p-2 rounded bg-white" onChange={e => setMatFile(e.target.files ? e.target.files[0] : null)} required />
                <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white font-bold py-3 rounded hover:bg-blue-800 transition">자료 등록</button>
              </form>
              <div>
                <h3 className="font-bold text-lg mb-4 border-b pb-2">등록된 자료 목록</h3>
                <ul className="space-y-2">
                  {materials.map(mat => (
                    <li key={mat.id} className="flex justify-between border p-4 rounded bg-white hover:border-blue-400">
                      <div className="flex items-center gap-4">
                        <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">{mat.file_type}</span>
                        <span className="font-bold">{mat.title}</span>
                      </div>
                      <button onClick={() => handleDeleteMaterial(mat.id)} className="text-red-500 font-bold hover:text-red-700">삭제 (X)</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}