import React, { useState, useEffect, useRef } from "react";
import { keyMap } from "../secrets.json";

import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";
import { Link } from "react-router-dom";

export function Map({
    filteredDestinations,
    currentDestination,
    handleMarkerClick,
    id
}) {
    const [markers, setMarkers] = useState([{}]);

    useEffect(() => {
        for (let i = 0; i < filteredDestinations.length; i++) {
            setMarkers(markers => {
                return { ...markers, [i]: false };
            });
        }
    }, []);

    filteredDestinations.map(dest => {
        console.log(dest);
    });
    let url = `/img/standard_empty.png`;
    let filteredDestinationsWithoutId = [];
    let destinationWithId = [];
    filteredDestinations.forEach(item => {
        if (item.id !== currentDestination.id) {
            filteredDestinationsWithoutId.push(item);
        } else {
            destinationWithId.push(item);
        }
    });
    // filteredDestinationsWithoutId.map(dest => {
    //     console.log("without id: ", dest);
    // });
    console.log(
        "filteredDestinationsWithoutId ",
        filteredDestinationsWithoutId
    );
    console.log("destinationWitId ", destinationWithId);
    let latCurrent = Math.round(currentDestination.lat * 10000) / 10000;
    let longCurrent = Math.round(currentDestination.long * 10000) / 10000;

    let userLat = 52.5024756;
    let userLong = 13.4850351;

    // function handleMarkerClick(id) {
    //     console.log("dest.id - showINfo: ", id);
    //     console.log("marrkers: ", markers);
    //     // location.href = "/details/" + id;
    // }
    return (
        <div>
            <GoogleMap
                defaultOptions={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false
                }}
                defaultZoom={13}
                defaultCenter={{ lat: latCurrent, lng: longCurrent }}
                filteredDestinations={filteredDestinations}
                id={id}

                // defaultOptions={{ styles: mapStyles }}
            >
                <Marker
                    key={100000}
                    position={{
                        lat: userLat,
                        lng: userLong
                    }}
                    icon={{
                        url: "/img/home.png",
                        scaledSize: new window.google.maps.Size(26, 32)
                    }}
                    zIndex={1}
                ></Marker>
                <Marker
                    key={id}
                    position={{
                        lat: latCurrent,
                        lng: longCurrent
                    }}
                    icon={{
                        url: "/img/logo_marker.png",
                        scaledSize: new window.google.maps.Size(27, 32)
                    }}
                    zIndex={3}
                ></Marker>
                {filteredDestinationsWithoutId.map(dest => (
                    <Link
                        to={{ pathname: "/details/" + dest.id }}
                        key={dest.id}
                    >
                        <Marker
                            title={dest.title}
                            position={{
                                lat: Math.round(dest.lat * 10000) / 10000,
                                lng: Math.round(dest.long * 10000) / 10000
                            }}
                            onClick={() => {
                                // location.href = "/details/" + dest.id;
                                handleMarkerClick(dest.id);
                            }}
                            onMouseOver={() => {
                                setMarkers(markers => {
                                    return { ...markers, [dest.id]: true };
                                });
                            }}
                            onMouseOut={() => {
                                setTimeout(() => {
                                    setMarkers(markers => {
                                        return { ...markers, [dest.id]: false };
                                    });
                                }, 2500);
                            }}
                            icon={{
                                url: url,
                                scaledSize: new window.google.maps.Size(16, 20)
                            }}
                            zIndex={2}
                        ></Marker>
                    </Link>
                ))}
            </GoogleMap>
        </div>
    );
}
const MapWrapped = withScriptjs(withGoogleMap(Map));

export default function DetailMap({
    filteredDestinations,
    currentDestination,
    handleMarkerClick,
    id
}) {
    return (
        <React.Fragment>
            <div style={{ width: "100vw", height: "60vh" }}>
                <MapWrapped
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${keyMap}`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    filteredDestinations={filteredDestinations}
                    currentDestination={currentDestination}
                    handleMarkerClick={handleMarkerClick}
                    id={id}
                />
            </div>
        </React.Fragment>
    );
}
