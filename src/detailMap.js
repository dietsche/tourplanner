import React, { useState, useEffect, useRef } from "react";

import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";
import { Link } from "react-router-dom";

export function Map({ filteredDestinations, id }) {
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
    let url = `/img/robin.png`;
    let filteredDestinationsWithoutId = [];
    filteredDestinations.forEach((item, index) => {
        if (index !== id - 1) {
            filteredDestinationsWithoutId.push(item);
        }
    });
    filteredDestinationsWithoutId.map(dest => {
        console.log("without id: ", dest);
    });
    console.log(
        "filteredDestinationsWithoutId ",
        filteredDestinationsWithoutId
    );
    let latCurrent =
        Math.round(filteredDestinations[id - 1].lat * 10000) / 10000;
    let longCurrent =
        Math.round(filteredDestinations[id - 1].long * 10000) / 10000;

    function handleMarkerClick(id) {
        console.log("dest.id - showINfo: ", id);
        console.log("marrkers: ", markers);
    }
    return (
        <div>
            <GoogleMap
                defaultOptions={{
                    streetViewControl: false,
                    mapTypeControl: false
                }}
                defaultZoom={11}
                defaultCenter={{ lat: latCurrent, lng: longCurrent }}
                filteredDestinations={filteredDestinations}
                id={id}

                // defaultOptions={{ styles: mapStyles }}
            >
                {filteredDestinationsWithoutId.map(dest => (
                    <Marker
                        key={dest.id}
                        position={{
                            lat: Math.round(dest.lat * 10000) / 10000,
                            lng: Math.round(dest.long * 10000) / 10000
                        }}
                        onClick={() => {
                            handleMarkerClick(dest.id);
                        }}
                        onMouseOver={() => {
                            setMarkers(markers => {
                                return { ...markers, [dest.id - 1]: true };
                            });
                        }}
                        onMouseOut={() => {
                            setTimeout(() => {
                                setMarkers(markers => {
                                    return { ...markers, [dest.id - 1]: false };
                                });
                            }, 2500);
                        }}
                        icon={{
                            url: url,
                            scaledSize: new window.google.maps.Size(25, 25)
                        }}
                    >
                        <Link to={{ pathname: "/details/" + dest.id }}>
                            {markers[dest.id - 1] && (
                                <InfoWindow>
                                    <p
                                        style={{
                                            fontSize: 12,
                                            color: "blue",
                                            textDecoration: "underline"
                                        }}
                                    >
                                        {dest.title}
                                    </p>
                                </InfoWindow>
                            )}
                        </Link>
                    </Marker>
                ))}
                <Marker
                    key={filteredDestinations[id - 1]}
                    position={{
                        lat: latCurrent,
                        lng: longCurrent
                    }}
                    onClick={event => {
                        handleMarkerClick(event);
                    }}
                    icon={{
                        url: "/img/logo.png",
                        scaledSize: new window.google.maps.Size(25, 30)
                    }}
                >
                    <Link
                        to={{
                            pathname: "/details/" + filteredDestinations[id - 1]
                        }}
                    ></Link>
                </Marker>
            </GoogleMap>
        </div>
    );
}
const MapWrapped = withScriptjs(withGoogleMap(Map));

export default function DetailMap({ filteredDestinations, id }) {
    return (
        <React.Fragment>
            <div style={{ width: "100vw", height: "50vh" }}>
                <MapWrapped
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBRGDY9ghWbWBS-JTTlxf2UdtwR8cPaJus`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    filteredDestinations={filteredDestinations}
                    id={id}
                />
            </div>
        </React.Fragment>
    );
}
