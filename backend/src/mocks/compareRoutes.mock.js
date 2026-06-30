const mockCompareRoutesRequest = {
  goal: {
    title: "2028년 2월 졸업",
    deadline: "2028-02",
  },
  criteria: [
    "졸업 시점 유지",
    "실무 경험",
    "리스크",
    "지금 해야 할 일 부담",
    "실패 시 대안",
  ],
  nodes: [
    {
      id: "leave",
      title: "휴학",
      type: "status",
      description: "학업을 잠시 중단하고 다른 활동에 집중하는 선택지입니다.",
      estimatedMonths: 6,
    },
    {
      id: "company_intern",
      title: "기업 인턴",
      type: "experience",
      description: "기업에서 실무 경험을 쌓는 선택지입니다.",
      estimatedMonths: 6,
    },
    {
      id: "graduation",
      title: "졸업",
      type: "goal",
      description: "최종 목표인 2028년 2월 졸업입니다.",
      estimatedMonths: 0,
    },
  ],
  routes: [
    {
      id: "route_1",
      title: "휴학 후 기업 인턴 경로",
      nodeIds: ["leave", "company_intern", "graduation"],
    },
  ],
};

const mockCompareRoutesResponse = {
  success: true,
  data: {
    comparisons: [
      {
        routeId: "route_1",
        title: "휴학 후 기업 인턴 경로",
        summary:
          "휴학을 통해 시간을 확보한 뒤 기업 인턴에 집중하고, 이후 졸업을 목표로 하는 경로입니다.",
        pros: [
          "기업 실무 경험을 집중적으로 쌓을 수 있습니다.",
          "취업 준비에 활용할 수 있는 경험과 이력서를 만들기 좋습니다.",
          "휴학 기간 동안 인턴 준비와 지원에 충분한 시간을 확보할 수 있습니다.",
        ],
        cons: [
          "졸업 시점이 늦어질 가능성이 있습니다.",
          "인턴 합격 여부에 따라 계획이 흔들릴 수 있습니다.",
          "학업 흐름이 끊길 수 있습니다.",
        ],
        risk: {
          level: "보통",
          color: "yellow",
          reasons: [
            "인턴 합격 여부가 불확실합니다.",
            "휴학 기간이 길어지면 졸업 일정에 영향을 줄 수 있습니다.",
            "복학 후 학업 적응이 필요할 수 있습니다.",
          ],
        },
        workload: {
          level: "많음",
          color: "red",
          tasks: [
            "기업 인턴 공고 탐색",
            "이력서 및 자기소개서 작성",
            "포트폴리오 정리",
          ],
        },
        fallback: {
          level: "보통",
          color: "yellow",
          alternatives: [
            "단기 프로젝트로 실무 경험 보완",
            "재학 중 인턴 또는 현장실습 지원",
            "교내 산학협력 프로그램 참여",
          ],
        },
      },
    ],
  },
};

module.exports = {
  mockCompareRoutesRequest,
  mockCompareRoutesResponse,
};
