// 사용자의 현재 위치 가져오기
navigator.geolocation.getCurrentPosition(function(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
  
    // Nominatim API를 사용하여 위치 이름 가져오기
    getLocationName(userLat, userLon);
  
    // 가까운 시설을 찾는 함수
    function findNearestFacility(userLat, userLon) {
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
  
    // 두 지점 간 거리 계산 함수 (단위: km)
    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // 지구 반지름 (km)
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }
  
    // 현재 위치에 가장 가까운 시설 찾기
    const nearestFacility = findNearestFacility(userLat, userLon);
    if (nearestFacility) {
      document.getElementById('location').textContent = `위치: ${nearestFacility.name} (${nearestFacility.location.lat}, ${nearestFacility.location.lon})`;
      displayEquipment(nearestFacility.equipment);
    } else {
      document.getElementById('location').textContent = '근처에 시설을 찾을 수 없습니다.';
    }
  
    // 설비물 정보 표시하기
    function displayEquipment(equipment) {
      const equipmentList = document.getElementById('equipment-list');
      equipmentList.innerHTML = '';
      equipment.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        equipmentList.appendChild(li);
      });
    }
  
  }, function(error) {
    document.getElementById('location').textContent = '위치 정보를 가져올 수 없습니다.';
  });
  
  // Nominatim API를 사용하여 위치 이름 가져오기
  function getLocationName(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const locationName = data.display_name;
        document.getElementById('location').textContent = `위치: ${locationName} (위도: ${lat}, 경도: ${lon})`;
      })
      .catch(error => {
        console.error('위치 이름을 가져오는 중 오류 발생:', error);
        document.getElementById('location').textContent = '위치 정보를 가져올 수 없습니다.';
      });
  }
  
