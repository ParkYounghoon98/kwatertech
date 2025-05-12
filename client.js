// 위치 정보 가져오기
navigator.geolocation.getCurrentPosition(function(position) {
  const userLat = position.coords.latitude;
  const userLon = position.coords.longitude;

  getLocationName(userLat, userLon);

  const nearestFacility = findNearestFacility(userLat, userLon);
  if (nearestFacility) {
    document.getElementById('location').textContent = `위치 ${nearestFacility.name} (${nearestFacility.location.lat}, ${nearestFacility.location.lon})`;
    displayEquipment(nearestFacility.equipment);
  } else {
    document.getElementById('location').textContent = '근처에 시설을 찾을 수 없습니다.';
  }
}, function(error) {
  document.getElementById('location').textContent = '위치 정보를 가져올 수 없습니다.';
});

// 위치 이름 가져오기 (Nominatim)
function getLocationName(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const locationName = data.display_name;
      document.getElementById('location').textContent = `위치 ${locationName} (위도 ${lat}, 경도 ${lon})`;
    })
    .catch(() => {
      document.getElementById('location').textContent = '위치 정보를 가져올 수 없습니다.';
    });
}

// 거리 계산
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 가장 가까운 시설 찾기
function findNearestFacility(userLat, userLon) {
  const facilities = [
    {
      name: '약품투입동',
      location: { lat: 37.5665, lon: 126.9780 },
      equipment: ['차염탱크', '수산화칼슘 보관함']
    }
  ];

  let nearestFacility = null;
  let minDistance = Infinity;

  facilities.forEach(facility => {
    const distance = getDistance(userLat, userLon, facility.location.lat, facility.location.lon);
    if (distance < minDistance) {
      nearestFacility = facility;
      minDistance = distance;
    }
  });

  return nearestFacility;
}

// 설비 표시
function displayEquipment(equipment) {
  const list = document.getElementById('equipment-list');
  list.innerHTML = '';
  equipment.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}
