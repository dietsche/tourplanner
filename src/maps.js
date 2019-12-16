import React, { useEffect, useRef } from "react";
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";

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

export function Map({ onPositionChange }) {
    let lat;
    let long;

    function getPosition(event) {
        console.log("lat", event.latLng.lat());
        console.log("lng", event.latLng.lng());
        lat = event.latLng.lat();
        long = event.latLng.lng();
        onPositionChange(lat, long);
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
                defaultCenter={{ lat: 52.5024756, lng: 13.4850351 }}

                // defaultOptions={{ styles: mapStyles }}
            >
                <Marker
                    key={1}
                    position={{
                        lat: 52.5024756,
                        lng: 13.4850351
                    }}
                    onDblClick={event => {
                        getPosition(event);
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

export default function TestMap({ onPositionChange }) {
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
                    onPositionChange={onPositionChange}
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBRGDY9ghWbWBS-JTTlxf2UdtwR8cPaJus`}
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
