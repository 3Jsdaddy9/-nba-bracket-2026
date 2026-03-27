/**
 * NBA 플레이오프 브라켓 예측기 — app.js
 * 브라켓 로직 + URL 직렬화
 */

// ── 매치업 정의 ──────────────────────────────────────────
// round 1: teams from TEAMS array directly
// round 2+: winners from source matchup IDs
const MATCHUP_DEFS = [
  // East Round 1  (id 0–3)
  { id: 0,  conf: 'east', round: 1, teamA: { conf: 'east', idx: 0 }, teamB: { conf: 'east', idx: 7 } },
  { id: 1,  conf: 'east', round: 1, teamA: { conf: 'east', idx: 3 }, teamB: { conf: 'east', idx: 4 } },
  { id: 2,  conf: 'east', round: 1, teamA: { conf: 'east', idx: 1 }, teamB: { conf: 'east', idx: 6 } },
  { id: 3,  conf: 'east', round: 1, teamA: { conf: 'east', idx: 2 }, teamB: { conf: 'east', idx: 5 } },
  // West Round 1  (id 4–7)
  { id: 4,  conf: 'west', round: 1, teamA: { conf: 'west', idx: 0 }, teamB: { conf: 'west', idx: 7 } },
  { id: 5,  conf: 'west', round: 1, teamA: { conf: 'west', idx: 3 }, teamB: { conf: 'west', idx: 4 } },
  { id: 6,  conf: 'west', round: 1, teamA: { conf: 'west', idx: 1 }, teamB: { conf: 'west', idx: 6 } },
  { id: 7,  conf: 'west', round: 1, teamA: { conf: 'west', idx: 2 }, teamB: { conf: 'west', idx: 5 } },
  // East Semis    (id 8–9)
  { id: 8,  conf: 'east', round: 2, sources: [0, 1] },
  { id: 9,  conf: 'east', round: 2, sources: [2, 3] },
  // West Semis    (id 10–11)
  { id: 10, conf: 'west', round: 2, sources: [4, 5] },
  { id: 11, conf: 'west', round: 2, sources: [6, 7] },
  // East Finals   (id 12)
  { id: 12, conf: 'east', round: 3, sources: [8,  9]  },
  // West Finals   (id 13)
  { id: 13, conf: 'west', round: 3, sources: [10, 11] },
  // NBA Finals    (id 14)
  { id: 14, conf: 'finals', round: 4, sources: [12, 13] },
];

// ── 상태 ─────────────────────────────────────────────────
// winners[i] = team object or null
let winners = new Array(15).fill(null);

// ── 팀 조회 ───────────────────────────────────────────────
function getTeam(matchupId, isTeamA) {
  const def = MATCHUP_DEFS[matchupId];
  if (def.round === 1) {
    const ref = isTeamA ? def.teamA : def.teamB;
    return TEAMS[ref.conf][ref.idx];
  }
  const srcId = isTeamA ? def.sources[0] : def.sources[1];
  return winners[srcId]; // null if source not yet decided
}

// ── 하위 매치업 무효화 ────────────────────────────────────
function invalidateDownstream(matchupId) {
  MATCHUP_DEFS.forEach(def => {
    if (!def.sources || !def.sources.includes(matchupId)) return;
    const teamA = winners[def.sources[0]];
    const teamB = winners[def.sources[1]];
    if (winners[def.id] !== null &&
        winners[def.id] !== teamA &&
        winners[def.id] !== teamB) {
      winners[def.id] = null;
      invalidateDownstream(def.id);
    }
  });
}

// ── 클릭 핸들러 ───────────────────────────────────────────
function handleTeamClick(matchupId, isTeamA) {
  const team = getTeam(matchupId, isTeamA);
  if (!team) return; // TBD — 클릭 불가
  const prev = winners[matchupId];
  if (prev === team) return; // 이미 선택된 팀
  winners[matchupId] = team;
  if (prev !== team) invalidateDownstream(matchupId);
  render();
  updateURL();
}

// ── URL 직렬화 ────────────────────────────────────────────
// 15자 문자열: 0=미선택, 1=teamA 승, 2=teamB 승
function serializeState() {
  return winners.map((w, i) => {
    if (!w) return '0';
    if (w === getTeam(i, true))  return '1';
    if (w === getTeam(i, false)) return '2';
    return '0';
  }).join('');
}

function deserializeState(str) {
  if (!str || str.length !== 15 || !/^[012]+$/.test(str)) return false;
  // 순서대로 처리 (R1 → R2 → R3 → 파이널)
  for (let i = 0; i < 15; i++) {
    const ch = str[i];
    if (ch === '1')      winners[i] = getTeam(i, true);
    else if (ch === '2') winners[i] = getTeam(i, false);
    else                 winners[i] = null;
  }
  return true;
}

