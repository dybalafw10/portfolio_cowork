export function Navigation() {
  return <header className="navigation"><a className="portfolio-link" href="#home" aria-label="포트폴리오 첫 화면">PORTFOLIO<span className="nav-square" /></a><nav aria-label="주 메뉴">{['ABOUT', 'EXPERIENCE', 'PROJECTS', 'CONTACT'].map(item => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav></header>;
}
