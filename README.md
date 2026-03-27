# NBA 플레이오프 2026 브라켓 예측기

2026 NBA 플레이오프 대진표를 직접 채우고 URL로 친구와 공유하는 인터랙티브 브라켓 예측 도구.

## 앱 개요

- **슬러그**: `nba-bracket-2026`
- **언어**: 한국어 UI
- **기술 스택**: 순수 HTML + CSS + Vanilla JS (단일 파일 구조)
- **외부 의존성**: Google Fonts (Noto Sans KR) — CDN

## 주요 기능

| 기능 | 설명 |
|------|------|
| 브라켓 클릭 예측 | 팀 카드 클릭 → 자동 다음 라운드 진출 |
| URL 공유 | `?b=XXXXXXXXXXXXXXX` 15자 상태 인코딩 |
| 브라켓 복원 | URL 직접 접근 시 상태 자동 복원 |
| 진행률 표시 | 15경기 예측 완료율 진행바 |
| 챔피언 표시 | 파이널 완료 시 트로피 + 팀명 |
| 전체 초기화 | 버튼 한 번으로 전체 리셋 |

## 파일 구조

```
current_app/
├── index.html    # 메인 진입점 (AdSense placeholder 포함)
├── style.css     # 브라켓 레이아웃 + 디자인 토큰
├── app.js        # 브라켓 로직 + URL 직렬화
├── teams.js      # 16개 팀 정적 데이터 (2025-26 추정)
├── README.md     # 이 파일
└── DONE          # 완료 신호
```

## 팀 데이터 업데이트

`teams.js`의 팀 데이터는 2025-26 시즌 추정치입니다. 실제 플레이오프 진출팀 확정 후 (~2026-04-14) 아래 필드를 업데이트하세요:

```javascript
// teams.js
const TEAMS = {
  east: [
    { seed: 1, name: '팀 한국명', nameEn: 'Team English', abbr: 'ABC', color: '#RRGGBB' },
    // ...
  ],
  west: [ /* 동일 구조 */ ]
};
```

## 배포 방법

### Vercel (권장)

```bash
# 1. GitHub 저장소에 푸시
git init && git add . && git commit -m "NBA bracket 2026"
git remote add origin https://github.com/your-name/nba-bracket-2026.git
git push -u origin main

# 2. vercel.com 에서 Import → 자동 배포
# 3. 도메인: nba-bracket-2026.vercel.app (무료)
```

### GitHub Pages

```bash
# Settings → Pages → Source: Deploy from branch (main / root)
# URL: https://your-name.github.io/nba-bracket-2026/
```

## AdSense 적용 방법

### 1단계: AdSense 코드 삽입

**헤더 (`index.html` `<head>` 안)**:
```html
<!-- ADSENSE_HEAD 주석을 아래로 교체 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

**슬롯 1 (헤더 하단) — `<!-- ADSENSE_SLOT_1 -->` 교체**:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

**슬롯 2 (하단) — `<!-- ADSENSE_SLOT_2 -->` 교체**:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="YYYYYYYYYY"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

### 2단계: Google Search Console 등록

1. [Google Search Console](https://search.google.com/search-console) → 속성 추가
2. URL prefix: `https://your-domain.com`
3. `sitemap.xml` 제출 (선택)

## 예상 수익 키워드

- `NBA 플레이오프 2026 대진표`
- `NBA 브라켓 예측`
- `NBA playoff bracket 2026`

> 참고: 올해(2026) AdSense 수익은 구글 색인 시간 부족으로 미미할 수 있습니다. 에펨코리아/NBA 커뮤니티 바이럴을 통한 직접 유입 전략이 효과적입니다. 내년 시즌 SEO 장기 플레이를 권장합니다.

## 기술 메모

- URL 상태 인코딩: 15자 문자열 (`0`=미선택, `1`=팀A승, `2`=팀B승)
- 하위 매치업 자동 무효화: 상위 라운드 변경 시 의존 매치업 초기화
- 로딩 시간: ~12ms (로컬 기준), 실 배포 시 CDN 사용 시 빠름
