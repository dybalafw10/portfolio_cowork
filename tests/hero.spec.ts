import { test, expect } from '@playwright/test';
test('기관 선택, 사업명, 키보드와 반응형 레이아웃', async ({ page }, info) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'COWORK.' })).toBeVisible();
  const buttons = page.getByRole('button', {name:/수행 사업/});
  await expect(buttons).toHaveCount(6);
  await expect(page.locator('.organization-projects:visible')).toHaveCount(0);
  if(info.project.name === 'desktop') await buttons.nth(0).hover({force:true});
  else await buttons.nth(0).tap({force:true});
  await expect(buttons.nth(0)).toHaveAttribute('aria-expanded','true');
  await expect(page.getByText('2025년 대국민 기상교육',{exact:true})).toBeVisible();
  if(info.project.name === 'desktop') await buttons.nth(1).hover({force:true});
  else await buttons.nth(1).tap({force:true});
  await expect(buttons.nth(0)).toHaveAttribute('aria-expanded','false');
  await expect(page.getByText('과학관 전문인력양성 교육체계 및 교육콘텐츠 모델 개발 연구',{exact:true})).toBeVisible();
  await buttons.nth(2).focus();
  await page.keyboard.press('Enter');
  await expect(buttons.nth(2)).toHaveAttribute('aria-expanded','true');
  await expect(page.getByText('2025년 신입사원 소양교육',{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const boxes = await page.locator('.organization').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}}));
  for(let i=0;i<boxes.length;i++) for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];expect(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y).toBe(true)}
  await page.screenshot({path:`test-results/${info.project.name}-hero.png`,fullPage:true});
});
test('모션 감소 설정',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('./');
  await expect(page.locator('.floating-mark').first()).toHaveCSS('animation-name','none');
});
