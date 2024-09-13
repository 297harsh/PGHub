import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const googleMapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Define the libraries array outside the component so it doesn't trigger reloading
const libraries = ["marker"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const MyGoogleMap = ({ gMapLocation = null, zoomLevel = 15 }) => {
  const [zoomValue, setZoomValue] = useState(10);
  let center;
  
  if (gMapLocation != null) {
    center = {
      lat: Number(gMapLocation.lat),
      lng: Number(gMapLocation.lng),
    };
  } else {
    center = {
      lat: 22.54109841178252,
      lng: 73.4447193145752,
    };
  }

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapApiKey}&libraries=places&async=1&defer=1`;
      script.async = true;
      script.defer = true; // ensure it's loaded asynchronously
      script.onload = () => {
        loadAdvancedMarker();
      };
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMaps();
    } else {
      loadAdvancedMarker();
    }
  }, []);

  useEffect(() => {
    let zoomInterval;
    if (zoomValue < zoomLevel) {
      zoomInterval = setInterval(() => {
        setZoomValue((prevZoom) => prevZoom + 1);
      }, 1000);
    }

    return () => clearInterval(zoomInterval);
  }, [zoomValue, zoomLevel]);

  useEffect(() => {
    const loadAdvancedMarker = async () => {
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: zoomValue,
        center: center,
        mapId: "DEMO_MAP_ID",
      });

      // Create and add the advanced marker
      new AdvancedMarkerElement({
        map: map,
        position: center,
        title: 'Location Marker',
      });
    };

    loadAdvancedMarker();
  }, [center, zoomValue]);

  return (
    <LoadScript googleMapsApiKey={googleMapApiKey} libraries={libraries}>
      <div id="map" style={mapContainerStyle}></div>
    </LoadScript>
  );
};

export default MyGoogleMap;
