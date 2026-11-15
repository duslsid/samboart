const EFFECTIVE_DATE = '2026년 11월 15일'

export default function Privacy() {
  return (
    <div className="privacy-page">
      <h1 className="font-title page-title">개인정보처리방침</h1>

      <div className="font-body privacy-body">
        <p>
          삼보아트(이하 "삼보아트")는 「개인정보 보호법」에 따라 정보주체의 개인정보를 보호하고 이와 관련한
          고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
        </p>

        <section>
          <h2 className="font-sub">1. 개인정보의 처리 목적</h2>
          <p>
            삼보아트는 홈페이지 견적문의를 통해 받은 개인정보를 견적 상담 및 문의에 대한 연락의 목적으로만
            처리하며, 다른 목적으로는 이용하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-sub">2. 처리하는 개인정보의 항목 및 근거</h2>
          <ul>
            <li>필수: 이름, 전화번호, 문의 제품, 문의 내용</li>
            <li>선택: 이메일</li>
            <li>처리 근거: 정보주체의 동의 (「개인정보 보호법」 제15조 제1항 제1호)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-sub">3. 개인정보의 처리 및 보유 기간</h2>
          <p>문의 처리 완료 후 6개월 동안 보유하며, 기간이 지나면 지체 없이 파기합니다.</p>
        </section>

        <section>
          <h2 className="font-sub">4. 개인정보의 파기 절차 및 방법</h2>
          <p>
            보유 기간이 지난 개인정보는 지체 없이 파기합니다. 전자적 파일은 복구할 수 없는 방법으로 삭제하며,
            종이에 출력된 정보는 분쇄하거나 소각합니다. Formspree에 저장된 접수 내용과 받은 이메일도 보유
            기간이 지나면 삭제합니다.
          </p>
        </section>

        <section>
          <h2 className="font-sub">5. 개인정보의 제3자 제공</h2>
          <p>삼보아트는 정보주체의 개인정보를 제3자에게 제공하지 않습니다.</p>
        </section>

        <section>
          <h2 className="font-sub">6. 개인정보의 국외 이전 (처리 위탁)</h2>
          <p>
            삼보아트는 견적문의 접수 및 이메일 전달을 위해 다음과 같이 개인정보 처리업무를 국외 사업자에게
            위탁하고 있습니다.
          </p>
          <ul>
            <li>이전받는 자: Formspree, Inc.</li>
            <li>이전되는 국가: 미국</li>
            <li>이전되는 항목: 2번의 항목 전체</li>
            <li>이전 시기 및 방법: 견적문의 제출 시 인터넷을 통해 전송</li>
            <li>이용 목적: 견적문의 접수 및 삼보아트로의 이메일 전달</li>
            <li>보유·이용 기간: 3번의 보유 기간과 같으며, 기간이 지나면 삼보아트가 삭제합니다</li>
            <li>법적 근거: 「개인정보 보호법」 제28조의8 제1항 제3호</li>
            <li>
              거부 방법 및 효과: 국외 이전을 원하지 않으시면 견적문의 폼 대신 전화(010-4439-4306)로
              문의하실 수 있습니다. 이 경우 폼을 통한 문의는 이용하실 수 없습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-sub">7. 정보주체의 권리와 행사 방법</h2>
          <p>
            정보주체는 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다. 아래
            개인정보 보호책임자에게 전화 또는 이메일로 요청하시면 지체 없이 조치하겠습니다.
          </p>
        </section>

        <section>
          <h2 className="font-sub">8. 개인정보의 안전성 확보 조치</h2>
          <p>
            삼보아트는 개인정보를 처리하는 사람을 최소한으로 제한하고, 문의를 받는 이메일과 접수
            서비스(Formspree) 계정의 비밀번호를 안전하게 관리하며, 보유 기간이 지난 정보는 지체 없이
            파기합니다.
          </p>
        </section>

        <section>
          <h2 className="font-sub">9. 개인정보 자동 수집 장치의 설치·운영 및 거부</h2>
          <p>
            삼보아트 홈페이지는 이용자를 분석하거나 광고하기 위한 쿠키·방문 통계 도구(구글 애널리틱스 등)를
            사용하지 않습니다. 다만 메인 화면 팝업의 '오늘 하루 보지 않기' 선택을 기억하기 위해 이용자의
            브라우저에 날짜 정보를 저장하며, 이는 개인을 식별하는 정보가 아닙니다. 또한 페이지에 포함된 구글
            지도 등 외부 서비스는 해당 사업자의 정책에 따라 쿠키를 사용할 수 있으며, 이용자는 브라우저
            설정에서 쿠키 저장을 거부할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-sub">10. 개인정보 보호책임자</h2>
          <ul>
            <li>성명: 김용관 (대표)</li>
            <li>전화: 010-4439-4306</li>
            <li>이메일: samboart99@naver.com</li>
          </ul>
        </section>

        <section>
          <h2 className="font-sub">11. 권익침해 구제 방법</h2>
          <p>
            개인정보 침해로 인한 구제를 받기 위하여 아래 기관에 분쟁 해결이나 상담 등을 신청할 수 있습니다.
          </p>
          <ul>
            <li>개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
            <li>개인정보침해신고센터: 국번 없이 118 (privacy.kisa.or.kr)</li>
            <li>대검찰청: 국번 없이 1301 (www.spo.go.kr)</li>
            <li>경찰청: 국번 없이 182 (ecrm.police.go.kr)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-sub">12. 개인정보처리방침의 변경</h2>
          <p>이 개인정보처리방침은 {EFFECTIVE_DATE}부터 적용됩니다.</p>
        </section>
      </div>
    </div>
  )
}
