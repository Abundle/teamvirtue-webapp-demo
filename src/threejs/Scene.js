import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls  from 'three-orbitcontrols';
import { OBJLoader } from 'three-obj-mtl-loader';
import { Easing, Tween } from 'es6-tween';
import GLTFLoader from 'three-gltf-loader';

// Local import
import objUrl from '../assets/models/marker_web_app.obj';
import aoMapUrl from '../assets/models/textures/marker.jpg';
import gltfUrl from '../assets/models/linq_low_poly_web_app.glb';

let levels = ['MY', 'LINQ', 'DISTRICT'];
let selectedObject = null;
let width;
let height;
let cameraFactor;
let highlightColor = 0xff0000;
let highlightMarkerColor = 0xef490f;
let whiteColor = 0xffffff;
let markers = [];
let markerPositionY = 1.25;

let opacityTween,
    cameraPositionTween,
    cameraZoomTween,
    cameraRotationTween,
    markerTween;

// TODO: Check markers not clickable in desktop view, markers following camera, loading status in circle (already in Redux store), check LINQ complexes texture
class Scene extends Component { // code based on https://stackoverflow.com/questions/41248287/how-to-connect-threejs-to-react
    constructor(props) {
        super(props);
        this.state = {
            transitioning: false,
        }
    }

    componentDidMount() { // glTF implementation based on https://medium.com/@matthewmain/how-to-import-a-3d-blender-object-into-a-three-js-project-as-a-gltf-file-5a67290f65f2
        window.addEventListener('resize', this.resizeCanvas);
        this.canvas.addEventListener('touchstart', this.onClick);
        this.canvas.addEventListener('click', this.onClick);

        if (window.innerWidth >= 1100) {
            width = window.innerWidth * 0.5;

        } else {
            width = window.innerWidth;
        }

        height = window.innerHeight;

        cameraFactor = (width / height) * 350;

        const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        /*const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);*/
        renderer.setSize(width, height);
        renderer.gammaFactor = 2.2;
        renderer.gammaOutput = true;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x97D6EA);
        const camera = new THREE.OrthographicCamera(
            width / -cameraFactor,
            width / cameraFactor,
            height / cameraFactor,
            height / -cameraFactor,
            0,
            1000
        );

        camera.position.set(0, 50, 25);
        camera.lookAt(0, 0, 0);


        let MYLINQ_GROUP = new THREE.Group();
        let LINQ_GROUP = new THREE.Group();
        let DISTRICT_GROUP = new THREE.Group();
        let OTHER_GROUP = new THREE.Group();

        // group names = same as Redux sustainabilityStatus state
        MYLINQ_GROUP.name = 'mylinq';
        LINQ_GROUP.name = 'linq';
        DISTRICT_GROUP.name = 'district';
        OTHER_GROUP.name = 'other';

        let mylinqObjects = [];
        let linqObjects = [];
        let districtObjects = [];
        let otherObjects = [];

        let gltfLoader = new GLTFLoader();
        let objLoader = new OBJLoader();
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        /*THREE.DRACOLoader.setDecoderPath( '/examples/js/libs/draco' );
        gltfLoader.setDRACOLoader(new THREE.DRACOLoader());*/

        gltfLoader.load(gltfUrl,
            // called when resource is loaded
            (gltf) => {
                this.props.loadingModel('loaded');
                gltf.scene.traverse((node) => {
                    if (node instanceof THREE.Mesh) {
                        if (!node.name.includes('palm')) {
                            node.material.transparent = true;
                            node.material.color.setHex(whiteColor);
                            node.material.aoMap = node.material.map;
                            node.material.aoMapIntensity = 1.25; //0.8
                            node.material.map = null;
                            node.material.alphaTest = 0.75; //0.5
                            node.geometry.attributes.uv2 = node.geometry.attributes.uv;
                        }

                        if (node.name.includes('Indicator') || node.name.includes('Bike')) {
                            node.material.color.setHex(0xef490f);
                        }

                        // store objects in correct array for levels
                        if (node.name.includes(levels[0])) {
                            mylinqObjects.push(node);
                            node.userData.parent = MYLINQ_GROUP.name;
                        } else if (node.name.includes(levels[1])) {
                            linqObjects.push(node);
                            node.userData.parent = LINQ_GROUP.name;
                        } else if (node.name.includes(levels[2])) {
                            districtObjects.push(node);
                            node.userData.parent = DISTRICT_GROUP.name;
                        } else {
                            otherObjects.push(node);
                            node.userData.parent = OTHER_GROUP.name;
                        }
                    }
                });

                // add filled arrays to correct THREE.js group
                MYLINQ_GROUP.children = mylinqObjects;
                LINQ_GROUP.children = linqObjects;
                DISTRICT_GROUP.children = districtObjects;
                OTHER_GROUP.children = otherObjects;

                this.selectLevel(this.props.sustainabilityStatus.selected);

                scene.add(gltf.scene);
            },
            // called when loading is in progresses
            (xhr) => {
                let percentage = (xhr.loaded / xhr.total * 100);
                console.log('Model ' + percentage + '% loaded');

                this.props.loadingModel(percentage);
            },
            // called when loading has errors
            (error) => {
                console.log('Error ' + error);

                this.props.loadingModel('Error');
            });

