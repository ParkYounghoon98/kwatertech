const facilities = [
  {
    name: '서울 정수장',
    location: { lat: 37.5665, lon: 126.9780 },
    equipment: ['염산 보관', '가성소다 저장', '고압가스 저장']
  },
  {
    name: '부산 정수장',
    location: { lat: 35.1796, lon: 129.0756 },
    equipment: ['황산 저장', '디젤 연료탱크', '인화성 물질 창고']
  },
  {
    name: '대전 정수장',
    location: { lat: 36.3504, lon: 127.3845 },
    equipment: ['유해화학물질 보관소', '위험물 저장탱크', '독성가스 감지기']
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

function searchFacility() {
  document.getElementById('location').textContent = '위치 정보를 가져오는 중...';
  document.getElementById('equipment-list').innerHTML = '';

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const nearest = findNearestFacility(lat, lon);

      if (nearest) {
        document.getElementById('location').innerHTML = `
          가장 가까운 시설: <strong>${nearest.name}</strong> (${nearest.distance} km)
        `;
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

// 실행
searchFacility();
