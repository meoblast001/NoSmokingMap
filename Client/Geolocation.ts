export function getCurrentPosition(options: PositionOptions): Promise<GeolocationPosition> {
  if (!('geolocation' in navigator))
    return Promise.reject('Geolocation not supported by browser');

  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => resolve(position),
      (error: GeolocationPositionError) => reject(error),
      options);
  });
}