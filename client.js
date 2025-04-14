const facilities = [
  {
    name: '서울 정수장',
    location: { lat: 37.5665, lon: 126.9780 },
    equipment: ['펌프', '여과기', '제어반']
  },
  {
    name: '부산 정수장',
    location: { lat: 35.1796, lon: 129.0756 },
    equipment: ['유량계', '정수기', '압력센서']
  },
  {
    name: '대전 정수장',
    location: { lat: 36.3504, lon: 127.3845 },
    equipment: ['모터', '센서', '필터']
  }
];

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestFacility(lat, lon) {
  let nearest = null;
  let minDist = Infinity;

  facilities.forEach(facility => {
    const dist = getDistance(lat, lon, facility.location.lat, facility.location.lon);
    if (dist < minDist) {
      minDist = dist;
      nearest = { ...facility, distance: dist.toFixed(2) };
    }
  });

  return nearest;
}

function displayEquipment(equipment) {
  const list = document.getElementById('equipment-list');
  list.innerHTML = '';
  equipment.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `- ${item}`;
    list.appendChild(li);
  });
}

function goToFacility(name) {
  const encoded = encodeURIComponent(name);
  window.location.href = `facility.html?name=${encoded}`;
}

function showLocationInfo(lat, lon, facility) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const address = data.display_name || '알 수 없는 위치';
      document.getElementById('location').innerHTML = `
        현재 위치: ${address}<br>
        가장 가까운 시설: 
        <span class="facility-link" onclick="goToFacility('${facility.name}')">
          ${facility.name}
        </span> (${facility.distance} km)
      `;
    })
    .catch(() => {
      document.getElementById('location').innerHTML = `
        가장 가까운 시설: 
        <span class="facility-link" onclick="goToFacility('${facility.name}')">
          ${facility.name}
        </span> (${facility.distance} km)
      `;
    });
}

function searchFacility() {
  document.getElementById('location').textContent = '위치 정보를 불러오는 중...';
  document.getElementById('equipment-list').innerHTML = '';

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const nearest = findNearestFacility(lat, lon);

      if (nearest) {
        showLocationInfo(lat, lon, nearest);
        displayEquipment(nearest.equipment);
      } else {
        document.getElementById('location').textContent = '근처 시설을 찾을 수 없습니다.';
      }
    },
    () => {
      document.getElementById('location').textContent = '위치 정보를 가져올 수 없습니다.';
    }
  );
}

// 버튼 이벤트
document.getElementById('retry-btn').addEventListener('click', searchFacility);
document.getElementById('emergency-btn').addEventListener('click', () => {
  alert('119에 신고되었습니다.');
});
document.getElementById('police-btn').addEventListener('click', () => {
  alert('112에 신고되었습니다.');
});

// 최초 실행
searchFacility();
