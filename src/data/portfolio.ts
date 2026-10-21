export const sections = [
  { id: 'about', number: '01', title: 'ABOUT', subtitle: '사람의 가능성에서, 조직의 내일로.', description: '창의적인 기획, 조직에 대한 이해, 그리고 끝까지 완성하는 실행력. COWORK가 지향하는 일의 방식입니다.', items: ['Creativity · 새로운 가치를 기획하는 창의성', 'Organizational Expertise · 조직과 사람을 이해하는 전문성', 'Execution · 기획을 결과로 연결하는 실행력'] },
  { id: 'experience', number: '02', title: 'EXPERIENCE', subtitle: '함께 만들어 온 변화.', description: '경력과 수행 사업에서의 역할, 기간, 성과를 이곳에 기록할 예정입니다.' },
  { id: 'projects', number: '03', title: 'PROJECTS', subtitle: '생각을 실행으로 옮기는 과정.', description: '프로젝트별 배경, 담당 역할, 실행 과정과 성과를 준비하고 있습니다.' },
  { id: 'contact', number: '04', title: 'CONTACT', subtitle: '다음의 가능성을 함께.', description: '연락처와 이력서를 준비하고 있습니다.' },
];
// 실제 값 등록 시에만 연락처 및 다운로드 링크가 나타납니다.
export const contact: { email?: string; resume?: string } = {};
