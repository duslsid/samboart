const PC_TEXT = `상호  삼보아트  ㅣ  대표자  김용관  ㅣ  사업자등록번호  139-06-02967
주소  인천시 남동구 인주대로 725, 1층 삼보인테리어
HP  010-4439-4306  ㅣ  전화  032-465-1933  ㅣ  팩스  032-465-1934
이메일  yesart99@hanmail.net
입금계좌  신한은행 110-017-450551 김용관(삼보아트)`

const MO_TEXT = `상호  삼보아트  ㅣ  대표자  김용관
사업자등록번호  139-06-02967
주소  인천시 남동구 인주대로 725, 1층 삼보인테리어
HP  010-4439-4306
전화  032-465-1933  ㅣ  팩스  032-465-1934
이메일  yesart99@hanmail.net
입금계좌  신한은행 110-017-450551 김용관(삼보아트)`

export default function Footer() {
  return (
    <footer className="footer font-footer">
      <div className="container">
        <div className="footer-pc">{PC_TEXT}</div>
        <div className="footer-mo">{MO_TEXT}</div>
      </div>
    </footer>
  )
}
