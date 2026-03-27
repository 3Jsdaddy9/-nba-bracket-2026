// 2025-26 NBA 플레이오프 진출 16개 팀 (정적 데이터)
// 실제 플레이오프 확정 시 업데이트 필요 (~2026-04-14)
const TEAMS = {
  east: [
    { seed: 1, name: '보스턴 셀틱스',          nameEn: 'Boston Celtics',           abbr: 'BOS', color: '#007A33' },
    { seed: 2, name: '클리블랜드 캐벌리어스',    nameEn: 'Cleveland Cavaliers',      abbr: 'CLE', color: '#860038' },
    { seed: 3, name: '뉴욕 닉스',               nameEn: 'New York Knicks',          abbr: 'NYK', color: '#006BB6' },
    { seed: 4, name: '인디애나 페이서스',        nameEn: 'Indiana Pacers',           abbr: 'IND', color: '#002D62' },
    { seed: 5, name: '밀워키 벅스',             nameEn: 'Milwaukee Bucks',          abbr: 'MIL', color: '#00471B' },
    { seed: 6, name: '올랜도 매직',             nameEn: 'Orlando Magic',            abbr: 'ORL', color: '#0077C0' },
    { seed: 7, name: '필라델피아 세븐티식서스',  nameEn: 'Philadelphia 76ers',       abbr: 'PHI', color: '#006BB6' },
    { seed: 8, name: '마이애미 히트',           nameEn: 'Miami Heat',               abbr: 'MIA', color: '#98002E' },
  ],
  west: [
    { seed: 1, name: '오클라호마시티 선더',      nameEn: 'Oklahoma City Thunder',    abbr: 'OKC', color: '#007AC1' },
    { seed: 2, name: '휴스턴 로케츠',           nameEn: 'Houston Rockets',          abbr: 'HOU', color: '#CE1141' },
    { seed: 3, name: 'LA 레이커스',             nameEn: 'Los Angeles Lakers',       abbr: 'LAL', color: '#552583' },
    { seed: 4, name: '덴버 너기츠',             nameEn: 'Denver Nuggets',           abbr: 'DEN', color: '#0E2240' },
    { seed: 5, name: '골든스테이트 워리어스',    nameEn: 'Golden State Warriors',    abbr: 'GSW', color: '#1D428A' },
    { seed: 6, name: '멤피스 그리즐리스',        nameEn: 'Memphis Grizzlies',        abbr: 'MEM', color: '#5D76A9' },
    { seed: 7, name: '달라스 매버릭스',          nameEn: 'Dallas Mavericks',         abbr: 'DAL', color: '#00538C' },
    { seed: 8, name: '미네소타 팀버울브스',      nameEn: 'Minnesota Timberwolves',   abbr: 'MIN', color: '#236192' },
  ]
};
