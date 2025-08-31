"use client";
import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import Filter from '../components/Filter';
import ResultsGrid from '../components/ResultsGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function normalizeCategory(raw?: string | null) {
  if (!raw) return null;
  const r = raw.toLowerCase();
  const nonFashionKeywords = [
    'animal','animals','mammal','mammals','carnivore','herbivore','omnivore','wildlife','vertebrate',
    'tiger','lion','leopard','cheetah','dog','cat','bird','elephant','zebra','giraffe'
  ];
  if (nonFashionKeywords.some(k => r.includes(k))) return null;
  if (r.includes('shoe') || r.includes('sneaker') || r.includes('boot')) return 'Shoes';
  if (r.includes('jacket') || r.includes('coat') || r.includes('blazer')) return 'Jackets';
  if (r.includes('hoodie')) return 'Hoodies';
  if (r.includes('t-shirt') || r.includes('tee') || r.includes('shirt')) return 'T-Shirts';
  if (r.includes('jean') || r.includes('pant') || r.includes('chino') || r.includes('trouser')) return 'Pants';
  if (r.includes('dress')) return 'Dresses';
  if (r.includes('short')) return 'Shorts';
  if (r.includes('skirt')) return 'Skirts';
  if (r.includes('sweater') || r.includes('cardigan')) return 'Sweaters';
  return null;
}

