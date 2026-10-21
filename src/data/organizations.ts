export interface Organization {
  id: string;
  name: string;
  shortName: string;
  english: string;
  logo: string;
  logoWidth: number;
  projects: string[];
}
// public/logos/에 아래 파일명으로 공식 원본을 추가하면 자동 적용됩니다.
// logoWidth는 기관별 시각적 크기 조정용 상한(px)입니다.
export const organizations: Organization[] = [
  {
    id: "weather",
    logo: "logos/kma.png",
    logoWidth: 170,
    name: "기상기후인재개발원",
    shortName: "기상기후인재개발원",
    english: "KMA TRAINING INSTITUTE",
    projects: ["2025년 대국민 기상교육", "2026년 대국민 기상기후교육"],
  },
  {
    id: "science",
    logo: "logos/science-museum.png",
    logoWidth: 170,
    name: "국립중앙과학관",
    shortName: "국립중앙과학관",
    english: "NATIONAL SCIENCE MUSEUM",
    projects: [
      "2025년 과학관 전문인력양성 교육",
      "과학관 전문인력양성 교육체계 및 교육콘텐츠 모델 개발 연구",
    ],
  },
  {
    id: "seoul",
    logo: "logos/garak.png",
    logoWidth: 175,
    name: "서울농수산식품공사",
    shortName: "서울농수산식품공사",
    english: "SEOUL AGRO-FISHERIES & FOOD",
    projects: ["2025년 신입사원 소양교육"],
  },
  {
    id: "ibk",
    logo: "logos/ibk.png",
    logoWidth: 150,
    name: "IBK기업은행",
    shortName: "IBK기업은행",
    english: "INDUSTRIAL BANK OF KOREA",
    projects: ["2026년 IBK기업은행 국외연수(신임책임자)"],
  },
  {
    id: "kiat",
    logo: "logos/kiat.png",
    logoWidth: 165,
    name: "한국산업기술진흥원",
    shortName: "한국산업기술진흥원",
    english: "KOREA INSTITUTE FOR ADVANCEMENT OF TECHNOLOGY",
    projects: ["2026년 교육과정 개발 및 운영"],
  },
  {
    id: "mg",
    logo: "logos/mg.png",
    logoWidth: 155,
    name: "MG새마을금고",
    shortName: "MG새마을금고",
    english: "KOREAN FEDERATION OF COMMUNITY CREDIT COOPERATIVES",
    projects: ["2026년 MG인재개발원 직무교육"],
  },
];
