// 위치 정보를 가져오는 예시 (Geolocation API 사용)
navigator.geolocation.getCurrentPosition(function(position) {
  const userLat = position.coords.latitude;
  const userLon = position.coords.longitude;

  // 위치 정보 페이지에 표시
  document.getElementById('location').textContent = `위도: ${userLat}, 경도: ${userLon}`;
}, function(error) {
  if (error.code === error.PERMISSION_DENIED) {
    document.getElementById('location').textContent = '위치 정보에 대한 접근이 거부되었습니다.';
  } else {
    document.getElementById('location').textContent = '위치 정보를 가져오는 데 실패했습니다.';
  }
});

// 긴급 신고 버튼 클릭 시 이벤트
document.getElementById('emergency-btn').addEventListener('click', function() {
  window.location.href = "tel:119"; // 119 전화 걸기
});

document.getElementById('police-btn').addEventListener('click', function() {
  window.location.href = "tel:112"; // 112 전화 걸기
});

// 유해 화학 물질 추가 폼 처리
document.getElementById('chemical-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('chemical-name').value;
  const content = document.getElementById('chemical-content').value;
  const inflame = document.getElementById('chemical-inflame').value;
  const explosion = document.getElementById('chemical-explosion').value;
  const volume = document.getElementById('chemical-volume').value;

  const newChemical = `
    <li>
      <strong>${name}</strong>: 함유량: ${content}, 인화점: ${inflame}, 폭발 범위: ${explosion}, 용량: ${volume}
    </li>
  `;
  document.getElementById('hazardous-chemicals-list').innerHTML += newChemical;
});
