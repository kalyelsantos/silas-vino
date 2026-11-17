/* SILAS VINO · GitHub Pages + Supabase Auth. A configuração do site usa apenas a chave publicável. */
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const currency = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
  const dateTime = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const integer = new Intl.NumberFormat('pt-PT');
  const CATEGORIES = { tinto: 'Tintos', branco: 'Brancos', rose: 'Rosés', espumante: 'Espumantes', sobremesa: 'Sobremesa' };
  const WINE_TYPES = {
    tinto: {label: 'Tinto', color: '#78243c'},
    branco: {label: 'Branco', color: '#d7a64b'},
    rose: {label: 'Rosé', color: '#cf7d76'},
    espumante: {label: 'Espumante', color: '#bca79a'},
    sobremesa: {label: 'Sobremesa', color: '#66765f'}
  };
  const ACTIONS = { sale: 'Venda', refill: 'Repor frigorífico', return: 'Devolver ao armazém', receive: 'Nova entrada', loss: 'Quebra / perda', count: 'Contagem física' };
  const VIEW_TITLES = {
    painel: 'Gestão da garrafeira', inventario: 'Inventário', carta: 'Carta de vinhos',
    entradas: 'Entradas', saidas: 'Saídas', alertas: 'Notificações', movimentos: 'Histórico', reposicoes: 'Reposições', equipa: 'Definições'
  };
  const HISTORY_TYPES = {movimentos: Object.keys(ACTIONS), entradas: ['receive'], saidas: ['sale', 'loss'], reposicoes: ['refill']};
  const LOW_STOCK_MAX = 8;
  const ICONS = {
    home: '<path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    'arrow-in': '<path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5M3 12h13m-5-5 5 5-5 5"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"/>',
    snowflake: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M3.6 10.5l4.1-1.1-1.1-4.1m10.8 13.4-1.1-4.1 4.1-1.1M6.6 18.7l1.1-4.1-4.1-1.1m16.8-3-4.1-1.1 1.1-4.1"/>',
    bottles: '<path d="M5 3h3m-2.5 0v6l-2 2v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-9l-2-2V3M11 3h3m-2.5 0v6l-2 2v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-9l-2-2V3M17 3h3m-2.5 0v6l-2 2v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-9l-2-2V3"/>',
    chart: '<path d="M3 21h18M5 17V9h3v8m3 0V4h3v13m3 0V7h3v10"/>',
    pin: '<path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
    'arrow-right': '<path d="M3 12h17m-6-6 6 6-6 6"/>',
    bottle: '<path d="M10 3h4m-3 0v6l-3 3v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-8l-3-3V3M8 14h8m-8 4h8"/>',
    'book-open': '<path d="M12 7v14"/><path d="M3 18V4a1 1 0 0 1 1-1h5a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3H4a1 1 0 0 0-1 1z"/><path d="M21 18V4a1 1 0 0 0-1-1h-5a3 3 0 0 0-3 3v15a3 3 0 0 1 3-3h5a1 1 0 0 1 1 1z"/>',
    warehouse: '<path d="M3 10V6l9-4 9 4v4"/><rect x="3" y="10" width="18" height="12" rx="1"/><path d="M7 22v-8h10v8M7 17h10M12 14v8"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
    'log-out': '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6"/>',
    'refresh-cw': '<path d="M3 11a9 9 0 0 1 15.3-6.3L21 7M21 3v4h-4M21 13a9 9 0 0 1-15.3 6.3L3 17M3 21v-4h4"/>',
    'alert-triangle': '<path d="m10.3 3.8-8.4 14.5A2 2 0 0 0 3.6 21h16.8a2 2 0 0 0 1.7-2.7L13.7 3.8a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
    'search': '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'wine': '<path d="M8 21h8M12 15v6M4 3h16l-2 7a6 6 0 0 1-12 0zM5 7h14"/>',
    'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m8 12 2.5 2.5L16 9"/>',
    'circle-x': '<circle cx="12" cy="12" r="10"/><path d="m9 9 6 6m0-6-6 6"/>',
    'x': '<path d="M5 5l14 14M19 5 5 19"/>',
    'download': '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
    'filter': '<path d="M4 7h16M7 12h10M10 17h4"/>',
    'check': '<path d="m4 12 5 5L20 6"/>',
    'settings': '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .2.2 1.1.9-1.5 2.7-1.4-.5a8 8 0 0 1-1.7 1l-.3 1.5h-3l-.3-1.5a8 8 0 0 1-1.8-.8l-1.4.5L6 17.2l1-1.1a8 8 0 0 1-.1-2l-1.4-.7v-3l1.5-.3a8 8 0 0 1 .8-1.8l-.5-1.4L10 5.4l1.1 1a8 8 0 0 1 2-.1l.7-1.4h3l.3 1.5a8 8 0 0 1 1.8.8l1.4-.5 1.5 2.6-1 .9a8 8 0 0 1 .1 2l1.4.7v3z"/>',
    'info': '<circle cx="12" cy="12" r="10"/><path d="M12 10v6m0-9h.01"/>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  };
  function icon(n) { return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ICONS.info}</svg>`; }
  function hydrateIcons(root = document) { $$('[data-icon]', root).forEach(el => { el.innerHTML = icon(el.dataset.icon); }); }
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[-–—\s]+/g, ' ').trim();
  const euro = (c) => c == null ? 'Sob consulta' : currency.format(c / 100);
  const fmtTime = (s) => s ? dateTime.format(new Date(s)) : '—';
  const config = window.SILAS_CONFIG || {};
  const authKey = 'silas-vino-auth-v1';
  const accountDomain = 'garrafeira.silasvino.example';
  let storeInTab = null;
  let sb = null, realtime = null, syncScheduled = null, poll = null;
  let loadRevision = 0;

  const state = {
    ready:false, view:'painel', category:'all', region:'all', year:'all', search:'', availability:'all', menu:'all',
    movementSearch:'', movementType:'all', page:1, pageSize:24, busy:false,
    wines:[], movements:[], refillHistory:[], refillRequests:[], refillSyncFailed:false,
    profiles:[], user:null, profile:null, modal:null, lastSync:null
  };

  const authStorage = {
    getItem(key) {
      return sessionStorage.getItem(key) ?? localStorage.getItem(key);
    },
    setItem(key, value) {
      const temporary = storeInTab ?? (sessionStorage.getItem(authKey) !== null);
      const target = temporary ? sessionStorage : localStorage;
      const other = temporary ? localStorage : sessionStorage;
      target.setItem(key, value);
      other.removeItem(key);
    },
    removeItem(key) {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    }
  };

  const roleAdmin = () => state.profile?.role === 'admin';

  function showScreen(screen) {
    $('#loading-screen').classList.toggle('hidden',screen!=='loading');
    $('#auth-screen').classList.toggle('hidden',screen!=='auth');
    $('#pending-screen').classList.toggle('hidden',screen!=='pending');
    $('#shell').classList.toggle('hidden',screen!=='app');
    if (screen !== 'app') $('#options-menu').open = false;
  }
  function toast(message, type = 'ok') {
    const root = $('#toast-root');
    const node = document.createElement('div');
    node.className='toast'+(type==='ok'?'':` ${type}`);
    node.innerHTML=`${icon(type==='error'?'circle-x':type==='warning'?'alert-triangle':'circle-check')}<span>${esc(message)}</span><button type="button" aria-label="Fechar">${icon('x')}</button>`;
    root.appendChild(node);
    $('button',node).addEventListener('click',()=>node.remove());
    setTimeout(()=>node.remove(),5600);
  }
  function errorMessage(err) {
    let t = err?.message || String(err || 'Não foi possível concluir a operação.');
    if(/invalid login credentials/i.test(t)) return 'Utilizador ou palavra-passe incorretos.';
    if(/failed to fetch|network/i.test(t)) return 'Sem ligação à base de dados. Confirma a Internet e a configuração.';
    return t;
  }
  function showLoginError(message) {
    showScreen('auth');
    const box = $('#auth-error');
    box.textContent = message;
    box.classList.remove('hidden');
  }

  function resetSession() {
    clearRealtime();
    closeModal();
    Object.assign(state, {
      ready:false, busy:false, view:'painel', user:null, profile:null, wines:[], profiles:[], movements:[],
      refillHistory:[], refillRequests:[], refillSyncFailed:false,
      lastSync:null, search:'', category:'all', region:'all', year:'all', menu:'all',
      availability:'all', movementSearch:'', movementType:'all', page:1
    });
    $('#main').replaceChildren();
    $('#search-input').value = '';
    $('#account-name').textContent = '';
    $('#auth-error').classList.add('hidden');
    $('#auth-password').value = '';
    showScreen('auth');
  }

  async function start() {
    hydrateIcons();
    bindEvents();
    try {
      if (!config.supabaseUrl || !config.supabaseAnonKey) {
        throw new Error('Falta configurar a ligação ao Supabase.');
      }
      if (!window.supabase?.createClient) {
        throw new Error('Não foi possível carregar o serviço de login. Atualiza a página.');
      }
      sb = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: {persistSession:true, autoRefreshToken:true, detectSessionInUrl:false, storageKey:authKey, storage:authStorage}
      });
      sb.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') resetSession();
        if (event === 'SIGNED_IN' && state.user && session?.user && state.user.id !== session.user.id) {
          resetSession();
          // Ler a sessão depois de o callback libertar o bloqueio do cliente Auth.
          setTimeout(restoreSession, 0);
        }
      });
      await restoreSession();
    } catch (error) {
      showLoginError(errorMessage(error));
    }
  }

  async function restoreSession() {
    try {
      const {data, error} = await sb.auth.getSession();
      if (error) throw error;
      if (data.session?.user) await loadUser(data.session.user);
      else resetSession();
    } catch (error) {
      showLoginError(errorMessage(error));
    }
  }

  async function loadUser(user) {
    state.user = user;
    state.ready = false;
    showScreen('loading');
    try {
      const {data:profile, error} = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (state.user !== user) return;
      if (error) throw error;
      state.profile = profile;
      if (!profile?.approved) { showScreen('pending'); return; }
      await loadRemote({first:true});
      if (state.user !== user) return;
      updateChrome();
      render();
      showScreen('app');
      setupRealtime();
    } catch (error) {
      if (state.user === user) showLoginError('Erro ao carregar a conta. ' + errorMessage(error));
    }
  }
  async function loadRefillRequests() {
    const requests = [];
    const batchSize = 200;
    let after = 0;
    while (true) {
      const {data, error} = await sb.from('refill_requests')
        .select('sale_id,sale:stock_movements!refill_requests_sale_id_fkey(wine_id,quantity,actor_name,created_at)')
        .is('completed_at', null).gt('sale_id', after).order('sale_id', {ascending:true}).limit(batchSize);
      if (error) return {error};
      for (const {sale_id, sale} of data) {
        if (sale) requests.push({...sale, id:String(sale_id)});
      }
      if (data.length < batchSize) return {data:requests};
      after = data.at(-1).sale_id;
    }
  }

  async function loadRemote({first=false,silent=false}={}){
    const user = state.user;
    if (!user || !state.profile?.approved) return;
    const revision = ++loadRevision;
    const requests=[
      sb.from('wines').select('*').order('sort_order',{ascending:true}).order('name',{ascending:true}),
      sb.from('stock_movements').select('*').order('created_at',{ascending:false}).order('id',{ascending:false}).limit(400),
      roleAdmin()?sb.from('profiles').select('*').order('created_at',{ascending:false}):Promise.resolve({data:[],error:null}),
      sb.from('stock_movements').select('*').eq('movement_type','refill').order('created_at',{ascending:false}).order('id',{ascending:false}).limit(400),
      loadRefillRequests().catch(error => ({error}))
    ];
    const [wines, movements, profiles, refillHistory, refills] = await Promise.all(requests);
    if (state.user !== user || revision !== loadRevision) return;
    const failed = [wines, movements, profiles, refillHistory].find(result => result.error);
    if (failed) throw failed.error;
    state.wines = wines.data || [];
    state.movements = movements.data || [];
    state.profiles = profiles.data || [];
    state.refillHistory = refillHistory.data || [];
    state.refillSyncFailed = Boolean(refills.error);
    if (!refills.error) state.refillRequests = refills.data;
    state.ready=true;state.lastSync=new Date().toISOString();
    if(!first){render();updateChrome(); if(!silent)toast('Dados atualizados.');}
  }
  function setupRealtime(){
    clearRealtime();if(!state.ready||!sb)return;
    realtime=sb.channel('silas-stock-live')
      .on('postgres_changes',{event:'*',schema:'public',table:'wines'},()=>queueRefresh())
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'stock_movements'},()=>queueRefresh())
      .on('postgres_changes',{event:'*',schema:'public',table:'refill_requests'},()=>queueRefresh())
      .subscribe(status => { if (status === 'SUBSCRIBED') queueRefresh(); });
    poll = setInterval(() => { if (document.visibilityState === 'visible') queueRefresh(); }, 45000);
  }
  function clearRealtime(){if(syncScheduled)clearTimeout(syncScheduled);syncScheduled=null;if(poll)clearInterval(poll);poll=null;if(realtime&&sb)sb.removeChannel(realtime);realtime=null;}
  function queueRefresh() {
    if (syncScheduled || !state.ready) return;
    syncScheduled = setTimeout(() => {
      syncScheduled = null;
      if (state.busy) queueRefresh();
      else loadRemote({silent:true}).catch(() => updateChrome('offline'));
    }, 350);
  }
  function updateChrome(status) {
    const offline = status === 'offline';
    const con = $('#connection-label');
    con.textContent = offline ? 'Sem ligação' : 'Ligado';
    con.classList.toggle('is-offline', offline);
    const account = $('#account-name');
    account.textContent = state.profile?.display_name || 'Colaborador';
    account.classList.remove('hidden');
    $('#signout').classList.remove('hidden');
    $('#new-wine').classList.toggle('hidden', !roleAdmin());
    $('#last-sync').textContent = state.lastSync ? 'Sincronizado · ' + fmtTime(state.lastSync) : 'A aguardar sincronização';
    $('#last-sync').classList.remove('hidden');
    $$('.admin-only').forEach(el => el.classList.toggle('hidden', !roleAdmin()));
  }

  async function refresh() {
    if (!state.ready) return;
    try { await loadRemote(); }
    catch (error) { updateChrome('offline'); toast(errorMessage(error), 'error'); }
  }

  async function signout() {
    try {
      const {error} = await sb.auth.signOut({scope:'local'});
      if (error) throw error;
      if (state.user) resetSession();
    } catch (error) {
      toast(errorMessage(error), 'error');
    }
  }

  function getWine(id){return state.wines.find(w=>w.id===id);}
  function stockState(w){
    if(!w.fridge_verified_at)return {type:'unknown',label:'Por conferir',help:'Falta confirmar a quantidade no frigorífico.'};
    if(w.fridge_qty>0)return {type:'available',label:'Disponível',help:`${w.fridge_qty} garrafa(s) no frigorífico`};
    if(!w.storage_verified_at)return {type:'unknown',label:'Verificar armazém',help:'Frigorífico vazio; stock do armazém por conferir.'};
    if(w.storage_qty>0)return {type:'storage',label:'Repor do armazém',help:`${w.storage_qty} garrafa(s) no armazém`};
    return {type:'soldout',label:'Sem stock',help:'Não há garrafas registadas em nenhum local.'};
  }
  function statusPill(w) {
    const status = stockState(w);
    return `<span class="wine-status ${status.type}">${esc(status.label)}</span>`;
  }

  const activeWines = () => state.wines.filter(wine => !wine.archived);
  const isHistoryView = () => Object.hasOwn(HISTORY_TYPES, state.view);
  const defaultMenu = () => state.view === 'carta' ? 'menu' : 'all';
  const formatCount = quantity => quantity === null ? '—' : integer.format(quantity);
  const shortRegion = wine => wine.region?.trim() || 'Sem região';

  const STOCK_FILTERS = [
    ['all', 'Todas'], ['available', 'No frigorífico'], ['warehouse', 'No armazém'],
    ['low', 'Baixo stock'], ['storage', 'A repor'], ['soldout', 'Sem stock'], ['unknown', 'Por conferir']
  ];

  function stockAmounts(wine) {
    const fridge = wine.fridge_verified_at ? Number(wine.fridge_qty) : null;
    const storage = wine.storage_verified_at ? Number(wine.storage_qty) : null;
    return {fridge, storage, total: (fridge ?? 0) + (storage ?? 0), complete: fridge !== null && storage !== null};
  }

  function inventoryStatus(stock) {
    if (!stock.complete) return {kind: 'unknown', label: 'Por conferir'};
    if (stock.total === 0) return {kind: 'soldout', label: 'Sem stock'};
    if (stock.total <= LOW_STOCK_MAX) return {kind: 'low', label: 'Baixo stock'};
    if (stock.fridge === 0) return {kind: 'storage', label: 'A repor'};
    return {kind: 'available', label: 'Em stock'};
  }

  function summarizeStock() {
    const wines = activeWines();
    const types = Object.fromEntries(Object.keys(WINE_TYPES).map(category => [category, 0]));
    const alerts = [];
    let fridge = 0, storage = 0, fridgeCount = 0, storageCount = 0, pending = 0, low = 0;
    for (const wine of wines) {
      const stock = stockAmounts(wine);
      if (stock.fridge !== null) { fridge += stock.fridge; fridgeCount++; }
      if (stock.storage !== null) { storage += stock.storage; storageCount++; }
      if (!stock.complete) pending++;
      if (Object.hasOwn(types, wine.category)) types[wine.category] += stock.total;
      const {kind} = inventoryStatus(stock);
      if (kind === 'low') low++;
      if (['low', 'soldout', 'storage'].includes(kind)) alerts.push({wine, stock, kind});
    }
    const priority = {soldout: 0, low: 1, storage: 2};
    alerts.sort((a, b) => priority[a.kind] - priority[b.kind] || a.stock.total - b.stock.total || a.wine.name.localeCompare(b.wine.name, 'pt'));
    return {wines, fridge, storage, fridgeCount, storageCount, total: fridge + storage, pending, low, types, alerts};
  }

  function wineMatches(wine, query) {
    return norm([wine.name, wine.region, CATEGORIES[wine.category], wine.vintage_on_menu, wine.note].join(' ')).includes(query);
  }

  function filteredWines() {
    const query = norm(state.search.trim());
    return activeWines().filter(wine => {
      if (state.menu === 'menu' && !wine.menu || state.menu === 'extras' && wine.menu) return false;
      if (state.category !== 'all' && wine.category !== state.category) return false;
      if (state.region !== 'all' && shortRegion(wine) !== state.region) return false;
      if (state.year !== 'all' && String(wine.vintage_on_menu ?? 'unknown') !== state.year) return false;
      if (!wineMatches(wine, query)) return false;
      if (state.availability === 'all') return true;
      const stock = stockAmounts(wine);
      if (state.availability === 'low') return inventoryStatus(stock).kind === 'low';
      if (state.availability === 'available') return stock.fridge > 0;
      if (state.availability === 'warehouse') return stock.storage > 0;
      if (state.availability === 'unknown') return !stock.complete;
      return stockState(wine).type === state.availability;
    }).sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999) || a.name.localeCompare(b.name, 'pt'));
  }

  function selectField(id, label, options, current) {
    const items = options.map(([value, title]) => `<option value="${esc(value)}" ${current === value ? 'selected' : ''}>${esc(title)}</option>`);
    return `<label class="field filter-field">${label}<select id="${id}">${items.join('')}</select></label>`;
  }

  function filterCount() {
    if (isHistoryView()) return Number(state.movementType !== 'all');
    return [state.category, state.region, state.year, state.availability].filter(value => value !== 'all').length
      + Number(state.menu !== defaultMenu());
  }

  function operationButtons() {
    const adding = roleAdmin()
      ? `<button class="btn btn-primary" type="button" data-action="add">${icon('plus')} Adicionar vinho</button>
         <button class="btn btn-outline" type="button" data-action="pick-wine" data-move="receive">${icon('download')} Dar entrada</button>`
      : '';
    return `<div class="inventory-actions">${adding}
      <button class="btn btn-outline" type="button" data-action="pick-wine" data-move="sale">${icon('log-out')} Registar venda</button>
    </div>`;
  }

  function inventoryToolbar(actions=false) {
    const wines = activeWines();
    const regions = [...new Set(wines.map(shortRegion))].sort((a, b) => a.localeCompare(b, 'pt'));
    const years = [...new Set(wines.map(wine => wine.vintage_on_menu).filter(year => year != null))].sort((a, b) => b - a);
    const fields = [
      selectField('category-filter', 'Tipo', [['all', 'Todos os tipos'], ...Object.entries(CATEGORIES)], state.category),
      selectField('region-filter', 'Região', [['all', 'Todas as regiões'], ...regions.map(region => [region, region])], state.region),
      selectField('year-filter', 'Ano', [['all', 'Todos os anos'], ...years.map(year => [String(year), year]), ['unknown', 'Sem ano']], state.year),
      selectField('status-filter', 'Disponibilidade', STOCK_FILTERS, state.availability)
    ];
    if (state.view !== 'painel') fields.push(selectField('menu-filter', 'Carta', [['all', 'Todos os vinhos'], ['menu', 'Na carta'], ['extras', 'Fora da carta']], state.menu));
    return `<div class="inventory-toolbar">
      <button id="filters-toggle" class="btn btn-outline filter-button" type="button" aria-controls="filter-panel" aria-expanded="false">${icon('filter')} <span id="filters-label">Filtros</span></button>
      <div id="filter-panel" class="filter-panel" data-open="false">
        ${fields.join('')}
        <button id="clear-filters" class="text-button clear-filters" type="button" data-action="clear-filters" hidden>Limpar filtros</button>
      </div>
      ${actions ? operationButtons() : ''}
    </div>`;
  }

  function metricTile({title, value, note, symbol, theme, filter}) {
    return `<button class="metric-tile metric-${theme}" type="button" data-view="inventario" data-availability="${filter}">
      <span class="metric-icon">${icon(symbol)}</span>
      <span class="metric-content"><span class="metric-title">${title}</span>
        <strong class="metric-value">${formatCount(value)}</strong><span class="metric-note">${esc(note)}</span></span>
    </button>`;
  }

  function renderMetrics(stock) {
    const known = stock.fridgeCount > 0 || stock.storageCount > 0;
    return `<section class="metric-grid" aria-label="Resumo do stock">
      ${metricTile({title:'Total em stock', value:known ? stock.total : null,
        note:listCount(stock.wines.length, 'referência ativa', 'referências ativas'), symbol:'bottles', theme:'total', filter:'all'})}
      ${metricTile({title:'No frigorífico', value:stock.fridgeCount ? stock.fridge : null,
        note:'Garrafas conferidas', symbol:'snowflake', theme:'fridge', filter:'available'})}
      ${metricTile({title:'Baixo stock', value:stock.low, note:`Até ${LOW_STOCK_MAX} garrafas por vinho`,
        symbol:'alert-triangle', theme:'low', filter:'low'})}
      ${metricTile({title:'No armazém', value:stock.storageCount ? stock.storage : null,
        note:'Garrafas conferidas', symbol:'warehouse', theme:'storage', filter:'warehouse'})}
    </section>`;
  }

  function sectionHead(id, label, symbol, view=null, actionLabel='') {
    return `<div class="section-head"><h2 id="${id}">${icon(symbol)}<span>${label}</span></h2>
      ${view ? `<button type="button" class="section-link" data-view="${view}">${actionLabel} ${icon('arrow-right')}</button>` : ''}
    </div>`;
  }

  function statusBadge({kind, label}) {
    return `<span class="status-badge status-${kind}">${esc(label)}</span>`;
  }

  function wineTableRow(wine, view) {
    const stock = stockAmounts(wine);
    const summary = inventoryStatus(stock);
    const type = WINE_TYPES[wine.category]?.label || '—';
    const category = WINE_TYPES[wine.category] ? wine.category : 'generic';
    const fridgeState = stockState(wine);
    const name = esc(wine.name);
    const id = esc(wine.id);
    const region = esc(shortRegion(wine));
    const year = esc(wine.vintage_on_menu ?? '—');
    const total = stock.complete ? formatCount(stock.total) : stock.total > 0 ? `≥ ${formatCount(stock.total)}` : '—';
    const location = stock.fridge > 0 && stock.storage > 0 ? 'Frigorífico e armazém'
      : stock.fridge > 0 ? 'Frigorífico' : stock.storage > 0 ? 'Armazém' : '—';
    const caption = view === 'carta' ? euro(wine.price_cents)
      : view === 'inventario' ? `Frig. ${formatCount(stock.fridge)} · Arm. ${formatCount(stock.storage)}`
      : total === '—' ? total : `${total} ${stock.total === 1 ? 'garrafa' : 'garrafas'}`;
    const actions = {available:['sale', 'Vender'], storage:['refill', 'Repor'], soldout:['alternatives', 'Alternativas'], unknown:['count', 'Conferir']};
    const [action, actionLabel] = view === 'inventario' ? actions.unknown : actions[fridgeState.type];

    let counts;
    if (view === 'painel') counts = `<td class="table-count">${total}</td>
      <td class="table-location">${location === '—' ? location : `<span>${icon('pin')}${location}</span>`}</td>`;
    else if (view === 'inventario') counts = `<td class="table-count">${formatCount(stock.fridge)}</td><td class="table-count">${formatCount(stock.storage)}</td>`;
    else counts = `<td class="table-count">${esc(euro(wine.price_cents))}</td>`;

    return `<tr>
      <th scope="row" class="table-wine"><button type="button" class="wine-details" data-action="details" data-id="${id}">
        <span class="bottle-thumb type-${category}">${icon('bottle')}</span>
        <span class="wine-identity"><strong>${name}</strong><small>${region}${wine.menu ? '' : ' · Fora da carta'}${wine.volume_ml && wine.volume_ml !== 750 ? ` · ${esc(wine.volume_ml)} ml` : ''}</small><small class="compact-count">${esc(caption)}</small></span>
      </button></th>
      <td class="table-type"><span class="type-chip type-${category}">${esc(type)}</span></td>
      <td class="table-year">${year}</td>
      ${counts}
      <td class="table-status">${statusBadge(view === 'carta' ? {kind:fridgeState.type, label:fridgeState.label} : summary)}</td>
      <td class="table-action">${view === 'painel'
        ? `<button type="button" class="row-more" data-action="details" data-id="${id}" aria-label="Opções de ${name}">${icon('more')}</button>`
        : `<button type="button" class="btn btn-outline table-action-button" data-action="${action}" data-id="${id}" aria-label="${actionLabel} · ${name}">${actionLabel}</button>`}</td>
    </tr>`;
  }

  function wineTable(wines, view) {
    const extra = view === 'painel' ? '<th scope="col" class="table-count">Stock</th><th scope="col" class="table-location">Localização</th>'
      : view === 'inventario' ? '<th scope="col" class="table-count">Frigorífico</th><th scope="col" class="table-count">Armazém</th>'
      : '<th scope="col" class="table-count">Preço</th>';
    return `<table class="stock-table table-${view}" aria-label="${view === 'carta' ? 'Carta de vinhos' : 'Estado do inventário'}">
      <thead><tr><th scope="col" class="table-wine">Vinho</th><th scope="col" class="table-type">Tipo</th>
        <th scope="col" class="table-year">Ano</th>${extra}<th scope="col" class="table-status">Estado</th>
        <th scope="col" class="table-action"><span class="sr-only">Ações</span></th></tr></thead>
      <tbody>${wines.map(wine => wineTableRow(wine, view)).join('')}</tbody>
    </table>`;
  }

  function chartPanel(stock) {
    const known = stock.fridgeCount > 0 || stock.storageCount > 0;
    let offset = 0;
    const stops = [];
    const legend = Object.entries(WINE_TYPES).map(([category, {label, color}]) => {
      const value = stock.types[category];
      const share = stock.total ? value / stock.total * 100 : 0;
      if (value) {
        stops.push(`${color} ${offset}% ${offset + share}%`);
        offset += share;
      }
      return `<li><span class="legend-swatch" style="background:${color}" aria-hidden="true"></span>
        <span>${label}</span><strong>${known ? formatCount(value) : '—'}</strong><small>${stock.total ? `${Math.round(share)}%` : '—'}</small></li>`;
    }).join('');
    const fill = stops.length > 1 ? `conic-gradient(${stops.join(', ')})`
      : stops.length ? stops[0].split(' ')[0] : '#e9ddd3';
    return `<section class="dash-panel chart-panel" aria-labelledby="chart-title">
      ${sectionHead('chart-title', 'Stock por tipo', 'chart')}
      <div class="chart-content" data-total="${stock.total}">
        <div class="stock-donut" style="--chart-fill:${fill}" aria-hidden="true"><div class="donut-center">
          <strong>${formatCount(known ? stock.total : null)}</strong><span>Garrafas<br>conferidas</span>
        </div></div>
        <ul class="chart-legend" aria-label="Garrafas conferidas por tipo de vinho">${legend}</ul>
      </div>
    </section>`;
  }

  function alertList(alerts, preview=false) {
    if (!alerts.length) return `<p class="empty-list">${state.search.trim() && !preview ? 'Sem resultados para esta pesquisa.' : 'Sem alertas no stock conferido.'}</p>`;
    return `<ul class="stock-alerts">${alerts.map(({wine, stock, kind}) => `<li>
      <button type="button" class="stock-alert alert-${kind}" data-action="details" data-id="${esc(wine.id)}">
        ${icon('alert-triangle')}<span class="stock-alert-name"><strong>${esc(wine.name)}</strong><small>${esc(shortRegion(wine))}</small></span>
        <span class="stock-alert-amount">${kind === 'storage' ? 'A repor' : kind === 'soldout' ? 'Sem stock' : listCount(stock.total, 'garrafa', 'garrafas')}</span>
      </button>
    </li>`).join('')}</ul>`;
  }

  function pendingLink(stock) {
    return stock.pending ? `<button type="button" class="pending-link section-link" data-view="inventario" data-availability="unknown">${listCount(stock.pending, 'vinho por conferir', 'vinhos por conferir')} ${icon('arrow-right')}</button>` : '';
  }

  function renderDashboard(stock) {
    return `<section class="dashboard-view" aria-labelledby="section-title">
      ${renderMetrics(stock)}
      ${inventoryToolbar(true)}
      <section class="dash-panel inventory-preview" aria-labelledby="inventory-title">
        ${sectionHead('inventory-title', 'Estado do inventário', 'layers', 'inventario', 'Ver inventário')}
        <p id="result-count" class="result-count" role="status"></p>
        <div id="list-results"></div>
      </section>
      <div class="dashboard-bottom">
        <section class="dash-panel alert-panel" aria-labelledby="stock-alerts-title">
          ${sectionHead('stock-alerts-title', 'Alertas de stock', 'bell', 'alertas', 'Ver todos')}
          ${alertList(stock.alerts.slice(0, 3), true)}
          ${pendingLink(stock)}
        </section>
        ${chartPanel(stock)}
      </div>
    </section>`;
  }

  function refillList(requests) {
    if (!requests.length) return `<p class="empty-list">${state.search.trim() && state.view === 'alertas' ? 'Sem reposições para esta pesquisa.' : 'Sem reposições pendentes.'}</p>`;
    return `<ul class="refill-list">${requests.map(request => {
      const wine = getWine(request.wine_id);
      const name = wine?.name || request.wine_id;
      const quantity = listCount(request.quantity, 'garrafa', 'garrafas');
      const blocked = !wine || wine.archived ? 'Vinho arquivado'
        : !wine.storage_verified_at ? 'Armazém por conferir'
        : wine.storage_qty < request.quantity ? 'Stock insuficiente no armazém' : '';
      return `<li class="refill-row">
        <span class="refill-icon">${icon('snowflake')}</span>
        <div class="refill-copy">
          <button type="button" class="refill-wine" data-action="details" data-id="${esc(request.wine_id)}">${esc(name)}</button>
          <p>Repor ${quantity} · Venda de ${esc(request.actor_name)}</p>
          <time datetime="${esc(request.created_at)}">${esc(fmtTime(request.created_at))}</time>
          ${blocked ? `<p class="refill-warning">${blocked}</p>` : ''}
        </div>
        <button type="button" class="btn btn-outline refill-check" data-action="confirm-refill" data-id="${esc(request.id)}"
          aria-label="Confirmar reposição de ${quantity} de ${esc(name)}" ${blocked ? 'disabled' : ''}>${icon('check')} Reposto</button>
      </li>`;
    }).join('')}</ul>`;
  }

  function renderAlerts(stock) {
    return `<section class="notification-view" aria-labelledby="section-title">
      <section class="dash-panel" aria-labelledby="refill-title">
        ${sectionHead('refill-title', 'Reposições pendentes', 'snowflake', 'reposicoes', 'Histórico de reposições')}
        ${state.refillSyncFailed ? '<p class="refill-warning" role="status">Não foi possível atualizar as reposições.</p>' : ''}
        <div id="refill-results"></div>
      </section>
      <section class="dash-panel alert-panel" aria-labelledby="alert-title">
        ${sectionHead('alert-title', 'Alertas de stock', 'alert-triangle')}
        <div id="alert-results"></div>
        ${pendingLink(stock)}
      </section>
    </section>`;
  }

  function listCount(length, singular, plural) {
    return `${formatCount(length)} ${length === 1 ? singular : plural}`;
  }

  function resultColumns() {
    return `<div class="list-columns history-columns" aria-hidden="true">
      <div class="history-columns-main"><span class="history-name">Vinho</span><span class="history-operation">Operação</span><span class="history-time">Data e hora</span></div>
      <span class="history-quantity">Quantidade</span><span class="history-column-offset"></span>
    </div>`;
  }

  function updateResults() {
    if (state.view === 'alertas') {
      const query = norm(state.search.trim());
      const pending = state.refillRequests.filter(request => {
        const wine = getWine(request.wine_id);
        return norm(request.actor_name).includes(query) || (wine && wineMatches(wine, query));
      });
      $('#refill-results').innerHTML = pending.length || !state.refillSyncFailed ? refillList(pending) : '';
      $('#alert-results').innerHTML = alertList(summarizeStock().alerts.filter(({wine}) => wineMatches(wine, query)));
      return;
    }
    const result = $('#list-results');
    if (!result) return;
    const history = isHistoryView();
    const preview = state.view === 'painel';
    const end = state.page * state.pageSize;
    const list = history ? filteredMovements() : filteredWines();
    const query = (history ? state.movementSearch : state.search).trim();
    const filters = filterCount();
    const filtersLabel = $('#filters-label');
    const clear = $('#clear-filters');
    if (filtersLabel) filtersLabel.textContent = filters ? `Filtros (${filters})` : 'Filtros';
    if (clear) clear.hidden = filters === 0;

    const counter = $('#result-count');
    const count = history ? listCount(list.length, 'movimento', 'movimentos') : listCount(list.length, 'vinho', 'vinhos');
    counter.textContent = query || filters ? count : '';
    if (!list.length) {
      const empty = state.view === 'reposicoes' ? 'Ainda sem reposições.' : 'Ainda sem movimentos.';
      result.innerHTML = `<p class="empty-list">${history && !query && !filters ? empty : 'Sem resultados.'}</p>`;
      return;
    }

    if (preview && !query && !filters) {
      list.sort((a, b) => Number(Boolean(b.fridge_verified_at || b.storage_verified_at)) - Number(Boolean(a.fridge_verified_at || a.storage_verified_at)));
    }
    const visible = list.slice(0, preview ? 5 : end);
    const markup = history
      ? `<div class="results-panel">${resultColumns()}<ul class="movement-list">${visible.map(movementRow).join('')}</ul></div>`
      : wineTable(visible, state.view);
    result.innerHTML = markup + (!preview && end < list.length ? '<div class="pagination"><button class="btn btn-outline" type="button" data-action="more">Mostrar mais</button></div>' : '');
  }

  function renderHistoryToolbar() {
    const types = HISTORY_TYPES[state.view];
    const operations = types.length > 1
      ? selectField('movement-filter', 'Operação', [['all', 'Todas as operações'], ...types.map(type => [type, ACTIONS[type]])], state.movementType)
      : '';
    const links = Object.keys(HISTORY_TYPES).map(view => `<button type="button" class="history-tab" data-view="${view}" ${state.view === view ? 'aria-current="page"' : ''}>${VIEW_TITLES[view]}</button>`);
    const canReceive = state.view === 'entradas' && roleAdmin();
    const canSell = state.view === 'saidas';
    return `<div class="history-toolbar"><nav class="history-tabs" aria-label="Tipo de movimento">${links.join('')}</nav>
      ${operations}${canReceive || canSell
        ? `<button class="btn btn-primary" type="button" data-action="pick-wine" data-move="${canReceive ? 'receive' : 'sale'}">${icon(canReceive ? 'download' : 'log-out')} ${canReceive ? 'Dar entrada' : 'Registar venda'}</button>`
        : ''}
    </div>`;
  }

  function renderListView() {
    return `<section class="list-view" aria-labelledby="section-title">
      ${isHistoryView() ? renderHistoryToolbar() : inventoryToolbar(state.view === 'inventario')}
      <p id="result-count" class="result-count" role="status"></p>
      <div id="list-results" class="${isHistoryView() ? '' : 'dash-panel inventory-list'}"></div>
    </section>`;
  }

  function filteredMovements() {
    const types = HISTORY_TYPES[state.view];
    const query = norm(state.movementSearch.trim());
    const movements = state.view === 'reposicoes' ? state.refillHistory : state.movements;
    return movements.filter(movement => {
      if (!types.includes(movement.movement_type)) return false;
      if (state.movementType !== 'all' && movement.movement_type !== state.movementType) return false;
      return norm([getWine(movement.wine_id)?.name, movement.actor_name, movement.note, ACTIONS[movement.movement_type]].join(' ')).includes(query);
    });
  }

  function movementRow(m) {
    const name = esc(getWine(m.wine_id)?.name || m.wine_id);
    const action = esc(ACTIONS[m.movement_type] || m.movement_type);
    return `<li><details class="history-row"><summary>
      <span class="history-info"><span class="wine-name history-name">${name}</span><span class="wine-meta"><span class="history-operation">${action}</span><span class="history-time">${esc(fmtTime(m.created_at))}</span></span></span>
      <span class="history-quantity">${m.quantity} <span>un.</span></span>
    </summary><div class="history-details">
      ${m.actor_name ? `<p><b>Registado por</b> ${esc(m.actor_name)}</p>` : ''}
      ${m.note ? `<p><b>Nota</b> ${esc(m.note)}</p>` : ''}
      ${m.location ? `<p><b>Localização</b> ${m.location === 'storage' ? 'Armazém' : 'Frigorífico'}</p>` : ''}
      ${!m.actor_name && !m.note && !m.location ? '<p>Sem detalhes adicionais.</p>' : ''}
    </div></details></li>`;
  }

  function renderEquipa(){if(!roleAdmin())return renderListView();
    return `
      <div class="panel"><div class="panel-head"><div><h2>Colaboradores</h2><p>${state.profiles.length||1} contas visíveis</p></div></div><div class="panel-body" style="padding-top:5px">${state.profiles.map(p=>`<div class="team-row"><span class="avatar">${esc((p.display_name||'SV').slice(0,2).toUpperCase())}</span><div class="team-info"><strong>${esc(p.display_name)}</strong><small>${p.approved?'Acesso autorizado':'Aguarda aprovação'} ${p.id===state.profile.id?'· Esta conta':''}</small></div><span class="mini-pill ${p.approved?'ok':'warning'}">${p.approved?'Ativo':'Pendente'}</span><div class="team-row-actions">${p.id===state.profile.id?'<span class="muted" style="font-size:11px">Administrador atual</span>':`<select aria-label="Papel do colaborador" id="role-${esc(p.id)}"><option value="staff" ${p.role==='staff'?'selected':''}>Colaborador</option><option value="admin" ${p.role==='admin'?'selected':''}>Administrador</option></select><button class="btn btn-small ${p.approved?'btn-outline':'btn-primary'}" data-action="user-update" data-id="${esc(p.id)}" data-approved="${p.approved?'false':'true'}">${p.approved?'Suspender':'Aprovar'}</button><button class="btn btn-small btn-outline" data-action="user-role" data-id="${esc(p.id)}">Guardar papel</button>`}</div></div>`).join('')}</div></div>
      <div class="settings-block"><h3>Cópias de segurança</h3><p>Exporta um ficheiro com a carta, as quantidades e os movimentos disponíveis para esta conta. Guarda o ficheiro num local seguro.</p><div class="setting-buttons"><button class="btn btn-outline" data-action="backup">${icon('download')} Exportar cópia JSON</button><button class="btn btn-outline" data-action="export">${icon('file-text')} Inventário CSV</button></div></div>`;
  }
  function render() {
    if (!state.ready) return;
    const expandedFilters = $('#filters-toggle')?.getAttribute('aria-expanded') === 'true';
    const stock = summarizeStock();
    const search = $('#search-input');
    const history = isHistoryView();
    const prompt = history ? 'Pesquisar movimentos' : state.view === 'alertas' ? 'Pesquisar vinho ou colaborador' : 'Pesquisar vinho ou região';
    $('#section-title').textContent = VIEW_TITLES[state.view];
    $('#main-search').classList.toggle('hidden', state.view === 'equipa');
    search.placeholder = prompt + '…';
    search.setAttribute('aria-label', prompt);
    search.value = history ? state.movementSearch : state.search;

    const views = {painel: () => renderDashboard(stock), alertas: () => renderAlerts(stock), equipa: renderEquipa};
    $('#main').innerHTML = (views[state.view] || renderListView)();
    if (expandedFilters && $('#filters-toggle')) setFiltersOpen(true);
    updateResults();

    const pendingCount = state.refillRequests.length;
    const badge = pendingCount > 99 ? '99+' : formatCount(pendingCount);
    for (const count of $$('#sidebar-alert-count, #bell-refill-count')) {
      count.textContent = badge;
      count.hidden = pendingCount === 0;
    }
    $('#alert-bell').setAttribute('aria-label', pendingCount
      ? `Notificações · ${listCount(pendingCount, 'reposição pendente', 'reposições pendentes')}` : 'Notificações');
    $('#export-history').classList.toggle('hidden', !history);
    $$('#primary-nav [data-view], #mobile-nav [data-view], #alert-bell, .options-popover [data-view]').forEach(button => {
      const current = button.dataset.view === state.view
        || (button.closest('#mobile-nav') && button.dataset.view === 'movimentos' && history);
      if (current) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }

  function setFiltersOpen(open) {
    const button = $('#filters-toggle');
    if (!button) return;
    button.setAttribute('aria-expanded', String(open));
    $('#filter-panel').dataset.open = String(open);
  }

  function navTo(view, availability) {
    if (!state.ready || !Object.hasOwn(VIEW_TITLES, view)) return;
    if (view === 'equipa' && !roleAdmin()) return;
    $('#options-menu').open = false;
    if (state.modal) closeModal();
    if (view !== state.view || availability) {
      $('#main').focus({preventScroll: true});
      setFiltersOpen(false);
      if (view === 'alertas' || state.view === 'alertas') state.search = '';
      if (view === 'reposicoes') state.movementSearch = '';
      state.view = view;
      state.menu = defaultMenu();
      state.movementType = 'all';
      if (availability && STOCK_FILTERS.some(([option]) => option === availability)) {
        Object.assign(state, {category:'all', region:'all', year:'all', search:'', availability});
      }
      state.page = 1;
      render();
    }
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  // Modais de operação e administração.
  function openModal(title, subtitle, body, wide=false) {
    const root = $('#modal-root');
    const opener = state.modal?.opener || document.activeElement;
    root.classList.remove('hidden');
    root.setAttribute('aria-hidden', 'false');
    root.innerHTML = `<div class="modal ${wide ? 'large' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
      <div class="modal-header"><div><h2 id="modal-title">${esc(title)}</h2>${subtitle ? `<small>${esc(subtitle)}</small>` : ''}</div>
      <button class="modal-close" type="button" data-close-modal aria-label="Fechar">${icon('x')}</button></div>
      <div class="modal-body">${body}</div>
    </div>`;
    state.modal = {opener};
    $('#shell').inert = true;
    $('.modal', root).focus({preventScroll: true});
  }

  function closeModal() {
    if (!state.modal) return;
    const {opener} = state.modal;
    const root = $('#modal-root');
    root.classList.add('hidden');
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '';
    $('#shell').inert = false;
    state.modal = null;
    (opener?.isConnected ? opener : $('#main')).focus({preventScroll: true});
  }

  function stockBoxes(w, locations=['fridge', 'storage']) {
    const boxes = locations.map(location => {
      const label = location === 'fridge' ? 'Frigorífico' : 'Armazém';
      const quantity = w[location + '_verified_at'] ? w[location + '_qty'] : 'Por conferir';
      return `<div class="stock-box"><span>${label}</span><strong>${quantity}</strong></div>`;
    });
    return `<div class="modal-stock-split">${boxes.join('')}</div>`;
  }

  function openWinePicker(action) {
    const receiving = action === 'receive';
    if (receiving && !roleAdmin()) return;
    const wines = activeWines().filter(wine => receiving || (wine.fridge_verified_at && wine.fridge_qty > 0));
    const title = receiving ? 'Dar entrada' : 'Registar venda';
    if (!wines.length) {
      openModal(title, '', `<p class="modal-summary">${receiving ? 'Adiciona um vinho para registar a entrada.' : 'Confere o stock do frigorífico para poder registar uma venda.'}</p>
        <div class="modal-actions"><button class="btn btn-primary" type="button" data-view="inventario">Ver inventário</button></div>`);
      return;
    }
    openModal(title, '', '<label class="field">Escolher vinho<input id="wine-picker-search" type="search" placeholder="Pesquisar vinho ou região…" autocomplete="off"></label><div id="wine-picker-results" class="wine-picker-results"></div>');
    const field = $('#wine-picker-search');
    const results = $('#wine-picker-results');
    const update = () => {
      const query = norm(field.value.trim());
      const matches = wines.filter(wine => wineMatches(wine, query)).slice(0, 8);
      results.innerHTML = matches.map(wine => `<button type="button" data-action="${action}" data-id="${esc(wine.id)}">
        <span><strong>${esc(wine.name)}</strong><small>${esc(shortRegion(wine))}</small></span>${icon('arrow-right')}
      </button>`).join('') || '<p class="empty-list">Sem resultados.</p>';
    };
    field.addEventListener('input', update);
    update();
    field.focus();
  }

  function openMove(w, action='sale') {
    if (!w || !Object.hasOwn(ACTIONS, action)) return;
    if (action === 'sale' && (!w.fridge_verified_at || w.fridge_qty === 0)) {
      if (!w.fridge_verified_at) return openMove(w, 'count');
      if (w.storage_verified_at && w.storage_qty > 0) return openMove(w, 'refill');
      return openAlternatives(w);
    }
    if (action === 'receive' && !roleAdmin()) {
      toast('Só os administradores podem registar novas entradas.', 'warning');
      return;
    }
    if (action === 'receive' && !w.fridge_verified_at && !w.storage_verified_at) {
      toast('Confere um local antes de dar entrada.', 'warning');
      return openMove(w, 'count');
    }
    if (action === 'refill') {
      const requests = state.refillRequests.filter(request => request.wine_id === w.id);
      if (requests.length) return openModal('Reposições pendentes', w.name, refillList(requests));
    }

    const isCount = action === 'count';
    const isLoss = action === 'loss';
    const isSale = action === 'sale';
    const hasLocation = isCount || isLoss || action === 'receive';
    const countStorage = isCount && w.fridge_verified_at && !w.storage_verified_at;
    const receiveStorage = action === 'receive' && !w.fridge_verified_at && w.storage_verified_at;
    const preferredLocation = countStorage || receiveStorage ? 'storage' : 'fridge';
    const verifiedQuantity = location => w[location + '_verified_at'] ? w[location + '_qty'] : 0;
    const choices = hasLocation ? `<label class="field full">Localização<select name="location" id="move-location">
      <option value="fridge">Frigorífico</option><option value="storage" ${preferredLocation === 'storage' ? 'selected' : ''}>Armazém</option>
    </select></label>` : '';
    const quantity = isCount
      ? `<label class="field full">Garrafas contadas<input id="move-count" name="count" type="number" inputmode="numeric" min="0" max="100000" step="1" required value="${verifiedQuantity(preferredLocation)}"></label>`
      : '<label class="field full">Garrafas<input id="move-amount" name="amount" type="number" inputmode="numeric" min="1" max="10000" step="1" required value="1"></label>';
    const note = isLoss
      ? '<label class="field full">Motivo da quebra<textarea name="note" maxlength="500" minlength="3" required></textarea></label>'
      : '<details class="form-disclosure full"><summary>Adicionar nota</summary><label class="field"><span class="sr-only">Nota</span><textarea name="note" maxlength="500"></textarea></label></details>';
    const confirm = isSale ? 'Confirmar venda' : isCount ? 'Guardar contagem' : 'Confirmar';
    openModal(ACTIONS[action], w.name, `${stockBoxes(w, isSale ? ['fridge'] : ['fridge', 'storage'])}
      <form id="movement-form" class="movement-form" data-wine="${esc(w.id)}" data-kind="${esc(action)}">
        <div class="form-grid">${choices}${quantity}${note}</div>
        <div class="modal-actions"><button class="btn btn-outline" type="button" data-close-modal>Cancelar</button><button class="btn btn-primary" type="submit" id="move-submit">${confirm}</button></div>
      </form>`);
    if (isCount) $('#move-location').addEventListener('change', e => {
      $('#move-count').value = verifiedQuantity(e.target.value);
    });
  }

  function openDetails(w) {
    if (!w) return;
    const {type} = stockState(w);
    const id = esc(w.id);
    const button = (action, label, primary=false) => `<button class="btn ${primary ? 'btn-primary' : 'btn-outline'}" type="button" data-action="${action}" data-id="${id}">${label}</button>`;
    const mainAction = type === 'available' ? button('sale', 'Vender', true)
      : type === 'storage' ? button('refill', 'Repor', true)
      : type === 'soldout' ? button('alternatives', 'Alternativas', true) : '';
    const refill = type !== 'storage' && w.storage_verified_at && w.fridge_verified_at && w.storage_qty > 0 ? button('refill', 'Repor') : '';
    const specs = [`${w.volume_ml || 750} ml`, w.vintage_on_menu ? `Colheita ${w.vintage_on_menu}` : '', !w.menu ? 'Fora da carta' : ''].filter(Boolean).join(' · ');
    const extras = `${button('return', 'Devolver ao armazém')}${button('loss', 'Registar quebra')}${roleAdmin() ? button('receive', 'Nova entrada') + button('edit', 'Editar vinho') : ''}`;
    openModal(w.name, [CATEGORIES[w.category], w.region].filter(Boolean).join(' · '), `
      <div class="wine-detail-line"><span class="details-price">${esc(euro(w.price_cents))}</span>${statusPill(w)}</div>
      ${stockBoxes(w)}
      <div class="details-actions">${mainAction}${refill}${button('count', 'Conferir', !mainAction)}</div>
      <details class="form-disclosure"><summary>Mais sobre o vinho</summary><p class="helper-text">${esc(specs)}</p>
      ${w.note ? `<p class="helper-text">${esc(w.note)}</p>` : ''}
      ${w.legacy_qty != null ? `<p class="helper-text">Levantamento antigo · ${w.legacy_qty} garrafa(s). O stock atual está no topo.</p>` : ''}</details>
      <details class="form-disclosure"><summary>Outras operações</summary><div class="details-actions">${extras}</div></details>`);
  }
  function openAlternatives(w){const options=state.wines.filter(x=>x.menu&&!x.archived&&x.id!==w.id&&x.category===w.category&&x.fridge_verified_at&&x.fridge_qty>0).slice(0,6);
    openModal('Vinho indisponível',w.name,`<div class="batch-hint warning">${icon('alert-triangle')} <span>${esc(stockState(w).help)}</span></div><h3 class="modal-subheading">Alternativas da mesma categoria</h3>${options.length?options.map(x=>`<div class="alert-row"><span class="alert-indicator">${icon('wine')}</span><div class="alert-copy"><strong>${esc(x.name)}</strong><small>${esc(x.region)} · ${x.fridge_qty} no frigorífico</small></div><strong style="white-space:nowrap;font-size:12px">${esc(euro(x.price_cents))}</strong><button class="btn btn-small btn-outline" data-action="details" data-id="${esc(x.id)}">Ver</button></div>`).join(''):'<p class="helper-text">Nenhuma alternativa da mesma categoria tem stock confirmado no frigorífico.</p>'}`);
  }
  function openEditor(w=null){if(!roleAdmin()){toast('Apenas o administrador pode editar o catálogo.','warning');return;}
    const d=w||{id:'',name:'',category:'tinto',region:'',price_cents:null,menu:true,volume_ml:750,note:'',archived:false};
    openModal(w?'Editar vinho':'Adicionar vinho',w?`${CATEGORIES[w.category]} · ${w.region}`:'Nova referência no catálogo',`<form id="wine-editor" data-id="${esc(d.id)}"><div class="form-grid"><label class="field full">Nome / gama<input name="name" type="text" maxlength="180" value="${esc(d.name)}" required placeholder="Ex.: Quinta do Paral — Reserva"></label><label class="field">Categoria<select name="category">${Object.entries(CATEGORIES).map(([k,v])=>`<option value="${k}" ${d.category===k?'selected':''}>${esc(v)}</option>`).join('')}</select></label><label class="field">Região<input name="region" value="${esc(d.region)}" placeholder="Ex.: Douro"></label><label class="field">Preço (€)<input name="price" type="number" min="0" step="0.01" inputmode="decimal" value="${d.price_cents==null?'':(d.price_cents/100).toFixed(2)}" placeholder="Sem preço"></label><label class="field">Formato (ml)<input name="volume" type="number" min="1" step="1" value="${d.volume_ml||750}"></label><label class="field full">Observações<textarea name="note" maxlength="500" placeholder="Gama, características ou informação útil">${esc(d.note||'')}</textarea></label><label class="check-field full"><input name="menu" type="checkbox" ${d.menu?'checked':''}> Disponível na carta do restaurante</label><label class="check-field full"><input name="archived" type="checkbox" ${d.archived?'checked':''}> Arquivar referência (não apagar o histórico)</label></div><p class="helper-text">Anos diferentes do mesmo vinho são geridos como uma única referência; reservas e garrafas de formatos diferentes devem permanecer separadas.</p><div class="modal-actions"><button class="btn btn-outline" type="button" data-close-modal>Cancelar</button><button class="btn btn-primary" type="submit">Guardar vinho ${icon('check')}</button></div></form>`,true);
  }
  async function doMovement(fd,form){
    const wineId=form.dataset.wine;const type=form.dataset.kind;const p_location=String(fd.get('location')||'fridge');
    const p_amount=type==='count'?1:Number(fd.get('amount'));const p_count=type==='count'?Number(fd.get('count')):null;
    const p_note=String(fd.get('note')||'').trim();
    if(!Number.isSafeInteger(p_amount)||p_amount<1||p_amount>10000)throw new Error('Quantidade inválida.');
    if(type==='count'&&(!Number.isSafeInteger(p_count)||p_count<0||p_count>100000))throw new Error('Contagem inválida.');
    if(type==='loss'&&p_note.length<3)throw new Error('Indica o motivo da quebra.');
    const {error}=await sb.rpc('record_movement',{p_wine_id:wineId,p_type:type,p_amount,p_location,p_count,p_note});if(error)throw error;
    await loadRemote({silent:true}).catch(() => updateChrome('offline'));
  }
  async function confirmRefill(button) {
    const saleId = button.dataset.id;
    if (state.busy || !state.refillRequests.some(request => request.id === saleId)) return;
    const user = state.user;
    const modal = state.modal;
    state.busy = true;
    button.disabled = true;
    try {
      const {data:confirmed, error} = await sb.rpc('confirm_refill', {p_sale_id:saleId});
      if (state.user !== user) return;
      if (error) throw error;
      state.refillRequests = state.refillRequests.filter(request => request.id !== saleId);
      if (modal && state.modal === modal) closeModal();
      render();
      toast(confirmed ? 'Reposição registada no histórico.' : 'Esta reposição já foi confirmada.');
      await loadRemote({silent:true}).catch(() => updateChrome('offline'));
    } catch (error) {
      if (state.user === user) {
        toast(errorMessage(error), 'error');
        queueRefresh();
      }
    } finally {
      if (state.user === user) state.busy = false;
      if (button.isConnected) button.disabled = false;
    }
  }
  async function saveWine(fd,form){
    const p_id=form.dataset.id||null,p_name=String(fd.get('name')||'').trim(),p_category=String(fd.get('category')),p_region=String(fd.get('region')||'').trim();
    const rawPrice=String(fd.get('price')||'').trim();const p_price_cents=rawPrice===''?null:Math.round(Number(rawPrice.replace(',','.'))*100);
    const p_menu=fd.has('menu'),p_volume_ml=Number(fd.get('volume')),p_note=String(fd.get('note')||''),p_archived=fd.has('archived');
    if(p_name.length<2)throw Error('Escreve o nome completo do vinho.');
    if(p_price_cents!=null&&(!Number.isSafeInteger(p_price_cents)||p_price_cents<0))throw Error('Preço inválido.');
    if(!Number.isSafeInteger(p_volume_ml)||p_volume_ml<=0)throw Error('Formato inválido.');
    const {error}=await sb.rpc('save_wine',{p_id,p_name,p_category,p_region,p_price_cents,p_menu,p_volume_ml,p_note,p_archived});if(error)throw error;await loadRemote({silent:true});
  }
  async function updateUser(id,role,approved){
    const {error}=await sb.rpc('set_profile',{p_id:id,p_role:role,p_approved:approved});if(error)throw error;await loadRemote({silent:true});
  }
  function csvEscape(v){let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function download(filename,text,mime){const blob=new Blob([text],{type:mime});const url=URL.createObjectURL(blob);let a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
  function csv(rows){return '\ufeff'+rows.map(r=>r.map(csvEscape).join(';')).join('\r\n');}
  function exportStock(){
    const rows=[['Vinho','Categoria','Região','Na carta','Formato (ml)','Preço (€)','Frigorífico','Frigorífico confirmado','Armazém','Armazém confirmado']];
    state.wines.filter(w=>!w.archived).forEach(w=>rows.push([w.name,CATEGORIES[w.category],w.region,w.menu?'Sim':'Não',w.volume_ml,w.price_cents==null?'':(w.price_cents/100).toFixed(2).replace('.',','),w.fridge_verified_at?w.fridge_qty:'',w.fridge_verified_at?'Sim':'Não',w.storage_verified_at?w.storage_qty:'',w.storage_verified_at?'Sim':'Não']));
    download('silas-vino-stock-'+new Date().toISOString().slice(0,10)+'.csv',csv(rows),'text/csv;charset=utf-8');toast('Inventário exportado.');
  }
  function exportHistory(){const rows=[['Data','Vinho','Tipo','Quantidade','Localização','Frigorífico antes','Frigorífico depois','Armazém antes','Armazém depois','Colaborador','Nota']];
    const movements = state.view === 'reposicoes' ? state.refillHistory : state.movements;
    movements.forEach(m=>rows.push([m.created_at,getWine(m.wine_id)?.name||m.wine_id,ACTIONS[m.movement_type]||m.movement_type,m.quantity,m.location,m.before_fridge_qty,m.after_fridge_qty,m.before_storage_qty,m.after_storage_qty,m.actor_name,m.note]));
    download('silas-vino-movimentos-'+new Date().toISOString().slice(0,10)+'.csv',csv(rows),'text/csv;charset=utf-8');toast('Histórico exportado.');
  }
  function exportBackup(){download('silas-vino-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify({exported_at:new Date().toISOString(),wines:state.wines,movements:state.movements,profiles:state.profiles},null,2),'application/json');toast('Cópia exportada.');}
  function resetFilters() {
    Object.assign(state, {category:'all', region:'all', year:'all', availability:'all', menu:defaultMenu(), page:1});
    render();
    const toggle = $('#filters-toggle');
    if (toggle.getClientRects().length) toggle.focus();
    else $('#category-filter').focus();
  }

  async function doAuth(e) {
    e.preventDefault();
    const button = $('#auth-submit');
    if (button.disabled) return;
    const username = $('#auth-username').value.trim().toLowerCase();
    const password = $('#auth-password').value;
    if (!sb) { showLoginError('O serviço de login está indisponível. Atualiza a página.'); return; }
    if (!/^[a-z0-9_]{1,32}$/.test(username)) {
      showLoginError('Introduz o teu nome de utilizador.');
      return;
    }
    $('#auth-error').classList.add('hidden');
    storeInTab = !$('#auth-remember').checked;
    button.disabled = true;
    button.textContent = 'A entrar…';
    try {
      const {data, error} = await sb.auth.signInWithPassword({email:`${username}@${accountDomain}`, password});
      if (error) throw error;
      $('#auth-password').value = '';
      await loadUser(data.user);
    } catch (error) {
      showLoginError(errorMessage(error));
    } finally {
      storeInTab = null;
      button.disabled = false;
      button.textContent = 'Entrar';
    }
  }

  function textInputUpdate(e) {
    if (e.target.id !== 'search-input') return;
    if (isHistoryView()) state.movementSearch = e.target.value;
    else state.search = e.target.value;
    state.page = 1;
    updateResults();
  }
  async function handleClick(e){
    const menu = $('#options-menu');
    const el = e.target.closest('button');
    if (menu.open && !menu.contains(e.target)) menu.open = false;
    if (!el) return;
    if (menu.contains(el)) {
      menu.open = false;
      $('summary', menu).focus();
    }
    if(el.hasAttribute('data-close-modal')){closeModal();return;}
    if(el.dataset.view){navTo(el.dataset.view, el.dataset.availability);return;}
    if (el.id === 'filters-toggle') { setFiltersOpen(el.getAttribute('aria-expanded') === 'false'); return; }
    if(el.id==='refresh-btn'){await refresh();return;}
    if(el.id==='signout'||el.id==='pending-signout'){await signout();return;}
    if(el.id==='pending-reload'){if(state.user)await loadUser(state.user);return;}
    let action=el.dataset.action;if(!action)return;
    if (action === 'confirm-refill') { await confirmRefill(el); return; }
    const w=getWine(el.dataset.id);
    if(['sale','refill','return','receive','count','loss'].includes(action)){openMove(w,action);return;}
    if(action==='details'){openDetails(w);return;}
    if(action==='alternatives'){openAlternatives(w);return;}
    if(action==='edit'){openEditor(w);return;}
    if(action==='add'){openEditor();return;}
    if(action==='pick-wine'){openWinePicker(el.dataset.move);return;}
    if (action === 'more') {
      const next = state.page * state.pageSize;
      state.page++;
      updateResults();
      $$('#list-results tbody tr, #list-results li')[next]?.querySelector('button, summary')?.focus({preventScroll: true});
      return;
    }
    if(action==='clear-filters'){resetFilters();return;}
    if(action==='export'){exportStock();return;}
    if(action==='export-history'){exportHistory();return;}
    if(action==='backup'){exportBackup();return;}
    if(action==='user-update'||action==='user-role'){
      const p=state.profiles.find(x=>x.id===el.dataset.id);if(!p)return;
      const role=$('#role-'+CSS.escape(p.id))?.value||p.role;
      const approved=action==='user-update'?el.dataset.approved==='true':p.approved;
      if(!confirm(`${approved?'Autorizar':'Suspender'} ${p.display_name}? Papel: ${role}.`))return;
      el.disabled=true;try{await updateUser(p.id,role,approved);toast('Permissões atualizadas.');}catch(err){toast(errorMessage(err),'error');}finally{el.disabled=false;}return;
    }
  }
  async function handleSubmit(e){if(e.target.id==='auth-form'){e.preventDefault();await doAuth(e);return;}
    if(e.target.id!=='movement-form'&&e.target.id!=='wine-editor')return;
    e.preventDefault();if(state.busy)return;
    let form=e.target;const fd=new FormData(form),btn=$('[type=submit]',form);state.busy=true;btn.disabled=true;
    try{
      if(form.id==='movement-form') {const t=form.dataset.kind;await doMovement(fd,form);toast(t==='sale'?'Venda registada. Reposição enviada para o sino.':t==='count'?'Contagem guardada.':'Stock atualizado com sucesso.');}
      else{await saveWine(fd,form);toast('Referência guardada na carta.');}
      closeModal();render();
    }catch(err){toast(errorMessage(err),'error');}
    finally{state.busy=false;if(btn.isConnected)btn.disabled=false;}
  }
  function bindEvents(){
    document.addEventListener('click',handleClick);
    document.addEventListener('submit',handleSubmit);
    document.addEventListener('input',textInputUpdate);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') queueRefresh(); });
    document.addEventListener('change', e => {
      const filters = {
        'menu-filter':'menu', 'status-filter':'availability', 'category-filter':'category',
        'region-filter':'region', 'year-filter':'year', 'movement-filter':'movementType'
      };
      if (!Object.hasOwn(filters, e.target.id)) return;
      state[filters[e.target.id]] = e.target.value;
      state.page = 1;
      updateResults();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (state.modal) closeModal();
        else if ($('#options-menu').open) {
          $('#options-menu').open = false;
          $('#options-menu summary').focus();
        } else if ($('#filters-toggle')?.getAttribute('aria-expanded') === 'true') {
          setFiltersOpen(false);
          $('#filters-toggle').focus();
        }
      }
      if (e.key === '/' && state.ready && !state.modal && !e.ctrlKey && !e.metaKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        if (state.view === 'equipa') navTo('painel');
        $('#search-input').focus();
      }
    });
    $('#modal-root').addEventListener('mousedown',e=>{if(e.target.id==='modal-root'&&!state.busy)closeModal();});
    window.addEventListener('online',()=>state.ready&&refresh());
    window.addEventListener('offline',()=>state.ready&&updateChrome('offline'));
  }
  start();
})();
