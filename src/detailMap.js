import React, { useEffect, useRef } from "react";
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";
import { Link } from "react-router-dom";

export function Map({ filteredDestinations, id }) {
    filteredDestinations.map(dest => {
        console.log(dest);
    });
    let url = `/img/robin.png`;
    let filteredDestinationsWithoutId = filteredDestinations.filter(
        dest => dest.id == [id - 1]
    );
    filteredDestinationsWithoutId.map(dest => {
        console.log("without id: ", dest);
    });
    console.log(
        "filteredDestinationsWithoutId ",
        filteredDestinationsWithoutId
    );

    return (
        <div>
            <GoogleMap
                defaultOptions={{
                    streetViewControl: false,
                    mapTypeControl: false
                }}
                defaultZoom={11}
                defaultCenter={{ lat: 52.52, lng: 13.405 }}
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
                        // onClick={event => {
                        //     console.log(event);
                        // }}
                        icon={{
                            url: url,
                            scaledSize: new window.google.maps.Size(25, 25)
                        }}
                    >
                        <Link to={{ pathname: "/details/" + dest.id }}>
                            <InfoWindow>
                                <p>{dest.title}</p>
                            </InfoWindow>
                        </Link>
                    </Marker>
                ))}
                <Marker
                    key={filteredDestinations[id - 1]}
                    position={{
                        lat:
                            Math.round(
                                filteredDestinations[id - 1].lat * 10000
                            ) / 10000,
                        lng:
                            Math.round(
                                filteredDestinations[id - 1].long * 10000
                            ) / 10000
                    }}
                    // onClick={event => {
                    //     console.log(event);
                    // }}
                    icon={{
                        url: "/img/logo.png",
                        scaledSize: new window.google.maps.Size(25, 25)
                    }}
                >
                    <Link
                        to={{
                            pathname: "/details/" + filteredDestinations[id - 1]
                        }}
                    >
                        <InfoWindow>
                            <p>{filteredDestinations[id - 1].title}</p>
                        </InfoWindow>
                    </Link>
                </Marker>
                ))}
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
