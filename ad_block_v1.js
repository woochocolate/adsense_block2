// Adsense 광고 클릭 횟수 제한 스크립트
let clickCount = 0;

function isAdsenseAd(el) {
  if (!el) return false;

  // 광고 iframe 태그 체크
  if (el.tagName === 'IFRAME' && el.src && el.src.includes('google')) {
    return true;
  }

  // INS 태그 + data-ad-client 속성 체크
  if (
    el.tagName === 'INS' &&
    el.getAttribute('data-ad-client') &&
    el.getAttribute('data-ad-client').includes('pub-')
  ) {
    return true;
  }

  return false;
}

function addClickCount() {
  let storedCount = localStorage.getItem('adsenseClickCount');
  let count = storedCount ? parseInt(storedCount) : 0;

  if (count <= 2) {
    count++;
    localStorage.setItem('adsenseClickCount', count.toString());
  }

  if (count > 2) {
    const confirmMessage =
      '애드센스 연속 클릭 3회 진행하셨기에 무효트래픽 공격으로 간주됩니다. IP추적 경고.\n악의적인 광고 클릭을 멈추시겠습니까?\n';
    const credit = '머니트잇';
    const userConfirmed = confirm(confirmMessage + '\n' + credit);

    if (!userConfirmed) {
      window.location.replace('https://www.youtube.com/@moneypostit');
    }

    // 초기화
    localStorage.setItem('adsenseClickCount', '0');
  }
}

// blur 이벤트 발생 시, 광고 클릭 확인 및 처리
window.addEventListener('blur', function () {
  const activeEl = document.activeElement;

  if (isAdsenseAd(activeEl)) {
    // 구글 Vignette 광고는 예외 처리
    if (window.location.href.includes('#google_vignette')) return;

    addClickCount();

    // 1ms 후 blur 처리
    setTimeout(() => {
      activeEl.blur();
    }, 1);
  }
});