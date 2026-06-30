const mockGenerateTodosRequest = {
  selectedRoute: {
    id: "route_1",
    title: "휴학 후 기업 인턴 경로",
    nodeIds: ["leave", "company_intern", "graduation"],
  },
};

const mockGenerateTodosResponse = {
  success: true,
  data: {
    todos: [
      {
        id: "todo_1",
        title: "휴학 신청 가능 기간 확인하기",
        isDone: false,
      },
      {
        id: "todo_2",
        title: "관심 기업 인턴 공고 10개 리스트업하기",
        isDone: false,
      },
      {
        id: "todo_3",
        title: "이력서와 자기소개서 초안 작성하기",
        isDone: false,
      },
      {
        id: "todo_4",
        title: "포트폴리오에 넣을 프로젝트 2개 선정하기",
        isDone: false,
      },
      {
        id: "todo_5",
        title: "졸업 요건과 복학 시점 확인하기",
        isDone: false,
      },
    ],
  },
};

module.exports = {
  mockGenerateTodosRequest,
  mockGenerateTodosResponse,
};