        // Texture Loading
        let aoMap = new THREE.TextureLoader().load(aoMapUrl);
        let material = new THREE.MeshStandardMaterial({
            color: highlightColor,
            aoMap: aoMap,
            aoMapIntensity: 2,
            transparent: true,
            name: 'Marker_material',
        });

        objLoader.load(objUrl,
            (object) => {
                let geometry = object.children[0].geometry;
                geometry.attributes.uv2 = geometry.attributes.uv;
                object = new THREE.Mesh(geometry, material);
                object.scale.multiplyScalar(0.5);
                object.rotation.set(0, 0.5, 0);

                object.name = 'Marker';

                otherObjects.push(object);
                object.userData.parent = OTHER_GROUP.name;

                scene.add(object);
            },
            // called when loading is in progresses
            (xhr) => {
                console.log('Marker ' + (xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            (error) => {
                console.log('Error ' + error);
            });

        let lights = [];
        lights[0] = new THREE.AmbientLight(whiteColor, 0.6);
        scene.add(lights[0]);


        lights[1] = new THREE.HemisphereLight(whiteColor, 0xf15b27, 0.75); // 1.25
        lights[1].position.set(0, 100, -25);

        scene.add(lights[1]);

        // interior light(s)
        lights[2] = new THREE.PointLight(0xfffd99, 0.75, 0, 2);
        lights[2].position.set(7, 4, -2);

        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.5;
        // controls.enableZoom = false;
        controls.enablePan = false;
        controls.rotateSpeed = 0.75;
        controls.minZoom = 0.05;
        controls.maxZoom = 8;
        controls.maxPolarAngle = Math.PI * 0.45;

        /* for debugging */
        /*let cameraHelper = new THREE.CameraHelper(camera);
        scene.add(cameraHelper);*/

        /*let axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);*/

        /*let gridHelper = new THREE.GridHelper(100, 100);
        scene.add(gridHelper);*/

        /*let lightHelpers = [];
        lightHelpers[0] = new THREE.HemisphereLightHelper(lights[1]);
        lightHelpers[1] = new THREE.PointLightHelper(lights[2], 0.5);
        scene.add(lightHelpers[0]);*/
        // scene.add(lightHelpers[1]);
        /*axesHelper.userData.parent = DISTRICT_GROUP;
        for (let i in lightHelpers) {
            lightHelpers[i].userData.parent = DISTRICT_GROUP;
            console.log(lightHelpers);
        }*/

        /*let cameraHelper = new THREE.CameraHelper(camera);
        scene.add(cameraHelper);*/

        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        this.scene = scene;

        this.width = width;
        this.height = height;

        this.camera = camera;
        this.renderer = renderer;
        // this.lights = lights;
        this.MYLINQ_GROUP = MYLINQ_GROUP;
        // this.LINQ_GROUP = LINQ_GROUP;
        // this.DISTRICT_GROUP = DISTRICT_GROUP;
        this.OTHER_GROUP = OTHER_GROUP;
        // this.markerObject = markerObject;
        // this.controls = controls;
        this.raycaster = raycaster;
        this.mouse = mouse;

        this.start();
    }

    componentWillUnmount() {
        this.canvas.removeEventListener('resize', this.resizeCanvas);
        this.canvas.removeEventListener('touchstart', this.onClick);
        this.canvas.removeEventListener('click', this.onClick);
        // this.canvas.removeEventListener('transitionend', this.test);

        this.stop();
    }

    componentDidUpdate(previousProps, previousState) {
        let status = this.props.sustainabilityStatus;

        // only update if fullscreen state has changed
        if (status.fullscreen !== previousProps.sustainabilityStatus.fullscreen) {
            this.setState({ transitioning: true });
            this.selectLevel(this.props.sustainabilityStatus.selected);

            setTimeout(() => {
                this.setState({ transitioning: false });
                // console.log('fullscreen transition done');
            }, 500);
        }

        if (status.selected !== previousProps.sustainabilityStatus.selected) {
            this.selectLevel(status.selected);
        }
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    };

    stop = () => {
        cancelAnimationFrame(this.frameId);
    };

    animate = () => {
        this.renderScene();

        if (opacityTween) {
            opacityTween.update();
        }
        if (cameraPositionTween) {
            cameraPositionTween.update();
        }
        if (cameraZoomTween) {
            cameraZoomTween.update();
        }
        if (cameraRotationTween) {
            cameraRotationTween.update();
        }
        if (markerTween) {
            markerTween.update();
        }

        this.camera.updateProjectionMatrix();

        this.frameId = window.requestAnimationFrame(this.animate);
    };

    renderScene() {
        this.renderer.render(this.scene, this.camera);

        if (this.state.transitioning) {
            this.resizeCanvas();
        }
    }

    resizeCanvas = () => {
        if (window.innerWidth >= 1100) {
            this.renderer.setSize(window.innerWidth * 0.5, window.innerHeight);

            width = window.innerWidth * 0.5;

        } else {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            width = window.innerWidth;
        }

        height = window.innerHeight;
        cameraFactor = (width / height) * 350;

        this.camera.left = width / -cameraFactor;
        this.camera.right = width / cameraFactor;
        this.camera.top = height / cameraFactor;
        this.camera.bottom = height / -cameraFactor;

        // console.log(this.camera.left, this.camera.top)
    };

    onClick = (event) => {
        event.preventDefault();

        if (event.type === 'click') {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        } else {
            this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }

        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);

        // check if there are 1 or more intersections and the first object has group data
        if (intersects.length > 0 && Object.keys(intersects[0].object.userData).length !== 0) {
            // check if the closest object intersected is not the currently stored intersection object
            if (intersects[0].object !== selectedObject) {
                // restore previous intersection object (if it exists) to its original color
                if (selectedObject) {
                    this.setColor(selectedObject, selectedObject.currentHex);
                }
                // store reference to closest object as current intersection object
                selectedObject = intersects[0].object;

                // store color of closest object (for later restoration)
                selectedObject.currentHex = this.getColor(selectedObject);

                // set a new color for closest object
                // this.setColor(selectedObject, highlightColor);

                if (this.props.sustainabilityStatus.selected === 'mylinq' && selectedObject.name === 'Marker') {
                    this.setColor(selectedObject, highlightMarkerColor);
                    this.selectHighlight(selectedObject.userData.highlight);
                }
            }
        } else {
            // restore previous intersection object (if it exists) to its original color
            if (selectedObject) {
                this.setColor(selectedObject, selectedObject.currentHex);
            }
            selectedObject = null;
        }
    };

    setActiveTab = (tab) => (event) => { // TODO: check event variable
        this.props.updateSustainabilityStatus(tab);
    };

    selectLevel = (level) => { // TODO: check if level is already selected? + Make marker object global?
        let roof = this.MYLINQ_GROUP.getObjectByName('MYLINQ_roof_solar_panels');
        let indicator = this.OTHER_GROUP.getObjectByName('Indicator');
        let marker = this.scene.getObjectByName('Marker');

        /*for (let i = 0; i < markers.length; i ++) {
            console.log(markers[i])
        }*/

        let advices = this.props.sustainabilityStatus.advices[level];

        switch(level) {
            case 'mylinq':
                this.setTransparency({ objects: [roof, indicator, marker], opacity: [0, 0, 1] });

                for (let i = 0; i < advices.length; i++) {
                    if (advices[i].active) {
                        // Object to be highlighted
                        let object = this.OTHER_GROUP.getObjectByName(advices[i].id);
                        this.setMarker(object);
                        this.setColor(object, highlightColor);
                    }
                }

                if (this.props.sustainabilityStatus.fullscreen) {
                    this.animateCamera(this.camera, { x: 15, y: 50, z: 30 }, 1500, 2);

                    this.animateMarker(markers);
                } else {
                    this.animateCamera(this.camera, { x: 25, y: 50, z: 25 }, 1000, 0.5, { x: 5.5, y: 0, z: 2.5 });
                }
                break;
            case 'linq':
                this.setTransparency({ objects: [roof, indicator, marker], opacity: [1, 1, 0] });

                if (this.props.sustainabilityStatus.fullscreen) {
                    this.animateCamera(this.camera, { x: 35, y: 20, z: 35 }, 1500, 0.5); // lookAt: { x: 0, y: 0, z: 2 }
                } else {
                    this.animateCamera(this.camera, { x: 25, y: 25, z: 25 }, 1000, 0.25, { x: 10, y: -3, z: 7 });
                }
                break;
            case 'district':
                this.setTransparency({ objects: [roof, indicator, marker], opacity: [1, 1, 0] });

                if (this.props.sustainabilityStatus.fullscreen) {
                    this.animateCamera(this.camera, { x: 35, y: 45, z: 35 }, 1500, 0.20);
                } else {
                    this.animateCamera(this.camera, { x: 35, y: 25, z: 35 }, 1000, 0.15, { x: 11, y: -17, z: 3});
                }
                break;
            default:
                console.log('error');
        }

        // update Redux state
        this.setActiveTab(level)();
    };

    animateCamera = (camera, targetPosition, duration, targetZoom = 1, lookAt = { x: 0, y: 0, z: 0 }) => {
        // Method from https://stackoverflow.com/questions/28091876/tween-camera-position-while-rotation-with-slerp-three-js
        let originalPosition = new THREE.Vector3().copy(camera.position); // original position
        let originalRotation = new THREE.Euler().copy(camera.rotation); // original rotation

        camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

        // Reset original position and rotation
        camera.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
        camera.rotation.set(originalRotation.x, originalRotation.y, originalRotation.z);

        // Position Tweening
        cameraPositionTween = new Tween(camera.position)
            .to({
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
            }, duration)
            .easing(Easing.Exponential.InOut)
            .on('update', ({ x, y, z }) => {
                // console.log(x, y, z);
                camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
            });

        cameraZoomTween = new Tween({ zoom: camera.zoom })
            .to({ zoom: targetZoom }, duration)
            .easing(Easing.Exponential.InOut)
            .on('update', ({ zoom }) => {
                camera.zoom = zoom;
            });

        cameraPositionTween.start();
        cameraZoomTween.start();
    };

    setTransparency = (targetProperties) => {
        let currentOpacity = [];
        let targetOpacity = [];

        if (targetProperties.objects[0]) {
            for (let i = 0; i < targetProperties.objects.length; i++) {
                currentOpacity.push(targetProperties.objects[i].material.opacity);
            }
        }

        for (let i = 0; i < targetProperties.opacity.length; i++) {
            targetOpacity.push(targetProperties.opacity[i]);
        }

        opacityTween = new Tween(Object.assign({}, currentOpacity))
            .to(Object.assign({}, targetOpacity), 500)
            .delay(500)
            .on('update', (o) => {
                for (let i = 0; i < targetProperties.objects.length; i++) {
                    targetProperties.objects[i].material.opacity = o[i];
                }
            });
        opacityTween.start();
    };

    setColor = (object, color) => {
        if (object.material instanceof Array) {
            object.material[0].color.set(color); //setHex
        } else {
            object.material.color.set(color);
        }
    };

    getColor = (object) => {
        if (object.material instanceof Array) {
            return object.material[0].color.getHex();
        } else {
            return object.material.color.getHex();
        }
    };

    setMarker = (object) => {
        let position = object.position;

        if (!object.userData.marker) {
            let markerObject = this.scene.getObjectByName('Marker');

            let marker = markerObject.clone();
            marker.userData.highlight = object.name;

            marker.traverse((node) => {
                if (node instanceof THREE.Mesh) {
                    node.material = node.material.clone();
                }
            });

            marker.position.set(position.x, markerPositionY, position.z);

            this.scene.add(marker);

            markers.push(marker);
        }

        object.userData.marker = true;
    };

    selectHighlight = (selected) => {
        this.props.selectAdviceCard(selected);
    };

    animateMarker = (markerArray) => {
        let currentYCoordinates = [];
        let bounceYCoordinates = [];

        for (let i = 0; i < markerArray.length; i++) {
            currentYCoordinates.push(markerPositionY);
        }

        for (let i = 0; i < markerArray.length; i++) {
            bounceYCoordinates.push(markerArray[i].position.y + 1);
        }

        markerTween = new Tween(Object.assign({}, bounceYCoordinates))
            .to(Object.assign({}, currentYCoordinates), 2000)
            .easing(Easing.Bounce.Out)
            .on('update', (y) => {
                for (let i = 0; i < markerArray.length; i++) {
                    markerArray[i].position.setY(y[i]);
                }
            });
        markerTween.start();
    };

    render() {
        return (
            <canvas
                style={ !this.props.sustainabilityStatus.fullscreen || this.state.transitioning ? { pointerEvents: 'none' } : { pointer: 'cursor' }}
                ref={ (canvas) => { this.canvas = canvas }}
            />
        )
    }
}

export default Scene;