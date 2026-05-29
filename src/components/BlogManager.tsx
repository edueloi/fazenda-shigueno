import React from 'react';
import { 
  Plus, Trash2, Edit, Save, PlusCircle, Check, X, FileText, 
  Tag, Users, Settings, Newspaper, Image, Link, Eye, Calendar, EyeOff, AlertCircle
} from 'lucide-react';

interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category_id: number;
  author_id: number;
  status: string;
  views: number;
  published_at: string;
  is_featured: boolean;
  tags: string;
}

interface BlogCategory {
  id?: number;
  name: string;
  description: string;
}

interface BlogAuthor {
  id?: number;
  name: string;
  role: string;
  bio: string;
  instagram: string;
  avatar_url: string;
}

interface BlogManagerProps {
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  onSettingsUpdate?: () => void;
}

const PRESET_UNSPLASH_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=800&auto=format&fit=crop&q=80', label: 'Laranjas no Galho (Citros)' },
  { url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&auto=format&fit=crop&q=80', label: 'Ovos Brancos e Castanhos (Postura)' },
  { url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80', label: 'Nelore no Pasto (Gado)' },
  { url: 'https://images.unsplash.com/photo-1447078806655-40579c2520d6?w=800&auto=format&fit=crop&q=80', label: 'Colheita Agrícola (Geral)' },
  { url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80', label: 'Solo e Nutrição (Café)' }
];

export default function BlogManager({ authFetch, onSettingsUpdate }: BlogManagerProps) {
  const [activeSegment, setActiveSegment] = React.useState<'posts' | 'categories' | 'authors' | 'config'>('posts');
  
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [categories, setCategories] = React.useState<BlogCategory[]>([]);
  const [authors, setAuthors] = React.useState<BlogAuthor[]>([]);
  const [showBlogOnMenuSetting, setShowBlogOnMenuSetting] = React.useState<boolean>(true);
  
  const [loading, setLoading] = React.useState<boolean>(true);
  const [toastSuccess, setToastSuccess] = React.useState<string | null>(null);
  const [toastError, setToastError] = React.useState<string | null>(null);

  // Forms state
  const [postFormOpen, setPostFormOpen] = React.useState<boolean>(false);
  const [editingPostId, setEditingPostId] = React.useState<number | null>(null);
  const [postTitle, setPostTitle] = React.useState<string>('');
  const [postSlug, setPostSlug] = React.useState<string>('');
  const [postExcerpt, setPostExcerpt] = React.useState<string>('');
  const [postContent, setPostContent] = React.useState<string>('');
  const [postImageUrl, setPostImageUrl] = React.useState<string>('');
  const [postCategoryId, setPostCategoryId] = React.useState<number>(1);
  const [postAuthorId, setPostAuthorId] = React.useState<number>(1);
  const [postStatus, setPostStatus] = React.useState<string>('Publicado');
  const [postPublishedAt, setPostPublishedAt] = React.useState<string>('');
  const [postIsFeatured, setPostIsFeatured] = React.useState<boolean>(false);
  const [postTags, setPostTags] = React.useState<string>('');

  // Category template forms
  const [catFormOpen, setCatFormOpen] = React.useState<boolean>(false);
  const [editingCatId, setEditingCatId] = React.useState<number | null>(null);
  const [catName, setCatName] = React.useState<string>('');
  const [catDesc, setCatDesc] = React.useState<string>('');

  // Author template forms
  const [authorFormOpen, setAuthorFormOpen] = React.useState<boolean>(false);
  const [editingAuthorId, setEditingAuthorId] = React.useState<number | null>(null);
  const [authName, setAuthName] = React.useState<string>('');
  const [authRole, setAuthRole] = React.useState<string>('');
  const [authBio, setAuthBio] = React.useState<string>('');
  const [authInstagram, setAuthInstagram] = React.useState<string>('');
  const [authAvatarUrl, setAuthAvatarUrl] = React.useState<string>('');

  React.useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes, aRes, sRes] = await Promise.all([
        fetch('/api/blog/posts'),
        fetch('/api/blog/categories'),
        fetch('/api/blog/authors'),
        fetch('/api/site-settings')
      ]);

      const [pData, cData, aData, sData] = await Promise.all([
        pRes.json(),
        cRes.json(),
        aRes.json(),
        sRes.json()
      ]);

      if (pData.success) setPosts(pData.posts || []);
      if (cData.success) setCategories(cData.categories || []);
      if (aData.success) setAuthors(aData.authors || []);
      if (sData.success && sData.config) {
        setShowBlogOnMenuSetting(sData.config.show_blog_on_menu !== 'false');
      }
    } catch (e) {
      triggerError('Falha ao reverter base de posts do blog.');
    } finally {
      setLoading(false);
    }
  };

  const triggerSuccess = (msg: string) => {
    setToastSuccess(msg);
    setTimeout(() => setToastSuccess(null), 3500);
  };

  const triggerError = (msg: string) => {
    setToastError(msg);
    setTimeout(() => setToastError(null), 4000);
  };

  // Convert Title to slug dynamically
  const handleTitleChange = (val: string) => {
    setPostTitle(val);
    if (!editingPostId) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-0\s-]/g, '') // remove special chars
        .replace(/[\s_]+/g, '-') // replace spaces
        .replace(/-+/g, '-'); // replace double hyphens
      setPostSlug(generatedSlug);
    }
  };

  // POSTS CRUD actions
  const handleOpenNewPost = () => {
    setEditingPostId(null);
    setPostTitle('');
    setPostSlug('');
    setPostExcerpt('');
    setPostContent('');
    setPostImageUrl(PRESET_UNSPLASH_IMAGES[0].url);
    setPostCategoryId(categories[0]?.id || 1);
    setPostAuthorId(authors[0]?.id || 1);
    setPostStatus('Publicado');
    
    // Set default local time string for datetime-local
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setPostPublishedAt(now.toISOString().slice(0, 16));
    
    setPostIsFeatured(false);
    setPostTags('');
    setPostFormOpen(true);
  };

  const handleOpenEditPost = (post: BlogPost) => {
    setEditingPostId(post.id || null);
    setPostTitle(post.title);
    setPostSlug(post.slug);
    setPostExcerpt(post.excerpt);
    setPostContent(post.content);
    setPostImageUrl(post.image_url);
    setPostCategoryId(post.category_id);
    setPostAuthorId(post.author_id);
    setPostStatus(post.status);
    
    // Format ISO to datetime-local
    const d = new Date(post.published_at);
    if (!isNaN(d.getTime())) {
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setPostPublishedAt(d.toISOString().slice(0, 16));
    } else {
      setPostPublishedAt('');
    }
    
    setPostIsFeatured(post.is_featured);
    setPostTags(post.tags || '');
    setPostFormOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const postPayload: BlogPost = {
        title: postTitle,
        slug: postSlug || postTitle.toLowerCase().replace(/\s+/g, '-'),
        excerpt: postExcerpt,
        content: postContent,
        image_url: postImageUrl,
        category_id: Number(postCategoryId),
        author_id: Number(postAuthorId),
        status: postStatus,
        views: editingPostId ? (posts.find(p => p.id === editingPostId)?.views || 0) : 0,
        published_at: postPublishedAt ? new Date(postPublishedAt).toISOString() : new Date().toISOString(),
        is_featured: postIsFeatured,
        tags: postTags
      };

      if (editingPostId) {
        postPayload.id = editingPostId;
      }

      // Enforce auth headers
      const res = await authFetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload)
      });

      const data = await res.json();
      if (data.success) {
        triggerSuccess('Postagem gravada no banco de dados SQLite com sucesso!');
        setPostFormOpen(false);
        loadAllData();
      } else {
        triggerError(data.error || 'Erro ao persistir postagem.');
      }
    } catch (err: any) {
      triggerError(err.message || 'Erro de conexão de rede.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir este artigo? Esta ação é irreversível.')) return;
    try {
      setLoading(true);
      const res = await authFetch(`/api/blog/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Artigo excluído do catálogo.');
        loadAllData();
      } else {
        triggerError('Erro ao deletar postagem.');
      }
    } catch (e) {
      triggerError('Falha ao comunicar exclusão.');
    } finally {
      setLoading(false);
    }
  };

  // CATEGORIES CRUD Actions
  const handleOpenNewCat = () => {
    setEditingCatId(null);
    setCatName('');
    setCatDesc('');
    setCatFormOpen(true);
  };

  const handleOpenEditCat = (cat: BlogCategory) => {
    setEditingCatId(cat.id || null);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setCatFormOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload: BlogCategory = { name: catName, description: catDesc };
      if (editingCatId) payload.id = editingCatId;

      const res = await authFetch('/api/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Categoria gravada com sucesso!');
        setCatFormOpen(false);
        loadAllData();
      } else {
        triggerError('Erro de processamento da Categoria.');
      }
    } catch (err) {
      triggerError('Erro de rede.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Tem certeza? Postagens associadas a esta categoria perderão o vínculo.')) return;
    try {
      setLoading(true);
      const res = await authFetch(`/api/blog/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Categoria removida.');
        loadAllData();
      } else {
        triggerError('Erro ao exvluir categoria.');
      }
    } catch (e) {
      triggerError('Erro de comunicação.');
    } finally {
      setLoading(false);
    }
  };

  // AUTHORS CRUD Actions
  const handleOpenNewAuthor = () => {
    setEditingAuthorId(null);
    setAuthName('');
    setAuthRole('');
    setAuthBio('');
    setAuthInstagram('');
    setAuthAvatarUrl('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
    setAuthorFormOpen(true);
  };

  const handleOpenEditAuthor = (author: BlogAuthor) => {
    setEditingAuthorId(author.id || null);
    setAuthName(author.name);
    setAuthRole(author.role);
    setAuthBio(author.bio);
    setAuthInstagram(author.instagram);
    setAuthAvatarUrl(author.avatar_url);
    setAuthorFormOpen(true);
  };

  const handleSaveAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload: BlogAuthor = {
        name: authName,
        role: authRole,
        bio: authBio,
        instagram: authInstagram,
        avatar_url: authAvatarUrl
      };
      if (editingAuthorId) payload.id = editingAuthorId;

      const res = await authFetch('/api/blog/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Perfil do autor gravado com sucesso!');
        setAuthorFormOpen(false);
        loadAllData();
      } else {
        triggerError('Falha ao salvar autor.');
      }
    } catch (err) {
      triggerError('Erro de rede.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuthor = async (id: number) => {
    if (!window.confirm('Tem certeza? Artigos vinculados a este perfil continuarão existindo sem autor.')) return;
    try {
      setLoading(true);
      const res = await authFetch(`/api/blog/authors/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Perfil de autor excluído.');
        loadAllData();
      } else {
        triggerError('Veto na exclusão.');
      }
    } catch (e) {
      triggerError('Erro de comunicação.');
    } finally {
      setLoading(false);
    }
  };

  // MENU VISIBILITY MANAGEMENT (que ele define se menu ira aparecer ou nao)
  const handleSaveMenuSetting = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          show_blog_on_menu: String(showBlogOnMenuSetting)
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Configuração de menu atualizada com sucesso!');
        if (typeof onSettingsUpdate === 'function') {
          onSettingsUpdate();
        }
      } else {
        triggerError('Veto ao gravar preferências.');
      }
    } catch (err) {
      triggerError('Erro ao comunicar nova regra de menu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 shadow-sm">
      
      {/* Toast notifications */}
      {toastSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white font-bold p-4.5 rounded-xl shadow-lg flex items-center space-x-3 text-xs animate-in slide-in-from-bottom border border-emerald-600">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastSuccess}</span>
        </div>
      )}
      {toastError && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-800 text-white font-bold p-4.5 rounded-xl shadow-lg flex items-center space-x-3 text-xs animate-in slide-in-from-bottom border border-red-650">
          <AlertCircle className="w-4 h-4 text-red-300" />
          <span>{toastError}</span>
        </div>
      )}

      {/* Title */}
      <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">Gerenciador de Artigos e Editorial</h2>
          <p className="text-xs text-slate-500 font-medium select-none">
            Organize a distribuição de postagens do blog, defina visibilidades, controle agendamentos e configure o menu principal do site.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {activeSegment === 'posts' && (
            <button
              onClick={handleOpenNewPost}
              className="px-4.5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl flex items-center space-x-2 shadow-sm uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Escrever Artigo</span>
            </button>
          )}
          {activeSegment === 'categories' && (
            <button
              onClick={handleOpenNewCat}
              className="px-4.5 py-2.5 bg-emerald-850 hover:bg-emerald-950 text-white font-black text-xs rounded-xl flex items-center space-x-2 shadow-sm uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Categoria</span>
            </button>
          )}
          {activeSegment === 'authors' && (
            <button
              onClick={handleOpenNewAuthor}
              className="px-4.5 py-2.5 bg-emerald-850 hover:bg-emerald-950 text-white font-black text-xs rounded-xl flex items-center space-x-2 shadow-sm uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Autor</span>
            </button>
          )}
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
        {[
          { key: 'posts', label: '📰 Artigos Escritos', icon: Newspaper },
          { key: 'categories', label: '🏷️ Categorias do Blog', icon: Tag },
          { key: 'authors', label: '✍️ Perfis de Co-autores', icon: Users },
          { key: 'config', label: '⚙️ Visibilidade no Menu', icon: Settings }
        ].map((item) => {
          const active = activeSegment === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActiveSegment(item.key as any)}
              className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                active 
                  ? 'border-emerald-700 text-emerald-800 font-extrabold bg-emerald-50/20' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {loading && posts.length === 0 ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 rounded-full border-4 border-emerald-800/20 border-t-emerald-800 animate-spin mb-4" />
          <p className="text-xs text-slate-500 font-semibold font-mono tracking-wide">Acessando banco SQLite...</p>
        </div>
      ) : (
        <>
          {/* SEGMENT 1: POSTS TABLE */}
          {activeSegment === 'posts' && (
            <div className="overflow-x-auto border border-slate-150 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-150 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    <th className="py-4 px-6 text-center w-12 font-mono">ID</th>
                    <th className="py-4 px-4">Artigo / Título</th>
                    <th className="py-4 px-4">Categoria</th>
                    <th className="py-4 px-4">Modo/Status</th>
                    <th className="py-4 px-4">Programação / Publicação</th>
                    <th className="py-4 px-4 text-center">Views</th>
                    <th className="py-4 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                        Nenhum artigo escrito cadastrado. Clique em "Escrever Artigo" para começar.
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => {
                      const cat = categories.find(c => Number(c.id) === Number(post.category_id));
                      
                      const isFuture = new Date(post.published_at) > new Date();
                      const statusMessage = post.status === 'Publicado' 
                        ? (isFuture ? 'Agendado ⏰' : 'Publicado 🟢') 
                        : 'Rascunho ⚪';

                      return (
                        <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-6 text-center font-mono font-bold text-slate-400">{post.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3 max-w-sm">
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-100 shrink-0 select-none">
                                <img src={post.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="truncate">
                                <p className="font-extrabold text-slate-800 truncate">{post.title}</p>
                                <p className="text-[10px] text-slate-400 font-mono truncate">{post.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-600">
                            {cat ? cat.name : <span className="text-red-500">Sem categoria (ID: {post.category_id})</span>}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                              post.status === 'Rascunho' 
                                ? 'bg-slate-100 text-slate-700' 
                                : (isFuture ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800')
                            }`}>
                              {statusMessage}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-650">
                            {new Date(post.published_at).toLocaleString('pt-BR')}
                            {isFuture && (
                              <span className="block text-[9px] text-amber-600 font-mono mt-0.5">Programado em lote futuro</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">{post.views || 0}</td>
                          <td className="py-3 px-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleOpenEditPost(post)}
                                className="p-1 px-2 border border-slate-200 rounded-md hover:bg-slate-100 font-semibold flex items-center text-[10px] text-slate-600 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5 mr-1" />
                                <span>Editar</span>
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id!)}
                                className="p-1 px-2 border border-red-200 rounded-md hover:bg-red-50 font-semibold flex items-center text-[10px] text-red-650 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                <span>Excluir</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* SEGMENT 2: CATEGORIES LIST */}
          {activeSegment === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.length === 0 ? (
                <div className="col-span-full py-10 text-center text-slate-400">
                  Nenhuma categoria cadastrada.
                </div>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-150 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase">
                          ID: {cat.id}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleOpenEditCat(cat)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-555 cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id!)}
                            className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-extrabold text-slate-950 text-sm mb-1">{cat.name}</h4>
                      <p className="text-xs text-slate-550 leading-relaxed">{cat.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SEGMENT 3: AUTHORS LIST */}
          {activeSegment === 'authors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authors.length === 0 ? (
                <div className="col-span-full py-10 text-center text-slate-400">
                  Nenhum autor cadastrado.
                </div>
              ) : (
                authors.map((author) => (
                  <div key={author.id} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-150 flex flex-col justify-between">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 select-none">
                        <img src={author.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 truncate">
                        <h4 className="font-extrabold text-slate-900 text-sm leading-none truncate">{author.name}</h4>
                        <p className="text-[10px] text-emerald-800 font-semibold mt-1 leading-none">{author.role}</p>
                        {author.instagram && <p className="text-[10px] text-slate-400 font-mono leading-relaxed mt-1.5 truncate">{author.instagram}</p>}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 italic">"{author.bio}"</p>
                      <div className="pt-3 border-t border-slate-150 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">AUTOR #{author.id}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenEditAuthor(author)}
                            className="px-2 py-1 text-[10px] font-bold border border-slate-200 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteAuthor(author.id!)}
                            className="px-2 py-1 text-[10px] font-bold border border-red-250 rounded hover:bg-red-50 text-red-600 cursor-pointer"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SEGMENT 4: GENERAL CONFIG */}
          {activeSegment === 'config' && (
            <div className="max-w-2xl bg-slate-50/50 border border-slate-150 rounded-2xl p-6">
              <h3 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center">
                <Settings className="w-5 h-5 mr-1.5 text-emerald-800" />
                <span>Visualização do Menu de Navegação</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                O site da Granja Shigueno exibe um link rápido "Blog" na barra de cabeçalho principal e rodapé. Caso deseje ocultar a aba temporariamente para manutenção de posts, desmarque a opção abaixo e grave as regras no SQLite.
              </p>

              <div className="space-y-6">
                <label className="flex items-center space-x-3.5 bg-white p-4.5 rounded-xl border border-slate-150 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={showBlogOnMenuSetting}
                    onChange={(e) => setShowBlogOnMenuSetting(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 block">Exibir link do Blog no menu principal do site</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">Se ativado, "Blog" aparecerá ao lado de "Nossa Produção".</span>
                  </div>
                </label>

                <div className="pt-4 border-t border-slate-150 flex justify-end">
                  <button
                    onClick={handleSaveMenuSetting}
                    disabled={loading}
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm cursor-pointer"
                  >
                    Gravar Preferências de Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- MODAL DIALOGS --- */}
      
      {/* 2. POST FORM MODAL OVERLAY */}
      {postFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-y-0 inset-x-0 bg-slate-950/50 backdrop-blur-xs" onClick={() => setPostFormOpen(false)} />
          
          <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl border border-slate-150 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {editingPostId ? '✏️ Editar Artigo Existente' : '✍️ Escrever Novo Artigo'}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-0.5">Operações registradas no SQLite corporativo</p>
              </div>
              <button onClick={() => setPostFormOpen(false)} className="p-1.5 hover:bg-slate-205 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSavePost} className="p-6 space-y-5 flex-1 overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-full">
                  <label className="text-xs font-bold text-slate-700">Título do Artigo</label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs"
                    placeholder="Ex: Como a Adubação Orgânica de Postura Revolucionou Pomares"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Caminho da URL (Slug)</label>
                  <input
                    type="text"
                    required
                    value={postSlug}
                    onChange={(e) => setPostSlug(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs font-mono font-bold text-slate-600 bg-slate-50"
                    placeholder="url-no-blog"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tags do Artigo (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs placeholder-slate-400"
                    placeholder="laranja, adubação, tatuí, citros"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Excert / Resumo Explicativo (única linha, aparece no card)</label>
                <input
                  type="text"
                  required
                  value={postExcerpt}
                  onChange={(e) => setPostExcerpt(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs placeholder-slate-400"
                  placeholder="Resumo que prende a atenção do produtor..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Conteúdo do Artigo (Aceita quebra de parágrafo. Comece um subtítulo com '### ')</label>
                <textarea
                  rows={8}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-210 rounded-xl text-xs font-medium leading-relaxed"
                  placeholder="Escreva os parágrafos de contextualização..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Categoria Reguladora</label>
                  <select
                    value={postCategoryId}
                    onChange={(e) => setPostCategoryId(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Autor do Trabalho</label>
                  <select
                    value={postAuthorId}
                    onChange={(e) => setPostAuthorId(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs bg-white"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Status de Divulgação</label>
                  <select
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs bg-white"
                  >
                    <option value="Publicado">Publicado 🟢</option>
                    <option value="Rascunho">Rascunho ⚪</option>
                  </select>
                </div>

                {/* PUBLISHED AT DATE - Schedulable post (posso programar tbm uma postagem) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Data de Publicação / Agendamento futuro</label>
                  <input
                    type="datetime-local"
                    required
                    value={postPublishedAt}
                    onChange={(e) => setPostPublishedAt(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs font-mono"
                  />
                  <span className="block text-[10px] text-slate-400 leading-snug">
                    Selecione uma data no futuro para **agendar** o post. Ele ficará oculto para visitantes comuns até a data correspondente.
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Imagem de Destaque - Unsplash URL ou Outra</label>
                <input
                  type="text"
                  required
                  value={postImageUrl}
                  onChange={(e) => setPostImageUrl(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs font-mono"
                  placeholder="https://images.unsplash.com/..."
                />
                
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Presets Sugeridos:</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_UNSPLASH_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPostImageUrl(img.url)}
                        className={`px-2 py-1 text-[10px] rounded border transition-all ${
                          postImageUrl === img.url 
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-extrabold' 
                            : 'border-slate-200 hover:bg-slate-100 text-slate-500'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={postIsFeatured}
                    onChange={(e) => setPostIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800">Sinalizar como Destaque principal do Blog</span>
                    <span className="block text-[10px] text-slate-400">Posts destacados podem ter banners prioritários na busca.</span>
                  </div>
                </label>
              </div>

              {/* Actions footer */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setPostFormOpen(false)}
                  className="px-4.5 py-2.5 border border-slate-250 rounded-xl text-xs font-bold text-slate-550 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm"
                >
                  Confirmar Gravidade no SQLite
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 3. CATEGORY MODAL */}
      {catFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setCatFormOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-150 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {editingCatId ? '✏️ Editar Categoria' : '🏷️ Adicionar Categoria'}
              </h3>
              <button onClick={() => setCatFormOpen(false)} className="p-1 text-slate-450 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nome da Categoria</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs"
                  placeholder="Ex: Avicultura Alternativa"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Descrição / Foco Temático</label>
                <textarea
                  rows={3}
                  required
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs leading-relaxed"
                  placeholder="Explique o viés temático desta categoria..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCatFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. AUTHOR MODAL */}
      {authorFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setAuthorFormOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-150 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {editingAuthorId ? '✏️ Editar Co-autor' : '✍️ Adicionar Autor Editorial'}
              </h3>
              <button onClick={() => setAuthorFormOpen(false)} className="p-1 text-slate-450 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAuthor} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nome Oficial</label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs"
                  placeholder="Ex: Dra. Marta Shigueno"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Cargo / Cargo Institucional</label>
                <input
                  type="text"
                  required
                  value={authRole}
                  onChange={(e) => setAuthRole(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs"
                  placeholder="Ex: Diretora de Sanidade Aviária"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Bio Acadêmica ou Curriculo Rápido (máx. 3 linhas)</label>
                <textarea
                  rows={3}
                  required
                  value={authBio}
                  onChange={(e) => setAuthBio(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs leading-relaxed"
                  placeholder="Fale brevemente do histórico profissional..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Link Social / Instagram</label>
                <input
                  type="text"
                  value={authInstagram}
                  onChange={(e) => setAuthInstagram(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs"
                  placeholder="@diretoria_shigueno"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Avatar Image URL (Unsplash ou outra)</label>
                <input
                  type="text"
                  required
                  value={authAvatarUrl}
                  onChange={(e) => setAuthAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs font-mono"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAuthorFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