function deriveGenericCategory(analysis: any): string | null {
  const tagNames: string[] = (analysis?.tags || []).map((t: any) => String(t?.name || '').toLowerCase());
  const catNames: string[] = (analysis?.categories || []).map((c: any) => String(c?.name || '').toLowerCase());
  const hay = [...catNames, ...tagNames].join(' ');
  const checks: Array<{ label: string; keys: string[] }> = [
    { label: 'Electronics', keys: ['smartphone','phone','mobile','laptop','computer','pc','monitor','keyboard','mouse','tablet','camera','headphone','earbuds','earphones','smartwatch'] },
    { label: 'Animal', keys: ['animal','wildlife','mammal','bird','fish','reptile','amphibian','insect','tiger','lion','dog','cat'] },
    { label: 'Vehicle', keys: ['car','vehicle','truck','bus','motorcycle','bike','bicycle','train','boat','ship','airplane'] },
    { label: 'Food', keys: ['food','fruit','vegetable','meal','drink','dessert','dish','cuisine'] },
    { label: 'Plant', keys: ['plant','tree','leaf','flower','forest','grass'] },
    { label: 'Building', keys: ['building','architecture','house','skyscraper','city','urban','interior','exterior'] },
    { label: 'Furniture', keys: ['furniture','sofa','chair','table','bed','desk','cabinet','couch'] },
    { label: 'Sports', keys: ['sport','ball','soccer','basketball','tennis','cricket','golf','baseball','hockey'] },
    { label: 'People', keys: ['person','people','man','woman','boy','girl','portrait'] },
    { label: 'Nature', keys: ['nature','landscape','mountain','river','sea','ocean','beach','sky','outdoors'] },
    { label: 'Artwork', keys: ['art','painting','drawing','illustration','sculpture'] },
    { label: 'Accessory', keys: ['bag','watch','sunglasses','hat','belt','jewelry','scarf'] },
  ];
  for (const c of checks) if (c.keys.some(k => hay.includes(k))) return c.label;
  return 'Other';
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [minScore, setMinScore] = useState(0.5);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const inferredColor = useMemo(() => {
    const azureColor = analysis?.color?.dominantColors?.[0];
    return azureColor ? azureColor : (dominantColor || null);
  }, [analysis, dominantColor]);

  const inferredCategory = useMemo(() => {
    const cat = analysis?.categories?.[0]?.name || analysis?.tags?.[0]?.name || null;
    const fashion = normalizeCategory(cat);
    if (fashion) return fashion;
    return deriveGenericCategory(analysis);
  }, [analysis]);

  const inferredName = useMemo(() => {
    const caption = analysis?.description?.captions?.[0]?.text;
    if (caption) return caption.charAt(0).toUpperCase() + caption.slice(1);
    const parts = [inferredColor, inferredCategory].filter(Boolean);
    return parts.join(' ') || 'Uploaded Item';
  }, [analysis, inferredColor, inferredCategory]);

  const handleAnalyze = async () => {
    if (!image) return;
    setError(null);
    setLoading(true);
    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analyze failed');
      setAnalysis(data.analysis);
      setAnalyzed(true);
    } catch (e: any) {
      setError(e.message || 'Analyze failed');
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!image) return;
    setLoading(true);
    setSearching(true);
    setSearched(false);
    setError(null);
    setResults([]);
    setSaveMessage(null);
    try {
      const enhancedData = analysis?.enhancedData;
      const keywords: string[] = [];
      const tags: string[] = enhancedData?.tags || analysis?.tags?.map((t: any) => t.name).slice(0, 10) || [];
      const brands: string[] = enhancedData?.brand ? [enhancedData.brand] : analysis?.brands?.map((b: any) => b.name) || [];
      const colors: string[] = enhancedData?.colors || analysis?.color?.dominantColors || [];
      const cats: string[] = enhancedData?.category ? [enhancedData.category] : analysis?.categories?.map((c: any) => c.name) || [];
      keywords.push(...tags, ...brands, ...cats);

      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          keywords,
          name: enhancedData?.name || inferredName,
          category: enhancedData?.category || inferredCategory,
          brand: enhancedData?.brand,
          colors: colors,
          limit: 20,
        }),
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setSearched(true);
      setSearching(false);
      setLoading(false);
    }
  };

  const saveToDb = async () => {
    if (!image) return;
    setError(null);
    setSaveMessage(null);
    try {
      const form = new FormData();
      const enhancedData = analysis?.enhancedData;
      const name = enhancedData?.name || inferredName;
      const category = enhancedData?.category || inferredCategory || 'Accessories';
      const brand = enhancedData?.brand || '';
      const description = enhancedData?.description || '';
      const colors = enhancedData?.colors || [];
      const tags = enhancedData?.tags || [];

      form.append('name', name);
      form.append('category', category);
      form.append('brand', brand);
      form.append('description', description);
      form.append('colors', colors.join(','));
      form.append('tags', tags.join(','));

      if (image.startsWith('http')) {
        form.append('imageUrl', image);
      } else if (imageFile) {
        form.append('imageFile', imageFile);
      } else {
        const resp = await fetch(image);
        const blob = await resp.blob();
        const file = new File([blob], 'upload.png', { type: blob.type || 'image/png' });
        form.append('imageFile', file);
      }

      const res = await fetch('/api/products', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setSaveMessage(`Saved as #${data.product._id}: ${data.product.name}`);
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    }
  };

  const filteredResults = results.filter(r => r.similarity >= minScore);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      {/* 🔥 New Background: colorful gradient + visible dots */}
      {/* 🔥 New Background: colorful gradient + darker dots */}
<div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
  <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 dark:from-indigo-900 dark:via-purple-900 dark:to-slate-900" />
  <div className="absolute inset-0 opacity-60 [mask-image:radial-gradient(transparent_0,black_70%)]">
    <div className="h-full w-full 
      bg-[radial-gradient(rgba(17,24,39,0.15)_1px,transparent_1.5px)] 
      bg-[length:18px_18px] 
      dark:bg-[radial-gradient(rgba(226,232,240,0.15)_1px,transparent_1.5px)]" 
    />
  </div>
</div>


      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6">
        <UploadForm
          image={image}
          setImage={setImage}
          setDominantColor={setDominantColor}
          setFile={setImageFile}
          analyzed={analyzed}
          inferredColor={inferredColor}
          inferredCategory={inferredCategory}
          inferredName={inferredName}
          onAnalyze={handleAnalyze}
          onSearch={handleSearch}
          onSave={saveToDb}
          analyzing={analyzing}
        />

        <div className="my-8">
          <Filter value={minScore} setValue={setMinScore} />
        </div>

        {loading && <LoadingSpinner />}

        {error && (
          <div className="my-4">
            <ErrorMessage message={error} />
          </div>
        )}

        {saveMessage && (
          <div className="my-4">
            <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg">
              <div className="rounded-[calc(theme(borderRadius.2xl)-2px)] border border-white/50 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-emerald-200">
                {saveMessage}
              </div>
            </div>
          </div>
        )}

        {!loading && searched && filteredResults.length === 0 && (
          <div className="my-6">
            <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-slate-300 via-indigo-300 to-cyan-300 shadow-lg">
              <div className="rounded-[calc(theme(borderRadius.2xl)-2px)] border border-white/50 bg-white/80 px-4 py-3 text-center text-sm font-medium text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
                No similar products found.
              </div>
            </div>
          </div>
        )}

        <ResultsGrid products={filteredResults} />
      </main>
    </div>
  );
}
