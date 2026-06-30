// 한준이 API 응답 구조에 맞춰서 나중에 그대로 교체하면 됩니다.
// routes 배열 안에 각 경로의 모든 정보가 들어있는 구조예요.

export const mockRoutes = [
  {
    id: "A",
    title: "재학 + 인턴 준비",
    description: "가을 학기 유지하며\n겨울 인턴에 도전해요",
    tag: "현실성 높음",
    color: {
      main: "#4A7CFF",
      bgSoft: "#F5F8FF",
      tagBg: "#DBEAFE",
      tagText: "#1D4ED8",
    },
    pros: ["졸업 시점 유지 가능", "인턴 실무 경험 획득", "전공 연속성 유지"],
    cons: ["인턴 합격 보장 없음", "학업·취준 병행 부담"],
    risk: {
      level: "yellow",
      label: "보통",
      reasons: ["인턴 불합격 가능", "학점 관리 병행 필요"],
    },
    taskLoad: {
      level: "yellow",
      label: "보통",
      tasks: ["인턴 지원서 작성", "포트폴리오 업데이트", "면접 준비"],
    },
    fallback: {
      level: "green",
      label: "많음",
      options: [
        "다음 학기 재지원",
        "교내 프로젝트 전환",
        "포트폴리오 강화 집중",
      ],
    },
  },
  {
    id: "B",
    title: "재학 + 교환학생 준비",
    description: "가을 학기 유지하며\n교환학생을 준비해요",
    tag: "글로벌 경험 확장",
    color: {
      main: "#3DB56A",
      bgSoft: "#F3FBF6",
      tagBg: "#DCFCE7",
      tagText: "#15803D",
    },
    pros: [
      "글로벌 네트워크 형성",
      "언어·문화 역량 강화",
      "새로운 커리어 방향 탐색",
    ],
    cons: ["교환 비용 추가 발생", "국내 인턴 시기 놓침", "준비 항목 많음"],
    risk: {
      level: "yellow",
      label: "보통",
      reasons: ["교환 선발 탈락 가능", "비용 초과 리스크"],
    },
    taskLoad: {
      level: "red",
      label: "많음",
      tasks: ["교환 지원서 작성", "어학 점수 준비", "교환 비용 계획 수립"],
    },
    fallback: {
      level: "yellow",
      label: "보통",
      options: ["국내 인턴 전환", "다음 교환 기수 재지원"],
    },
  },
  {
    id: "C",
    title: "휴학 + 포트폴리오 강화",
    description: "한 학기 휴학하고\n포트폴리오를 집중적으로 쌓아요",
    tag: "성장 집중",
    color: {
      main: "#F5A623",
      bgSoft: "#FFFBF3",
      tagBg: "#FEF3C7",
      tagText: "#92400E",
    },
    pros: ["포트폴리오 집중 강화", "등록금 절감 가능", "자기 주도 일정 운영"],
    cons: [
      "졸업 시점 늦춰질 수 있음",
      "자기관리 실패 리스크",
      "공백 설명 필요",
    ],
    risk: {
      level: "red",
      label: "위험",
      reasons: [
        "졸업 지연 가능성",
        "동기부여 유지 어려움",
        "취업 공백 인식 리스크",
      ],
    },
    taskLoad: {
      level: "green",
      label: "적음",
      tasks: ["휴학 신청 처리", "포트폴리오 계획 수립"],
    },
    fallback: {
      level: "yellow",
      label: "보통",
      options: ["복학 후 재도전", "방향 전환 후 취업 준비"],
    },
  },
];
