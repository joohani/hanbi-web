'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false, 
  loading: () => <p className="text-gray-400 p-4 border rounded bg-gray-50">에디터를 불러오는 중입니다...</p> 
});

export default function ProductEditPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [currentImageUrl, setCurrentImageUrl] = useState(''); 
  const [newImageFile, setNewImageFile] = useState<File | null>(null); 
  const [price, setPrice] = useState(0);
  
  // ★ 스펙 에디터 상태
  const [specHtml, setSpecHtml] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      
      if (data) {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCurrentImageUrl(data.image_url || ''); 
        setPrice(data.price || 0);

        // ★ 기존 JSON 데이터를 HTML 표 형식으로 자동 변환하여 에디터에 넣어줌
        if (data.specifications) {
          if (data.specifications.html) {
            setSpecHtml(data.specifications.html);
          } else {
            // 과거 데이터(항목/내용)를 예쁜 HTML 표로 변환
            let html = '<table border="1" style="border-collapse: collapse; width: 100%;"><tbody>';
            Object.entries(data.specifications).forEach(([k, v]) => {
              html += `<tr><td style="background-color: #f9fafb; padding: 10px; font-weight: bold; width: 30%; border: 1px solid #d1d5db;">${k}</td><td style="padding: 10px; border: 1px solid #d1d5db;">${v}</td></tr>`;
            });
            html += '</tbody></table>';
            setSpecHtml(html);
          }
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let finalImageUrl = currentImageUrl; 

    if (newImageFile) {
      const fileExt = newImageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, newImageFile);
      if (uploadError) { alert('새 이미지 업로드 실패: ' + uploadError.message); setSaving(false); return; }
      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName);
      finalImageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('products').update({
      title, 
      description, 
      image_url: finalImageUrl, 
      price, 
      // ★ HTML 포맷으로 업데이트
      specifications: { html: specHtml }
    }).eq('id', id);

    if (error) alert('수정 실패: ' + error.message);
    else { alert('성공적으로 수정되었습니다!'); router.push(`/products/${id}`); }
    setSaving(false);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-500">제품 정보를 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      <nav className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold">⚙️ 제품 수정 모드</div>
          <Link href={`/products/${id}`} className="text-sm bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">취소하고 돌아가기</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-10">
        <form onSubmit={handleUpdateSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">제품명</label>
            <input className="w-full border p-3 rounded mb-6" value={title} onChange={e => setTitle(e.target.value)} required />
            
            <label className="block text-sm font-bold text-gray-700 mb-2">상세 설명 (웹 에디터)</label>
            <div className="mb-6 bg-white">
              <ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} className="h-64 mb-12" />
            </div>

            <label className="block text-sm font-bold text-gray-700 mb-2 mt-8">대표 썸네일 이미지</label>
            <div className="p-4 border rounded bg-gray-50 mb-4">
              {currentImageUrl ? (
                <div className="mb-4">
                  <span className="text-xs font-bold text-gray-500 mb-2 inline-block">현재 등록된 이미지:</span>
                  <img src={currentImageUrl} alt="Current Thumbnail" className="h-32 object-contain bg-white border p-2 rounded" />
                </div>
              ) : <p className="text-sm text-gray-500 mb-4">현재 등록된 이미지가 없습니다.</p>}
              <span className="text-xs font-bold text-blue-600 mb-2 inline-block">변경할 이미지 첨부 (선택):</span>
              <input type="file" accept="image/*" className="w-full border p-2 rounded bg-white" onChange={e => setNewImageFile(e.target.files ? e.target.files[0] : null)} />
            </div>
          </div>

          {/* ★ 스펙 에디터 영역 */}
          <div className="space-y-4 pt-6 border-t border-gray-200 mt-8">
            <h2 className="text-lg font-bold text-gray-800 mb-2">상세 스펙 (웹 에디터)</h2>
            <p className="text-xs text-gray-500 mb-4">💡 엑셀에서 표를 복사해서 붙여넣으시면 그대로 적용됩니다.</p>
            <div className="mb-6 bg-white">
              <ReactQuill theme="snow" value={specHtml} onChange={setSpecHtml} modules={quillModules} className="h-64 mb-12" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-blue-700 text-white font-bold py-4 rounded-lg hover:bg-blue-800 text-lg shadow-md transition">
            {saving ? '수정 사항 저장 중...' : '수정 내용 저장하기'}
          </button>
        </form>
      </main>
    </div>
  );
}