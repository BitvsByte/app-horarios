import { useState, useEffect } from 'react';
import { WORK_LOCATION } from '../config/location';

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

export const useGeolocation = () => {
  const [location] = useState(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log('Ubicación actual específica:', {
          latitude: currentLocation.latitude.toFixed(5),
          longitude: currentLocation.longitude.toFixed(5)
        });
        console.log('Ubicación objetivo específica:', {
          latitude: WORK_LOCATION.latitude.toFixed(5),
          longitude: WORK_LOCATION.longitude.toFixed(5)
        });

        const distance = getDistanceFromLatLonInMeters(
          currentLocation.latitude,
          currentLocation.longitude,
          WORK_LOCATION.latitude,
          WORK_LOCATION.longitude
        );
        
        console.log('Distancia exacta:', distance.toFixed(2), 'metros');
        console.log('Coordenadas comparación:', {
          currentLat: currentLocation.latitude,
          currentLng: currentLocation.longitude,
          targetLat: WORK_LOCATION.latitude,
          targetLng: WORK_LOCATION.longitude
        });

        setIsWithinRange(distance <= WORK_LOCATION.radius);
      },
      (err) => {
        console.error('Error específico de geolocalización:', err);
        setError(err);
      },
      { 
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, isWithinRange, error };
};

export default useGeolocation;