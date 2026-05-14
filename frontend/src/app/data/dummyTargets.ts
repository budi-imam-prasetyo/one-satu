import { ApiTarget } from '../types/target';

// Base date: 2026-05-13
const ago = (days: number) =>
  new Date(Date.UTC(2026, 4, 13) - days * 86400000).toISOString();
const fromNow = (days: number) =>
  new Date(Date.UTC(2026, 4, 13) + days * 86400000).toISOString().split('T')[0];

export const dummyTargets: ApiTarget[] = [
  // ─── 1 ───────────────────────────────────────────────────────────────────
  {
    id: 'target-001',
    user_id: 'user-001',
    name: 'Laptop Kerja Baru',
    description: 'MacBook Air M3 untuk produktivitas kerja remote',
    image_url: null,
    status: 'active',
    target_amount: 18000000,
    current_amount: 9000000,
    deadline: fromNow(180),
    created_at: ago(90),
    updated_at: ago(2),
    schedule: {
      id: 'sched-001', target_id: 'target-001',
      frequency: 'monthly', amount: 1500000,
      next_run: fromNow(5), last_run: ago(25),
      is_active: true, created_at: ago(90),
    },
    transactions: [
      { id: 'tx-001a', target_id: 'target-001', type: 'deposit', amount: 1500000, note: 'Tabungan April', created_at: ago(2) },
      { id: 'tx-001b', target_id: 'target-001', type: 'deposit', amount: 1500000, note: 'Tabungan Maret', created_at: ago(32) },
      { id: 'tx-001c', target_id: 'target-001', type: 'deposit', amount: 2000000, note: 'Bonus proyek', created_at: ago(60) },
      { id: 'tx-001d', target_id: 'target-001', type: 'deposit', amount: 4000000, note: 'Setoran awal', created_at: ago(90) },
    ],
  },

  // ─── 2 ───────────────────────────────────────────────────────────────────
  {
    id: 'target-002',
    user_id: 'user-001',
    name: 'Liburan ke Bali',
    description: 'Honeymoon 7 hari di Ubud & Seminyak',
    image_url: null,
    status: 'active',
    target_amount: 8000000,
    current_amount: 2000000,
    deadline: fromNow(120),
    created_at: ago(45),
    updated_at: ago(5),
    schedule: {
      id: 'sched-002', target_id: 'target-002',
      frequency: 'weekly', amount: 300000,
      next_run: fromNow(2), last_run: ago(7),
      is_active: true, created_at: ago(45),
    },
    transactions: [
      { id: 'tx-002a', target_id: 'target-002', type: 'deposit', amount: 300000, note: null, created_at: ago(5) },
      { id: 'tx-002b', target_id: 'target-002', type: 'deposit', amount: 300000, note: null, created_at: ago(12) },
      { id: 'tx-002c', target_id: 'target-002', type: 'deposit', amount: 1400000, note: 'Setoran awal', created_at: ago(45) },
    ],
  },

  // ─── 3 ───────────────────────────────────────────────────────────────────
  {
    id: 'target-003',
    user_id: 'user-001',
    name: 'Dana Darurat 6 Bulan',
    description: 'Tabungan untuk keadaan darurat minimal 6x pengeluaran bulanan',
    image_url: null,
    status: 'active',
    target_amount: 36000000,
    current_amount: 14400000,
    deadline: fromNow(365),
    created_at: ago(180),
    updated_at: ago(3),
    schedule: {
      id: 'sched-003', target_id: 'target-003',
      frequency: 'monthly', amount: 2000000,
      next_run: fromNow(8), last_run: ago(22),
      is_active: true, created_at: ago(180),
    },
    transactions: [
      { id: 'tx-003a', target_id: 'target-003', type: 'deposit', amount: 2000000, note: 'Mei', created_at: ago(3) },
      { id: 'tx-003b', target_id: 'target-003', type: 'deposit', amount: 2000000, note: 'April', created_at: ago(33) },
      { id: 'tx-003c', target_id: 'target-003', type: 'deposit', amount: 2000000, note: 'Maret', created_at: ago(63) },
      { id: 'tx-003d', target_id: 'target-003', type: 'deposit', amount: 2000000, note: 'Februari', created_at: ago(93) },
      { id: 'tx-003e', target_id: 'target-003', type: 'deposit', amount: 4400000, note: 'Setoran awal + sisa THR', created_at: ago(120) },
      { id: 'tx-003f', target_id: 'target-003', type: 'withdraw', amount: 2000000, note: 'Kebutuhan darurat', created_at: ago(150) },
    ],
  },

  // ─── 4 ───────────────────────────────────────────────────────────────────
  {
    id: 'target-004',
    user_id: 'user-001',
    name: 'iPhone 17 Pro Max',
    description: 'Ganti HP lama yang sudah mulai lemot',
    image_url: null,
    status: 'active',
    target_amount: 22000000,
    current_amount: 16500000,
    deadline: fromNow(55),
    created_at: ago(110),
    updated_at: ago(1),
    schedule: {
      id: 'sched-004', target_id: 'target-004',
      frequency: 'weekly', amount: 500000,
      next_run: fromNow(6), last_run: ago(1),
      is_active: true, created_at: ago(110),
    },
    transactions: [
      { id: 'tx-004a', target_id: 'target-004', type: 'deposit', amount: 500000, note: null, created_at: ago(1) },
      { id: 'tx-004b', target_id: 'target-004', type: 'deposit', amount: 500000, note: null, created_at: ago(8) },
      { id: 'tx-004c', target_id: 'target-004', type: 'deposit', amount: 3000000, note: 'Bonus penjualan', created_at: ago(30) },
      { id: 'tx-004d', target_id: 'target-004', type: 'deposit', amount: 12500000, note: 'Setoran besar awal', created_at: ago(110) },
    ],
  },

  // ─── 5 (COMPLETED) ───────────────────────────────────────────────────────
  {
    id: 'target-005',
    user_id: 'user-001',
    name: 'Kursus Full-Stack Developer',
    description: 'Bootcamp online 6 bulan untuk upgrade skill',
    image_url: null,
    status: 'completed',
    target_amount: 5000000,
    current_amount: 5000000,
    deadline: fromNow(-10),
    created_at: ago(120),
    updated_at: ago(10),
    schedule: {
      id: 'sched-005', target_id: 'target-005',
      frequency: 'monthly', amount: 1500000,
      next_run: fromNow(20), last_run: ago(40),
      is_active: false, created_at: ago(120),
    },
    transactions: [
      { id: 'tx-005a', target_id: 'target-005', type: 'deposit', amount: 2000000, note: 'Pelunasan', created_at: ago(10) },
      { id: 'tx-005b', target_id: 'target-005', type: 'deposit', amount: 1500000, note: null, created_at: ago(40) },
      { id: 'tx-005c', target_id: 'target-005', type: 'deposit', amount: 1500000, note: 'Setoran awal', created_at: ago(120) },
    ],
  },

  // ─── 6 ───────────────────────────────────────────────────────────────────
  {
    id: 'target-006',
    user_id: 'user-001',
    name: 'Sepeda Gunung Polygon',
    description: 'Untuk olahraga akhir pekan dan commuting',
    image_url: null,
    status: 'active',
    target_amount: 6500000,
    current_amount: 1950000,
    deadline: fromNow(200),
    created_at: ago(60),
    updated_at: ago(7),
    schedule: {
      id: 'sched-006', target_id: 'target-006',
      frequency: 'weekly', amount: 200000,
      next_run: fromNow(3), last_run: ago(7),
      is_active: true, created_at: ago(60),
    },
    transactions: [
      { id: 'tx-006a', target_id: 'target-006', type: 'deposit', amount: 200000, note: null, created_at: ago(7) },
      { id: 'tx-006b', target_id: 'target-006', type: 'deposit', amount: 200000, note: null, created_at: ago(14) },
      { id: 'tx-006c', target_id: 'target-006', type: 'deposit', amount: 1550000, note: 'Setoran awal', created_at: ago(60) },
    ],
  },

  // ─── 7 ───────────────────────────────────────────────────────────────────
  {
    id: 'target-007',
    user_id: 'user-001',
    name: 'Renovasi Kamar Tidur',
    description: 'Cat ulang, lemari baru, dan kasur baru',
    image_url: null,
    status: 'active',
    target_amount: 15000000,
    current_amount: 2250000,
    deadline: fromNow(300),
    created_at: ago(30),
    updated_at: ago(10),
    schedule: {
      id: 'sched-007', target_id: 'target-007',
      frequency: 'monthly', amount: 1000000,
      next_run: fromNow(15), last_run: ago(15),
      is_active: true, created_at: ago(30),
    },
    transactions: [
      { id: 'tx-007a', target_id: 'target-007', type: 'deposit', amount: 1000000, note: null, created_at: ago(10) },
      { id: 'tx-007b', target_id: 'target-007', type: 'deposit', amount: 1250000, note: 'Setoran awal', created_at: ago(30) },
    ],
  },

  // ─── 8 ───────────────────────────────────────────────────────────────────
  {
    id: 'target-008',
    user_id: 'user-001',
    name: 'Cincin Lamaran',
    description: 'Rencana melamar akhir tahun ini',
    image_url: null,
    status: 'active',
    target_amount: 12000000,
    current_amount: 2400000,
    deadline: fromNow(220),
    created_at: ago(55),
    updated_at: ago(5),
    schedule: {
      id: 'sched-008', target_id: 'target-008',
      frequency: 'monthly', amount: 1000000,
      next_run: fromNow(10), last_run: ago(20),
      is_active: true, created_at: ago(55),
    },
    transactions: [
      { id: 'tx-008a', target_id: 'target-008', type: 'deposit', amount: 1000000, note: null, created_at: ago(5) },
      { id: 'tx-008b', target_id: 'target-008', type: 'deposit', amount: 1400000, note: 'Setoran awal', created_at: ago(55) },
    ],
  },

  // ─── 9 ───────────────────────────────────────────────────────────────────
  {
    id: 'target-009',
    user_id: 'user-001',
    name: 'Kamera Sony Alpha A7IV',
    description: 'Mirrorless full-frame untuk photography & videography',
    image_url: null,
    status: 'active',
    target_amount: 35000000,
    current_amount: 22750000,
    deadline: fromNow(90),
    created_at: ago(150),
    updated_at: ago(4),
    schedule: {
      id: 'sched-009', target_id: 'target-009',
      frequency: 'monthly', amount: 2500000,
      next_run: fromNow(11), last_run: ago(19),
      is_active: true, created_at: ago(150),
    },
    transactions: [
      { id: 'tx-009a', target_id: 'target-009', type: 'deposit', amount: 2500000, note: null, created_at: ago(4) },
      { id: 'tx-009b', target_id: 'target-009', type: 'deposit', amount: 2500000, note: null, created_at: ago(34) },
      { id: 'tx-009c', target_id: 'target-009', type: 'deposit', amount: 2500000, note: null, created_at: ago(64) },
      { id: 'tx-009d', target_id: 'target-009', type: 'deposit', amount: 5250000, note: 'Tabungan 2 bulan + bonus', created_at: ago(94) },
      { id: 'tx-009e', target_id: 'target-009', type: 'deposit', amount: 10000000, note: 'Setoran awal', created_at: ago(150) },
    ],
  },

  // ─── 10 ──────────────────────────────────────────────────────────────────
  {
    id: 'target-010',
    user_id: 'user-001',
    name: 'Liburan ke Jepang',
    description: 'Trip ke Tokyo, Osaka, Kyoto selama 10 hari',
    image_url: null,
    status: 'active',
    target_amount: 30000000,
    current_amount: 6000000,
    deadline: fromNow(540),
    created_at: ago(70),
    updated_at: ago(8),
    schedule: {
      id: 'sched-010', target_id: 'target-010',
      frequency: 'monthly', amount: 1500000,
      next_run: fromNow(7), last_run: ago(23),
      is_active: true, created_at: ago(70),
    },
    transactions: [
      { id: 'tx-010a', target_id: 'target-010', type: 'deposit', amount: 1500000, note: null, created_at: ago(8) },
      { id: 'tx-010b', target_id: 'target-010', type: 'deposit', amount: 1500000, note: null, created_at: ago(38) },
      { id: 'tx-010c', target_id: 'target-010', type: 'deposit', amount: 3000000, note: 'Setoran awal', created_at: ago(70) },
    ],
  },

  // ─── 11 ──────────────────────────────────────────────────────────────────
  {
    id: 'target-011',
    user_id: 'user-001',
    name: 'DP Mobil Pertama',
    description: 'Toyota Avanza atau Honda Brio, DP 20%',
    image_url: null,
    status: 'active',
    target_amount: 40000000,
    current_amount: 3200000,
    deadline: fromNow(730),
    created_at: ago(20),
    updated_at: ago(20),
    schedule: {
      id: 'sched-011', target_id: 'target-011',
      frequency: 'monthly', amount: 2000000,
      next_run: fromNow(10), last_run: null,
      is_active: true, created_at: ago(20),
    },
    transactions: [
      { id: 'tx-011a', target_id: 'target-011', type: 'deposit', amount: 3200000, note: 'Setoran awal dari bonus THR', created_at: ago(20) },
    ],
  },

  // ─── 12 ──────────────────────────────────────────────────────────────────
  {
    id: 'target-012',
    user_id: 'user-001',
    name: 'Modal Buka Warung Makan',
    description: 'Warung nasi rumahan di dekat kost-kostan',
    image_url: null,
    status: 'active',
    target_amount: 20000000,
    current_amount: 6000000,
    deadline: fromNow(270),
    created_at: ago(80),
    updated_at: ago(11),
    schedule: {
      id: 'sched-012', target_id: 'target-012',
      frequency: 'monthly', amount: 1500000,
      next_run: fromNow(4), last_run: ago(26),
      is_active: true, created_at: ago(80),
    },
    transactions: [
      { id: 'tx-012a', target_id: 'target-012', type: 'deposit', amount: 1500000, note: null, created_at: ago(11) },
      { id: 'tx-012b', target_id: 'target-012', type: 'deposit', amount: 1500000, note: null, created_at: ago(41) },
      { id: 'tx-012c', target_id: 'target-012', type: 'deposit', amount: 3000000, note: 'Setoran awal', created_at: ago(80) },
    ],
  },

  // ─── 13 (COMPLETED) ──────────────────────────────────────────────────────
  {
    id: 'target-013',
    user_id: 'user-001',
    name: 'PlayStation 5 Slim',
    description: 'Gaming console impian akhirnya terbeli!',
    image_url: null,
    status: 'completed',
    target_amount: 8500000,
    current_amount: 8500000,
    deadline: fromNow(-30),
    created_at: ago(200),
    updated_at: ago(30),
    schedule: {
      id: 'sched-013', target_id: 'target-013',
      frequency: 'weekly', amount: 400000,
      next_run: fromNow(7), last_run: ago(30),
      is_active: false, created_at: ago(200),
    },
    transactions: [
      { id: 'tx-013a', target_id: 'target-013', type: 'deposit', amount: 500000, note: 'Pelunasan terakhir!', created_at: ago(30) },
      { id: 'tx-013b', target_id: 'target-013', type: 'deposit', amount: 400000, note: null, created_at: ago(37) },
      { id: 'tx-013c', target_id: 'target-013', type: 'deposit', amount: 400000, note: null, created_at: ago(44) },
      { id: 'tx-013d', target_id: 'target-013', type: 'deposit', amount: 2200000, note: 'Bonus lebaran', created_at: ago(75) },
      { id: 'tx-013e', target_id: 'target-013', type: 'deposit', amount: 5000000, note: 'Setoran awal', created_at: ago(200) },
    ],
  },

  // ─── 14 (COMPLETED) ──────────────────────────────────────────────────────
  {
    id: 'target-014',
    user_id: 'user-001',
    name: 'Sony WH-1000XM5',
    description: 'Headphone ANC terbaik untuk WFH',
    image_url: null,
    status: 'completed',
    target_amount: 5000000,
    current_amount: 5000000,
    deadline: fromNow(-15),
    created_at: ago(100),
    updated_at: ago(15),
    schedule: {
      id: 'sched-014', target_id: 'target-014',
      frequency: 'daily', amount: 70000,
      next_run: fromNow(1), last_run: ago(15),
      is_active: false, created_at: ago(100),
    },
    transactions: [
      { id: 'tx-014a', target_id: 'target-014', type: 'deposit', amount: 2000000, note: 'Pelunasan dari gajian', created_at: ago(15) },
      { id: 'tx-014b', target_id: 'target-014', type: 'deposit', amount: 1500000, note: null, created_at: ago(35) },
      { id: 'tx-014c', target_id: 'target-014', type: 'deposit', amount: 1500000, note: 'Setoran awal', created_at: ago(100) },
    ],
  },

  // ─── 15 ──────────────────────────────────────────────────────────────────
  {
    id: 'target-015',
    user_id: 'user-001',
    name: 'Liburan Keluarga ke Lombok',
    description: 'Bareng orang tua dan adik, 5 hari 4 malam',
    image_url: null,
    status: 'active',
    target_amount: 12000000,
    current_amount: 5400000,
    deadline: fromNow(160),
    created_at: ago(100),
    updated_at: ago(6),
    schedule: {
      id: 'sched-015', target_id: 'target-015',
      frequency: 'monthly', amount: 1200000,
      next_run: fromNow(9), last_run: ago(21),
      is_active: true, created_at: ago(100),
    },
    transactions: [
      { id: 'tx-015a', target_id: 'target-015', type: 'deposit', amount: 1200000, note: null, created_at: ago(6) },
      { id: 'tx-015b', target_id: 'target-015', type: 'deposit', amount: 1200000, note: null, created_at: ago(36) },
      { id: 'tx-015c', target_id: 'target-015', type: 'deposit', amount: 1200000, note: null, created_at: ago(66) },
      { id: 'tx-015d', target_id: 'target-015', type: 'deposit', amount: 1800000, note: 'Setoran awal', created_at: ago(100) },
    ],
  },

  // ─── 16 ──────────────────────────────────────────────────────────────────
  {
    id: 'target-016',
    user_id: 'user-001',
    name: 'iPad Pro M4',
    description: 'Untuk desain dan baca jurnal, gantikan laptop lama',
    image_url: null,
    status: 'active',
    target_amount: 18000000,
    current_amount: 9900000,
    deadline: fromNow(130),
    created_at: ago(130),
    updated_at: ago(3),
    schedule: {
      id: 'sched-016', target_id: 'target-016',
      frequency: 'weekly', amount: 600000,
      next_run: fromNow(4), last_run: ago(3),
      is_active: true, created_at: ago(130),
    },
    transactions: [
      { id: 'tx-016a', target_id: 'target-016', type: 'deposit', amount: 600000, note: null, created_at: ago(3) },
      { id: 'tx-016b', target_id: 'target-016', type: 'deposit', amount: 600000, note: null, created_at: ago(10) },
      { id: 'tx-016c', target_id: 'target-016', type: 'deposit', amount: 600000, note: null, created_at: ago(17) },
      { id: 'tx-016d', target_id: 'target-016', type: 'deposit', amount: 6000000, note: 'Setoran besar + bonus', created_at: ago(60) },
      { id: 'tx-016e', target_id: 'target-016', type: 'deposit', amount: 2100000, note: 'Setoran awal', created_at: ago(130) },
    ],
  },

  // ─── 17 ──────────────────────────────────────────────────────────────────
  {
    id: 'target-017',
    user_id: 'user-001',
    name: 'Gym Annual Membership',
    description: 'Langganan gym 1 tahun di FitKo dekat kantor',
    image_url: null,
    status: 'active',
    target_amount: 3600000,
    current_amount: 2160000,
    deadline: fromNow(60),
    created_at: ago(90),
    updated_at: ago(9),
    schedule: {
      id: 'sched-017', target_id: 'target-017',
      frequency: 'monthly', amount: 600000,
      next_run: fromNow(6), last_run: ago(24),
      is_active: true, created_at: ago(90),
    },
    transactions: [
      { id: 'tx-017a', target_id: 'target-017', type: 'deposit', amount: 600000, note: null, created_at: ago(9) },
      { id: 'tx-017b', target_id: 'target-017', type: 'deposit', amount: 600000, note: null, created_at: ago(39) },
      { id: 'tx-017c', target_id: 'target-017', type: 'deposit', amount: 600000, note: null, created_at: ago(69) },
      { id: 'tx-017d', target_id: 'target-017', type: 'deposit', amount: 360000, note: 'Setoran awal', created_at: ago(90) },
    ],
  },

  // ─── 18 ──────────────────────────────────────────────────────────────────
  {
    id: 'target-018',
    user_id: 'user-001',
    name: 'Drone DJI Mini 4 Pro',
    description: 'Untuk konten perjalanan dan footage udara',
    image_url: null,
    status: 'active',
    target_amount: 8000000,
    current_amount: 6400000,
    deadline: fromNow(40),
    created_at: ago(120),
    updated_at: ago(1),
    schedule: {
      id: 'sched-018', target_id: 'target-018',
      frequency: 'weekly', amount: 350000,
      next_run: fromNow(6), last_run: ago(1),
      is_active: true, created_at: ago(120),
    },
    transactions: [
      { id: 'tx-018a', target_id: 'target-018', type: 'deposit', amount: 350000, note: null, created_at: ago(1) },
      { id: 'tx-018b', target_id: 'target-018', type: 'deposit', amount: 350000, note: null, created_at: ago(8) },
      { id: 'tx-018c', target_id: 'target-018', type: 'deposit', amount: 1050000, note: 'Bonus freelance', created_at: ago(30) },
      { id: 'tx-018d', target_id: 'target-018', type: 'deposit', amount: 4650000, note: 'Setoran awal', created_at: ago(120) },
    ],
  },

  // ─── 19 (COMPLETED) ──────────────────────────────────────────────────────
  {
    id: 'target-019',
    user_id: 'user-001',
    name: 'Kacamata Baru',
    description: 'Frame Oakley + lensa progresif, rabun jauh makin parah',
    image_url: null,
    status: 'completed',
    target_amount: 2500000,
    current_amount: 2500000,
    deadline: fromNow(-20),
    created_at: ago(60),
    updated_at: ago(20),
    schedule: {
      id: 'sched-019', target_id: 'target-019',
      frequency: 'monthly', amount: 1000000,
      next_run: fromNow(10), last_run: ago(20),
      is_active: false, created_at: ago(60),
    },
    transactions: [
      { id: 'tx-019a', target_id: 'target-019', type: 'deposit', amount: 1500000, note: 'Pelunasan', created_at: ago(20) },
      { id: 'tx-019b', target_id: 'target-019', type: 'deposit', amount: 1000000, note: 'Setoran awal', created_at: ago(60) },
    ],
  },

  // ─── 20 ──────────────────────────────────────────────────────────────────
  {
    id: 'target-020',
    user_id: 'user-001',
    name: 'Dana Pendidikan S2',
    description: 'Beasiswa parsial S2 Manajemen UI, butuh dana pelengkap',
    image_url: null,
    status: 'active',
    target_amount: 80000000,
    current_amount: 4000000,
    deadline: fromNow(1095),
    created_at: ago(15),
    updated_at: ago(15),
    schedule: {
      id: 'sched-020', target_id: 'target-020',
      frequency: 'monthly', amount: 2500000,
      next_run: fromNow(15), last_run: null,
      is_active: true, created_at: ago(15),
    },
    transactions: [
      { id: 'tx-020a', target_id: 'target-020', type: 'deposit', amount: 4000000, note: 'Setoran awal dari tabungan lama', created_at: ago(15) },
    ],
  },
];
