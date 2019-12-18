import React, { useState, useEffect } from "react";
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";
import { keyMap } from "../secrets.json";

const mapStyles = [
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            {
                color: "#004358"
            }
        ]
    },
    {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [
            {
                color: "#1f8a70"
            }
        ]
    },
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
            {
                color: "#1f8a70"
            }
        ]
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
            {
                color: "#fd7400"
            }
        ]
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
            {
                color: "#1f8a70"
            },
            {
                lightness: -20
            }
        ]
    },
    {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [
            {
                color: "#1f8a70"
            },
            {
                lightness: -17
            }
        ]
    },
    {
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#ffffff"
            },
            {
                visibility: "on"
            },
            {
                weight: 0.9
            }
        ]
    },
    {
        elementType: "labels.text.fill",
        stylers: [
            {
                visibility: "on"
            },
            {
                color: "#ffffff"
            }
        ]
    },
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
            {
                visibility: "simplified"
            }
        ]
    },
    {
        elementType: "labels.icon",
        stylers: [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [
            {
                color: "#1f8a70"
            },
            {
                lightness: -10
            }
        ]
    },
    {},
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
            {
                color: "#1f8a70"
            },
            {
                weight: 0.7
            }
        ]
    }
];

export function Map({ onPositionChange, userLat, userLong }) {
    const [markerLat, setMarkerLat] = useState(null);
    const [markerLong, setMarkerLong] = useState(null);
    console.log("userLat und Lon gin map: ", userLat, userLong);

    function changeCoordinates(event) {
        console.log("lat", event.latLng.lat());
        console.log("lng", event.latLng.lng());
        setMarkerLat(event.latLng.lat());
        setMarkerLong(event.latLng.lng());
    }
    function setCoordinates(event) {
        setMarkerLat(event.latLng.lat());
        setMarkerLong(event.latLng.lng());
        onPositionChange(markerLat, markerLong);
    }
    useEffect(() => {}, [userLat, userLong, markerLat, markerLong]);

    if (isNaN(userLat) || isNaN(userLong)) {
        return null;
    }

    return (
        <div>
            <GoogleMap
                defaultOptions={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false
                }}
                defaultZoom={12.5}
                defaultCenter={{
                    lat: Math.round(userLat * 10000) / 10000,
                    lng: Math.round(userLong * 10000) / 10000
                }}

                // defaultOptions={{ styles: mapStyles }}
            >
                <Marker
                    key={1}
                    position={{
                        lat: markerLat
                            ? Math.round(markerLat * 10000) / 10000
                            : Math.round(userLat * 10000) / 10000,
                        lng: markerLong
                            ? Math.round(markerLong * 10000) / 10000
                            : Math.round(userLong * 10000) / 10000
                    }}
                    onDrag={event => {
                        setTimeout(() => {
                            changeCoordinates(event);
                        }, 5);
                    }}
                    onDblClick={event => {
                        setCoordinates(event);
                    }}
                    icon={{
                        url: `/img/logo_marker.png`,
                        scaledSize: new window.google.maps.Size(25, 30)
                    }}
                    draggable={true}
                />
            </GoogleMap>
        </div>
    );
}
const MapWrapped = withScriptjs(withGoogleMap(Map));

export default function TestMap({ onPositionChange, userLat, userLong }) {
    return (
        <React.Fragment>
            <div
                style={{
                    width: "100vw",
                    minHeight: "30vh",
                    maxWidth: "600px",
                    height: "200px"
                }}
            >
                <MapWrapped
                    userLat={userLat}
                    userLong={userLong}
                    onPositionChange={onPositionChange}
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${keyMap}`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={
                        <div style={{ height: `100%`, maxWidth: "100%" }} />
                    }
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
        </React.Fragment>
    );
}