function updateURL() {
  const state = serializeState();
  const url = new URL(window.location.href);
  if (state === '000000000000000') {
    url.searchParams.delete('b');
  } else {
    url.searchParams.set('b', state);
  }
  window.history.replaceState({}, '', url.toString());
  updateProgress();
}

// ── 공유 버튼 ─────────────────────────────────────────────
function copyShareURL() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const msg = document.getElementById('copyMsg');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 2000);
  });
}

// ── 초기화 ────────────────────────────────────────────────
function resetBracket() {
  winners.fill(null);
  const url = new URL(window.location.href);
  url.searchParams.delete('b');
  window.history.replaceState({}, '', url.toString());
  render();
  updateProgress();
}

// ── 진행률 ────────────────────────────────────────────────
function updateProgress() {
  const filled = winners.filter(w => w !== null).length;
  const pct = Math.round((filled / 15) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = `예측 완료: ${filled} / 15 경기 (${pct}%)`;
  // 챔피언 표시
  const crown = document.getElementById('championCrown');
  const champName = document.getElementById('championName');
  if (crown && champName) {
    if (winners[14]) {
      crown.classList.add('show');
      champName.textContent = winners[14].name;
    } else {
      crown.classList.remove('show');
      champName.textContent = '';
    }
  }
}

// ── 팀 카드 엘리먼트 생성 ─────────────────────────────────
function createTeamCard(matchupId, isTeamA) {
  const team = getTeam(matchupId, isTeamA);
  const winner = winners[matchupId];
  const otherTeam = getTeam(matchupId, !isTeamA);

  const el = document.createElement('div');
  el.className = 'team-card';

  if (!team) {
    el.classList.add('tbd');
    el.innerHTML = `
      <div class="seed">?</div>
      <div class="team-dot" style="background:#4a5a7a"></div>
      <div class="team-name"><span class="kor">미정 TBD</span></div>`;
    return el;
  }

  if (winner) {
    if (winner === team)        el.classList.add('winner');
    else if (winner === otherTeam) el.classList.add('loser');
  }

  el.innerHTML = `
    <div class="seed">${team.seed}</div>
    <div class="team-dot" style="background:${team.color}"></div>
    <div class="team-name">
      <span class="kor">${team.name}</span>
      <span class="eng">${team.nameEn}</span>
    </div>
    <span class="win-icon">✓</span>`;

  el.addEventListener('click', () => handleTeamClick(matchupId, isTeamA));
  return el;
}

// ── 매치업 엘리먼트 생성 ──────────────────────────────────
function createMatchup(matchupId) {
  const wrap = document.createElement('div');
  wrap.className = 'matchup';
  wrap.dataset.id = matchupId;

  wrap.appendChild(createTeamCard(matchupId, true));
  const divider = document.createElement('div');
  divider.className = 'matchup-divider';
  wrap.appendChild(divider);
  wrap.appendChild(createTeamCard(matchupId, false));
  return wrap;
}

// ── 브라켓 렌더링 ─────────────────────────────────────────
function render() {
  // East R1
  const eastR1 = document.getElementById('eastR1');
  if (eastR1) {
    eastR1.innerHTML = '';
    [0, 1, 2, 3].forEach(id => eastR1.appendChild(createMatchup(id)));
  }
  // East R2
  const eastR2 = document.getElementById('eastR2');
  if (eastR2) {
    eastR2.innerHTML = '';
    [8, 9].forEach(id => eastR2.appendChild(createMatchup(id)));
  }
  // East R3 (CF)
  const eastR3 = document.getElementById('eastR3');
  if (eastR3) {
    eastR3.innerHTML = '';
    eastR3.appendChild(createMatchup(12));
  }
  // West R1
  const westR1 = document.getElementById('westR1');
  if (westR1) {
    westR1.innerHTML = '';
    [4, 5, 6, 7].forEach(id => westR1.appendChild(createMatchup(id)));
  }
  // West R2
  const westR2 = document.getElementById('westR2');
  if (westR2) {
    westR2.innerHTML = '';
    [10, 11].forEach(id => westR2.appendChild(createMatchup(id)));
  }
  // West R3 (CF)
  const westR3 = document.getElementById('westR3');
  if (westR3) {
    westR3.innerHTML = '';
    westR3.appendChild(createMatchup(13));
  }
  // NBA Finals
  const nbaf = document.getElementById('nbaFinals');
  if (nbaf) {
    nbaf.innerHTML = '';
    nbaf.appendChild(createMatchup(14));
  }
  updateProgress();
}

// ── 초기화 ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 스켈레톤 제거
  document.querySelectorAll('.skeleton-placeholder').forEach(el => el.remove());

  // URL에서 상태 복원
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('b');
  if (encoded) deserializeState(encoded);

  render();

  // 버튼 이벤트
  document.getElementById('shareBtn')?.addEventListener('click', copyShareURL);
  document.getElementById('resetBtn')?.addEventListener('click', resetBracket);
});
