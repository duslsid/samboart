const INTRO = [
  '안녕하세요.',
  '항상 삼보아트를 찾아주셔서 진심으로 감사드립니다.',
  '삼보상사로 시작해 40여 년 동안 성장하며 지금의 삼보아트로 자리 잡았습니다.',
  '늘 고객의 입장에서 먼저 생각하며 쓰기 편하고 튼튼하면서도 마음에 쏙 드는 제품을 만들고자 했습니다.',
  '또한 고객의 신뢰를 지키겠다는 마음 하나로 성실하게 달려왔습니다.',
  '앞으로도 고객의 마음을 세심하게 헤아려 더 좋은 제품으로 보답하겠습니다.',
  '변함없는 관심과 사랑 부탁드립니다.',
  '감사합니다.',
].join('\n')

export default function About() {
  return (
    <div className="about-page">
      <h1 className="font-title page-title">회사소개</h1>
      <p className="font-body about-intro">{INTRO}</p>
    </div>
  )
}
