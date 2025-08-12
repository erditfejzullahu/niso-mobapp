// import polyline from "@mapbox/polyline";
// import { Camera, LineLayer, MapView, PointAnnotation, ShapeSource } from "@maplibre/maplibre-react-native";
// import { MapPin } from "lucide-react-native";
// import React, { useEffect, useState } from "react";
// import { StyleSheet, View } from "react-native";

// type Coord = [number, number]; // [lng, lat]
// type OSRMRouteResponse = {
//   routes: {
//     geometry: string;
//     legs: { steps: any[] }[];
//   }[];
// };

// const MAP_STYLE = "https://demotiles.maplibre.org/style.json"; // Open source style
// const OSRM_BASE_URL = "https://router.project-osrm.org"; // Public demo server

// export default function MapScreen() {
//   const [routeCoords, setRouteCoords] = useState<Coord[]>([]);

//   // Example pickup & destination (New York)
//   const pickup: Coord = [-73.9857, 40.7484]; // Empire State
//   const destination: Coord = [-73.9851, 40.7589]; // Times Square

//   useEffect(() => {
//     fetchRoute(pickup, destination);
//   }, []);

//   const fetchRoute = async (start: Coord, end: Coord) => {
//     try {
//       const coordsString = `${start[0]},${start[1]};${end[0]},${end[1]}`;
//       const url = `${OSRM_BASE_URL}/route/v1/driving/${coordsString}?overview=full&geometries=polyline&steps=true`;

//       const res = await fetch(url);
//       const data: OSRMRouteResponse = await res.json();

//       if (data.routes && data.routes.length > 0) {
//         const decoded = polyline.decode(data.routes[0].geometry) as [number, number][];
//         // polyline gives [lat, lng], MapLibre expects [lng, lat]
//         const coordsLngLat: Coord[] = decoded.map(([lat, lng]) => [lng, lat]);
//         setRouteCoords(coordsLngLat);

//         console.log("Turn-by-turn steps:", data.routes[0].legs[0].steps);
//       }
//     } catch (error) {
//       console.error("Error fetching route", error);
//     }
//   };

//   return (
//     <View style={styles.page}>
//       <MapView style={styles.map} styleURL={MAP_STYLE}>
//         <Camera
//           zoomLevel={14}
//           centerCoordinate={pickup}
//         />

//         {/* Pickup Marker */}
//         <PointAnnotation children={<><MapPin /></>} id="pickup" coordinate={pickup} />

//         {/* Destination Marker */}
//         <PointAnnotation children={<><MapPin /></>} id="destination" coordinate={destination} />

//         {/* Route Line */}
//         {routeCoords.length > 0 && (
//           <ShapeSource
//             id="routeSource"
//             shape={{
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: routeCoords,
//               },
//             }}
//           >
//             <LineLayer
//               id="routeLine"
//               style={{
//                 lineColor: "#3b82f6",
//                 lineWidth: 4,
//               }}
//             />
//           </ShapeSource>
//         )}
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   page: { flex: 1 },
//   map: { flex: 1 },
// });
import React from 'react'
import { Text, View } from 'react-native'

const index = () => {
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index