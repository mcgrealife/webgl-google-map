/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */

import "./style.css";
import { AmbientLight, DirectionalLight, Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ThreeJSOverlayView } from "@googlemaps/three";
const { places } = require("./places.ts");
const { constants } = require("./constants.ts");
// const { url2 } = require("./inactive-tall.gltf");

let map: google.maps.Map;

const mapOptions = {
  tilt: constants.initialTilt,
  heading: constants.initialHeading,
  zoom: constants.initialZoom,
  center: constants.initialCenter,
  mapId: "15431d2b469f209e",
  // disable interactions due to animation loop and moveCamera
  disableDefaultUI: true,
  keyboardShortcuts: false
};

function initMap(): void {
  const mapDiv = document.getElementById("map") as HTMLElement;

  map = new google.maps.Map(mapDiv, mapOptions);
  // startscene
  const altitude = 100; // @nick change this number
  const scene = new Scene();
  const ambientLight = new AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);
  const directionalLight = new DirectionalLight(0xffffff, 0.25);
  directionalLight.position.set(0, 10, 50);
  scene.add(directionalLight);
  const loader = new GLTFLoader();
  //sample models https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/sourceModels
  const url =
    "https://raw.githubusercontent.com/googlemaps/js-samples/master/assets/pin.gltf";
  loader.load(url, (gltf) => {
    gltf.scene.scale.set(10, 10, 10);
    gltf.scene.rotation.x = Math.PI / 2;
    gltf.scene.rotation.z = 0;
    scene.add(gltf.scene);

    //
  });

  var markers: [ThreeJSOverlayView] = places.map(
    (place): ThreeJSOverlayView => {
      return new ThreeJSOverlayView({
        map,
        scene,
        anchor: { ...place, altitude: altitude }
      });
    }
  );

  console.log(markers);

  //endScene
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
    document.getElementById("label")
  );
  // label
  map.addListener("bounds_changed", (event) => {
    const tilt = Math.round(map.getTilt() ?? 0);
    const heading = Math.round(map.getHeading() ?? 0);
    const zoom = Math.round(map.getZoom() ?? 0);

    const label = document.getElementById("label") as HTMLElement;
    label.innerHTML =
      "tilt: " +
      tilt +
      " ; heading: " +
      heading +
      " ; zoom: " +
      zoom +
      " ; object altitude:" +
      altitude;
  });

  // rotate 3d objects when heading changes every 45 degrees
  map.addListener("heading_changed", (event) => {
    // if heading is [45, 90]
    markers.forEach((marker) => {
      marker.scene.rotation.y = map.getHeading();
      marker.requestRedraw();
    });
  });

  // end initMap
}
export { initMap };
