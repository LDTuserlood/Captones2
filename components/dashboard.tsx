'use client';
import { useEffect, useRef, useState } from 'react';
import { Activity, ArrowDownLeft, ArrowRight, Bell, Camera as CameraIcon, ChartNoAxesCombined, Check, ChevronRight, CircleHelp, Clock3, LayoutDashboard, ListFilter, Menu, Plus, RotateCcw, Search, ShieldCheck, Siren, Users, X } from 'lucide-react';
import { createDemoData, dateText, DemoData, FallEvent, isDemoData, statusLabels, Status, STORAGE_KEY, timeText, View } from '@/lib/demo-data';
import EventDetail from './evidence';
import { Cameras, Caregivers } from './management';
import Statistics from './statistics';
import Modal from './modal';

const navigation = [{ id: 'overview', label: 'Tổng quan', icon: LayoutDashboard }, { id: 'events', label: 'Sự kiện té ngã', icon: Activity }, { id: 'cameras', label: 'Quản lý camera', icon: CameraIcon }, { id: 'caregivers', label: 'Người nhận cảnh báo', icon: Users }, { id: 'statistics', label: 'Thống kê', icon: ChartNoAxesCombined }] as const;
export function Badge({ status }: { status: Status }) { return <span className={`badge status-${status.replace(' ', '-').toLowerCase()}`}><span />{statusLabels[status]}</span>; }
export default function Dashboard() {
  const [data, setData] = useState<DemoData | null>(null);
  const [view, setView] = useState<View>('overview');
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [help, setHelp] = useState(false);
  const [resetPending, setResetPending] = useState(false);
  const dataRef = useRef(data); dataRef.current = data;
  useEffect(() => {
    type Tool = { name: string; description: string; inputSchema: object; annotations: object; execute: (input: unknown) => unknown };
    const context = (document as Document & { modelContext?: { registerTool: (tool: Tool, options: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try { void Promise.resolve(context.registerTool({ name: 'read_demo_fall_events', description: 'Read simulated fall events and caregiver statuses shown in FallGuard. This does not read real camera or medical data.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute(input: unknown) { if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('Expected an empty object.'); if (!dataRef.current) throw new Error('Demo data is not ready.'); return { simulated: true, events: dataRef.current.events.map(({ id, location, time, status }) => ({ id, location, time, status })) }; } }, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Optional browser capability. */ }
    return () => lifecycle.abort();
  }, []);
  useEffect(() => {
    let initial = createDemoData();
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); if (isDemoData(saved)) initial = saved; } catch { /* Seed a clean local demo if browser storage is unavailable. */ }
    setData(initial);
    function hashChanged() { const next = location.hash.slice(1); if (navigation.some(n => n.id === next)) setView(next as View); }
    hashChanged(); window.addEventListener('hashchange', hashChanged);
    return () => window.removeEventListener('hashchange', hashChanged);
  }, []);
  useEffect(() => { if (data) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { setNotice('Trình duyệt không lưu được dữ liệu. Các thay đổi chỉ giữ trong phiên này.'); } } }, [data]);
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 5500); return () => clearTimeout(t); }, [notice]);
  function go(next: View) { setView(next); location.hash = next; setMobile(false); }
  function simulate() {
    if (!data) return;
    const camera = data.cameras.find(c => c.enabled && c.online);
    if (!camera) { setNotice('Hãy bật ít nhất một camera đang kết nối để mô phỏng.'); return; }
    const time = new Date().toISOString();
    const recipients = data.caregivers.filter(c => c.enabled).length;
    const event: FallEvent = { id: `FG-${Date.now().toString().slice(-7)}`, cameraId: camera.id, location: camera.location, time, confidence: 94, status: 'Detected', history: [{ text: 'Phát hiện chuyển động đột ngột và tư thế nằm ngang (mô phỏng)', time }, { text: 'Đã kiểm tra nằm yên 3 giây · Tạo bằng chứng mô phỏng', time }, { text: recipients ? `Mô phỏng gửi Telegram đến ${recipients} người nhận` : 'Không gửi cảnh báo: chưa bật người nhận', time }] };
    setData({ ...data, events: [event, ...data.events] }); setSelected(event.id); setNotice('Đã tạo sự kiện té ngã mô phỏng mới.');
  }
  function changeStatus(id: string, status: Status) {
    const event = data?.events.find(e => e.id === id);
    if (!event || !(status === 'Confirmed' && event.status === 'Detected' || status === 'False Alarm' && ['Detected','Confirmed'].includes(event.status) || status === 'Resolved' && event.status === 'Confirmed')) return;
    setData(current => current && ({ ...current, events: current.events.map(e => e.id === id ? { ...e, status, respondedAt: e.respondedAt || new Date().toISOString(), history: [...e.history, { text: `Nguyễn Minh Anh: ${statusLabels[status]}`, time: new Date().toISOString() }] } : e) }));
    setNotice(`Sự kiện được cập nhật: ${statusLabels[status]}.`);
  }
  const events = data?.events || [];
  const pending = events.filter(e => e.status === 'Detected');
  const active = data?.cameras.filter(c => c.online && c.enabled).length || 0;
  const currentEvent = events.find(e => e.id === selected);
  const visible = events.filter(e => (filter === 'all' || e.status === filter) && `${e.id} ${e.location}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')));
  const today = events.filter(e => new Date(e.time).toDateString() === new Date().toDateString());
  const resolved = events.filter(e => e.status === 'Resolved').length;
  function table(rows: FallEvent[]) { return <div className="table-scroll"><table><thead><tr><th>SỰ KIỆN / VỊ TRÍ</th><th>THỜI GIAN</th><th>ĐIỂM AI <span title="Điểm mô phỏng, không phải xác suất té ngã đã được hiệu chuẩn">ⓘ</span></th><th>TRẠNG THÁI</th><th><span className="sr-only">Chi tiết</span></th></tr></thead><tbody>{rows.map(e => <tr key={e.id}><td><button className="event-name" onClick={() => setSelected(e.id)}><span className={`event-icon ${e.status === 'Detected' ? 'danger' : ''}`}><Activity size={19}/></span><span><strong>{e.location}</strong><small>{e.id} · {e.cameraId}</small></span></button></td><td><strong>{timeText(e.time)}</strong><small>{dateText(e.time)}</small></td><td><div className="confidence"><span>{e.confidence}%</span><div><i style={{ width: `${e.confidence}%` }}/></div></div></td><td><Badge status={e.status}/></td><td><button className="icon-button" aria-label={`Xem sự kiện ${e.id}`} onClick={() => setSelected(e.id)}><ChevronRight size={18}/></button></td></tr>)}</tbody></table>{!rows.length && <div className="empty"><Search/><h3>Không tìm thấy sự kiện</h3><p>Thử từ khóa khác hoặc chọn tất cả trạng thái.</p></div>}</div>; }
  return <div className="app-shell">
    {mobile && <button className="mobile-overlay" aria-label="Đóng menu" onClick={() => setMobile(false)}/>}
    <aside className={`sidebar ${mobile ? 'mobile-open' : ''}`}>
      <a href="#overview" className="brand" onClick={() => go('overview')}><span className="brand-mark"><ShieldCheck size={26}/></span><span>Fall<span className="brand-light">Guard</span><small>CHĂM SÓC AN TOÀN HƠN</small></span></a>
      <div className="workspace"><span className="workspace-icon">A</span><div><strong>Gia đình An</strong><small>Không gian chăm sóc</small></div><ChevronRight size={15}/></div>
      <p className="nav-label">KHÔNG GIAN LÀM VIỆC</p>
      <nav aria-label="Điều hướng chính">{navigation.map(n => <button key={n.id} onClick={() => go(n.id)} className={`nav-item ${view === n.id ? 'active' : ''}`}><n.icon size={20}/><span>{n.label}</span>{n.id === 'events' && pending.length > 0 && <b>{pending.length}</b>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="demo-note"><span className="demo-label"><span/> CHẾ ĐỘ DEMO</span><p>Dữ liệu mô phỏng cho buổi trình bày đồ án.</p><button onClick={() => setHelp(true)}>Xem kịch bản demo <ArrowRight size={15}/></button></div><button className="help-link" onClick={() => setHelp(true)}><CircleHelp size={18}/> Hướng dẫn trình bày</button><div className="profile"><div className="avatar">MA</div><div><strong>Minh Anh</strong><small>Người chăm sóc · Demo</small></div><ShieldCheck size={17}/></div></div>
    </aside>
    <div className="main-shell"><header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-toggle" aria-label="Mở menu" onClick={() => setMobile(true)}><Menu/></button><span>Không gian chăm sóc</span><ChevronRight size={15}/><strong>{navigation.find(n => n.id === view)?.label}</strong></div><div className="topbar-right"><span className="environment"><span/> Môi trường mô phỏng</span><button className="notification-button" title="Xem cảnh báo chờ xác nhận" aria-label="Xem cảnh báo chờ xác nhận" onClick={() => { setFilter('Detected'); go('events'); }}><Bell size={20}/>{pending.length > 0 && <i/>}</button><div className="avatar small">MA</div></div></header>
      <main><div className="page-heading"><div><div className="eyebrow">FALL DETECTION & ALERT SYSTEM</div><h1>{navigation.find(n => n.id === view)?.label}</h1><p>{view === 'overview' ? 'Mọi cảnh báo, một nơi theo dõi. Luôn sẵn sàng khi cần bạn.' : view === 'events' ? 'Kiểm tra bằng chứng và theo dõi quá trình xử lý từng sự kiện.' : view === 'cameras' ? 'Quản lý các vị trí trong không gian chăm sóc.' : view === 'caregivers' ? 'Những người sẽ nhận và xử lý cảnh báo té ngã.' : 'Hiểu rõ cảnh báo và hiệu quả phản hồi của người chăm sóc.'}</p></div><button className="button primary" onClick={simulate} disabled={!data}><Plus size={18}/> Mô phỏng té ngã</button></div>
      {!data ? <div className="panel loading">Đang chuẩn bị không gian demo…</div> : <>
      {view === 'overview' && <>
        <div className="stat-grid"><Stat label="Sự kiện hôm nay" value={today.length} icon={<Activity/>} foot="Tổng số lần phát hiện"/><Stat label="Chờ xác nhận" value={pending.length} icon={<Bell/>} foot="Cần người chăm sóc kiểm tra" alert/><Stat label="Camera hoạt động" value={`${active}/${data.cameras.length}`} icon={<CameraIcon/>} foot="Trạng thái kết nối mô phỏng"/><Stat label="Sự kiện đã xử lý" value={resolved} icon={<ShieldCheck/>} foot="Trong toàn bộ dữ liệu demo"/></div>
        {pending.length > 0 ? <div className="alert-strip"><span className="alert-symbol"><Siren size={22}/></span><div><strong>Có {pending.length} cảnh báo đang chờ bạn xác nhận</strong><p>Phát hiện tư thế bất thường tại {pending[0].location.toLowerCase()} lúc {timeText(pending[0].time)}. Hãy kiểm tra bằng chứng.</p></div><button onClick={() => setSelected(pending[0].id)}>Kiểm tra ngay <ArrowRight size={17}/></button></div> : <div className="clear-strip"><ShieldCheck size={23}/><strong>Tất cả cảnh báo đã được kiểm tra.</strong><span>Không có sự kiện chờ xác nhận.</span></div>}
        <div className="overview-grid"><section className="panel events-panel"><div className="panel-heading"><div><h2>Sự kiện gần đây <span className="count">{events.length}</span></h2><p>Cập nhật từ các vị trí đang theo dõi</p></div><button className="text-button" onClick={() => { setFilter('all'); go('events'); }}>Xem tất cả <ArrowRight size={16}/></button></div>{table(events.slice(0,5))}<div className="panel-footer"><span><Clock3 size={14}/> Thời gian theo múi giờ trên máy</span><span>Dữ liệu mẫu</span></div></section><div className="right-column"><section className="panel"><div className="panel-heading"><h2>Trạng thái camera</h2><CameraIcon size={19} className="muted"/></div><div className="camera-list">{data.cameras.map(c => <div key={c.id}><span className={`camera-mini ${!c.online || !c.enabled ? 'offline' : ''}`}><CameraIcon size={18}/></span><div><strong>{c.location}</strong><small>{c.id}</small></div><span className={`connection ${c.online && c.enabled ? '' : 'off'}`}><i/>{!c.enabled ? 'Tạm dừng' : c.online ? 'Kết nối' : 'Ngoại tuyến'}</span></div>)}</div><button className="full-link" onClick={() => go('cameras')}>Quản lý camera <ArrowRight size={15}/></button></section><section className="care-card"><ShieldCheck size={28}/><h2>Cảnh báo kịp thời.<br/>An tâm mỗi ngày.</h2><p>AI phát hiện dấu hiệu bất thường. Bạn kiểm tra và quyết định bước tiếp theo.</p><span><Users size={15}/> {data.caregivers.filter(c => c.enabled).length} người đang bật nhận cảnh báo</span></section></div></div>
        <section className="workflow-panel"><div><span className="eyebrow">QUY TRÌNH CHĂM SÓC</span><h2>Từ phát hiện đến hỗ trợ</h2></div>{['Camera ghi nhận', 'AI kiểm tra tư thế', 'Gửi cảnh báo', 'Người thân xác nhận'].map((s,i) => <div className="workflow-step" key={s}><span>{String(i+1).padStart(2,'0')}</span><strong>{s}</strong>{i<3 && <ChevronRight size={17}/>}</div>)}</section>
      </>}
      {view === 'events' && <section className="panel"><div className="filter-toolbar"><label className="search-input"><Search size={18}/><input aria-label="Tìm sự kiện" placeholder="Tìm mã sự kiện, vị trí…" value={query} onChange={e => setQuery(e.target.value)}/></label><label className="select-wrap"><ListFilter size={17}/><select aria-label="Lọc trạng thái" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">Tất cả trạng thái</option>{Object.entries(statusLabels).map(([s,label]) => <option key={s} value={s}>{label}</option>)}</select></label><span className="muted">{visible.length} sự kiện</span></div>{table(visible)}</section>}
      {view === 'cameras' && <Cameras data={data} onChange={setData} notify={setNotice}/>}
      {view === 'caregivers' && <Caregivers data={data} onChange={setData} notify={setNotice}/>}
      {view === 'statistics' && <Statistics data={data}/>}
      </>}
      <footer className="page-footer"><span>FallGuard <span> / </span> Đồ án nhóm · 2026</span><span><ShieldCheck size={14}/> AI hỗ trợ phát hiện · Con người quyết định</span></footer></main></div>
    {currentEvent && <EventDetail key={currentEvent.id} event={currentEvent} recipientCount={data?.caregivers.filter(c => c.enabled).length || 0} onClose={() => setSelected(null)} onStatus={changeStatus}/>}
    {help && <Modal small title="Kịch bản demo · Gia đình An" onClose={() => { setHelp(false); setResetPending(false); }}><div className="modal-body"><p>Bà An đang ở phòng khách. Camera ghi nhận tư thế bất thường, hệ thống tạo cảnh báo để Minh Anh kiểm tra.</p><ol className="guide-list"><li>Xem tổng quan camera và các cảnh báo.</li><li>Bấm <strong>Mô phỏng té ngã</strong> để tạo sự kiện mới.</li><li>Xem ảnh keypoints, mở <strong>Diễn biến 10 giây</strong> và bấm phát.</li><li>Bấm <strong>Xác nhận té ngã</strong>, sau đó <strong>Đã hỗ trợ / Đã xử lý</strong>. Với cảnh báo nhầm, chọn <strong>Đánh dấu báo động giả</strong>.</li><li>Kiểm tra lịch sử sự kiện và thống kê được cập nhật.</li></ol><p className="info-note">Demo chạy trên trình duyệt, lưu trên máy này. Chưa kết nối AI, RTSP, cơ sở dữ liệu hoặc gửi Telegram thật.</p>{resetPending ? <div className="reset-confirm"><p>Khôi phục toàn bộ dữ liệu mẫu? Các thao tác thử trên trình duyệt này sẽ bị xóa.</p><div className="button-row"><button className="button" onClick={() => setResetPending(false)}>Giữ dữ liệu</button><button className="button danger-button" onClick={() => { setData(createDemoData()); setSelected(null); setHelp(false); setResetPending(false); setNotice('Đã khôi phục dữ liệu demo ban đầu.'); }}>Khôi phục dữ liệu mẫu</button></div></div> : <button className="button" onClick={() => setResetPending(true)}><RotateCcw size={17}/> Đặt lại dữ liệu demo</button>}</div></Modal>}
    {notice && <div className="toast" role="status"><Check size={18}/><span>{notice}</span><button aria-label="Đóng thông báo" onClick={() => setNotice('')}><X size={17}/></button></div>}
  </div>;
}
function Stat({ label, value, icon, foot, alert }: { label: string; value: number | string; icon: React.ReactNode; foot: string; alert?: boolean }) { return <section className={`stat-card ${alert ? 'alert-stat' : ''}`}><div><span>{label}</span><span className="stat-icon">{icon}</span></div><strong className="stat-number">{value}</strong><p>{alert ? <Clock3 size={14}/> : <ArrowDownLeft size={14}/>} {foot}</p></section>; }
