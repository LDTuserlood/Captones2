export type Status = 'Detected' | 'Confirmed' | 'False Alarm' | 'Resolved';
export type View = 'overview' | 'events' | 'cameras' | 'caregivers' | 'statistics';
export type FallEvent = { id: string; cameraId: string; location: string; time: string; confidence: number; status: Status; history: { text: string; time: string }[]; respondedAt?: string };
export type Camera = { id: string; name: string; location: string; online: boolean; enabled: boolean };
export type Caregiver = { id: string; name: string; relation: string; telegram: string; enabled: boolean };
export type DemoData = { events: FallEvent[]; cameras: Camera[]; caregivers: Caregiver[] };
export const statusLabels: Record<Status, string> = { Detected: 'Chờ xác nhận', Confirmed: 'Đã xác nhận', 'False Alarm': 'Báo động giả', Resolved: 'Đã xử lý' };
export const STORAGE_KEY = 'fallguard-demo-v1';
export function createDemoData(): DemoData {
  const now = new Date();
  const specs: [number, number, Status, string, string, number][] = [
    [0, 12, 'Detected', 'CAM-01', 'Phòng khách', 94], [0, 84, 'Resolved', 'CAM-02', 'Phòng ngủ', 91],
    [0, 175, 'False Alarm', 'CAM-01', 'Phòng khách', 76], [1, 18, 'Resolved', 'CAM-03', 'Hành lang', 96],
    [1, 180, 'Resolved', 'CAM-01', 'Phòng khách', 93], [2, 55, 'False Alarm', 'CAM-02', 'Phòng ngủ', 71],
    [3, 70, 'Resolved', 'CAM-01', 'Phòng khách', 95], [4, 45, 'Resolved', 'CAM-03', 'Hành lang', 90],
    [5, 130, 'False Alarm', 'CAM-02', 'Phòng ngủ', 74], [6, 22, 'Resolved', 'CAM-01', 'Phòng khách', 97]
  ];
  return {
    events: specs.map(([days, minutes, status, cameraId, location, confidence], i) => {
      const time = new Date(now.getTime() - (days * 1440 + minutes) * 60000).toISOString();
      const respondedAt = status === 'Detected' ? undefined : new Date(new Date(time).getTime() + (48 + i * 9) * 1000).toISOString();
      return { id: `FG-${String(1048-i)}`, cameraId, location, time, confidence, status, respondedAt,
        history: [{ text: 'AI xác nhận tư thế bất thường kéo dài 3 giây (mô phỏng)', time }, { text: 'Đã tạo bằng chứng và cảnh báo Telegram mô phỏng', time }, ...(respondedAt ? [{ text: `Caregiver: ${statusLabels[status]}`, time: respondedAt }] : [])] };
    }),
    cameras: [{ id: 'CAM-01', name: 'Camera phòng khách', location: 'Phòng khách', online: true, enabled: true }, { id: 'CAM-02', name: 'Camera phòng ngủ', location: 'Phòng ngủ', online: true, enabled: true }, { id: 'CAM-03', name: 'Camera hành lang', location: 'Hành lang', online: true, enabled: true }, { id: 'CAM-04', name: 'Camera sân sau', location: 'Sân sau', online: false, enabled: true }],
    caregivers: [{ id: 'CG-01', name: 'Nguyễn Minh Anh', relation: 'Người thân · Liên hệ chính', telegram: '@minhanh_demo', enabled: true }, { id: 'CG-02', name: 'Trần Hoàng Nam', relation: 'Người chăm sóc', telegram: '@hoangnam_demo', enabled: true }]
  };
}
export function timeText(value: string) { return new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); }
export function dateText(value: string) { return new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
export function isDemoData(value: unknown): value is DemoData {
  if (!value || typeof value !== 'object') return false;
  const d = value as DemoData;
  return Array.isArray(d.events) && Array.isArray(d.cameras) && Array.isArray(d.caregivers)
    && d.events.every(e => typeof e.id === 'string' && typeof e.location === 'string' && typeof e.cameraId === 'string' && Number.isFinite(Date.parse(e.time)) && Number.isFinite(e.confidence) && Object.hasOwn(statusLabels, e.status) && Array.isArray(e.history) && e.history.every(h => typeof h.text === 'string' && Number.isFinite(Date.parse(h.time))))
    && d.cameras.every(c => typeof c.id === 'string' && typeof c.name === 'string' && typeof c.location === 'string' && typeof c.online === 'boolean' && typeof c.enabled === 'boolean')
    && d.caregivers.every(c => typeof c.id === 'string' && typeof c.name === 'string' && typeof c.relation === 'string' && typeof c.telegram === 'string' && typeof c.enabled === 'boolean');
}
