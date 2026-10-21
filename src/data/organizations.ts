export interface Organization {
  id: string;
  name: string;
  shortName: string;
  english: string;
  logo?: string;
  projects: string[];
}
// 공식 로고 확보 후 logo: 'logos/파일명.svg' 추가. public/ 기준 상대 경로를 사용합니다.
export const organizations: Organization[] = [
  { id: 'weather', name: '기상기후인재개발원', shortName: '기상기후인재개발원', english: 'KMA TRAINING INSTITUTE', projects: ['2025년 대국민 기상교육', '2026년 대국민 기상기후교육'] },
  { id: 'science', name: '국립중앙과학관', shortName: '국립중앙과학관', english: 'NATIONAL SCIENCE MUSEUM', projects: ['2025년 과학관 전문인력양성 교육', '과학관 전문인력양성 교육체계 및 교육콘텐츠 모델 개발 연구'] },
  { id: 'seoul', name: '서울농수산식품공사', shortName: '서울농수산식품공사', english: 'SEOUL AGRO-FISHERIES & FOOD', projects: ['2025년 신입사원 소양교육'] },
  { id: 'ibk', name: 'IBK기업은행', shortName: 'IBK기업은행', english: 'INDUSTRIAL BANK OF KOREA', projects: ['2026년 IBK기업은행 국외연수(신임책임자)'] },
  { id: 'kiat', name: '한국산업기술진흥원', shortName: '한국산업기술진흥원', english: 'KOREA INSTITUTE FOR ADVANCEMENT OF TECHNOLOGY', projects: ['2026년 교육과정 개발 및 운영'] },
  { id: 'mg', name: 'MG새마을금고', shortName: 'MG새마을금고', english: 'KOREAN FEDERATION OF COMMUNITY CREDIT COOPERATIVES', projects: ['2026년 MG인재개발원 직무교육'] },
];
