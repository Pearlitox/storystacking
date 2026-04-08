import * as THREE from "https://unpkg.com/three@latest/build/three.module.js";
import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js";
import { OrbitControls } from 'https://esm.sh/three/addons/controls/OrbitControls.js';
import gsap from "https://esm.sh/gsap";
import { GLTFLoader } from 'https://esm.sh/three/addons/loaders/GLTFLoader.js';

// SETTINGS
const settings = {
    wrapper: document.querySelector(".js-canvas-wrapper"),
    canvas: document.querySelector(".js-canvas-3d"),
    raf: window.requestAnimationFrame,
    sizes: {},
    raycaster: new THREE.Raycaster(),
    mousePointer: new THREE.Vector2(),
    glb: "../assets/scene.glb"
};

const threejsOptions = {
    canvas: settings.canvas,
};
//LOADERS

const loader = new GLTFLoader();
const gltf = await loader.loadAsync(settings.glb);
console.log(settings.glb);


//// VIEWER CLASS

class Viewer {
    constructor(options) {
        this.canvas = options.canvas;

        this.setRenderer(options);
    }

    updateCameraPosition() {
        const newPosition = this.cameraPositions[ this.indexCamera ];
        this.camera.position.set( newPosition.x, newPosition.y, newPosition.z );
        this.camera.lookAt(0,0,0);
    }

    travelling() {

        this.indexCamera = 0;
        this.cameraPositions = [];

        const geometry = new THREE.BoxGeometry( .25,.25,.25);
        const material = new THREE.MeshBasicMaterial({
            color: 'crimson'
        });


        const cube1 = new THREE.Mesh( geometry, material );
        cube1.position.x = 3;
        cube1.position.z = 4;
        cube1.position.y = 3;
        cube1.visible = false;

        const cube2 = new THREE.Mesh( geometry, material );

        cube2.position.x = -3;
        cube2.position.z = 2;
        cube2.position.y = 1;
        cube2.visible = false;

        const cube3 = new THREE.Mesh( geometry, material );

        cube3.position.x = 3;
        cube3.position.z = -2;
        cube3.position.y = 2;
        cube3.visible = false;

        this.cameraPositions.push(cube1.position, cube2.position, cube3.position);
        
        this.scene.add( cube1, cube2, cube3 );
        this.updateCameraPosition();
        this.render();
    }


    populate() {
        // Tout les éléments à ajouter dans la scene
        this.clickable= [];
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: "slateblue",
        });
        const mesh = new THREE.Mesh(geometry, material);

        this.scene.add( gltf.scene );
        
        const suzanne = this.scene.getObjectByName('Suzanne');
        const suzanne1 = this.scene.getObjectByName('Suzanne001');
        const suzanne2 = this.scene.getObjectByName('Suzanne002');
        const cube = this.scene.getObjectByName('Cube');
        cube.material = new THREE.MeshBasicMaterial({color : 'white'})
        suzanne.material = new THREE.MeshBasicMaterial({color : 'springGreen'});
        suzanne1.material = new THREE.MeshBasicMaterial({color : 'blue'});
        suzanne2.material = new THREE.MeshBasicMaterial({color : 'gold'});

        this.clickable.push(suzanne, suzanne1, suzanne2);
        console.log(this.clickable)

        // Demander un rendu
        this.render();
    }

    removeGizmo() {
        this.scene.remove(this.gizmo);
        this.gizmo.dispose();
        this.gizmo = null;
        this.render();
    }

    addGizmo(size = 1) {
        this.gizmo = new THREE.AxesHelper(size);
        this.scene.add(this.gizmo);
        this.render();
    }

    render(scene = this.scene, camera = this.camera) {
        this.renderer.render(scene, camera);
    }

    setRenderer(options = {}) {
        this.renderer = new THREE.WebGLRenderer(options);

        // Crée notre caméra
        // PerspectiveCamera( fov, aspect-ratio, near, far )
         this.camera = new THREE.PerspectiveCamera(
            75,
            // On le calcule avec la taille du wrapper
            settings.sizes.w / settings.sizes.h,
            1,
            100
        );

        // Recule notre camera pour qu'on puisse voir le centre de la scene
        this.camera.position.z = 10;

        // Crée notre scene et y rajoute notre camera
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);

        // Change une première fois la taille de notre canvas
        this.resize();

        // Appele la fonction d'ajout d'éléments
        this.travelling();
        this.populate();
    }

    resize() {
        // Mettre à jour nos settings
        settings.sizes.w = settings.wrapper.clientWidth;
        settings.sizes.h = settings.wrapper.clientHeight;

        // Limite la densité de pixel à 2, pour éviter
        // des problèmes de performances sur des écrans
        // à plus haute densité de pixel.
        settings.sizes.dpr = Math.min(window.devicePixelRatio, 2);

        settings.canvas.style.aspectRatio = `${settings.sizes.w}/${settings.sizes.h}`;

        // Mettre à jour la camera
        this.camera.aspect = settings.sizes.w / settings.sizes.h;
        this.camera.updateProjectionMatrix();

        // Mettre à jour le moteur de rendu
        this.renderer.setSize(settings.sizes.w, settings.sizes.h);
        this.renderer.setPixelRatio(settings.sizes.dpr);

        this.render();
    }
}

const raycasting = () => {
    settings.raycaster.setFromCamera( settings.mousePointer, myViewer.camera);
    const intersects = settings.raycaster.intersectObjects(myViewer.scene.children);

    if( intersects.length > 0 ){
        const firstObjectTouch = intersects[0].object.name;

        for( const obj of myViewer.clickable ){
            if( obj.name !== firstObjectTouch ){
                obj.scale.set(1,1,1);
            } else{
                obj.scale.set(1.1,1.1,1.1);
            }
        }
    } else {
        for( const obj of myViewer.clickable ){
            obj.scale.set(1,1,1);
        }
    }
    /*
    for (const child of intersects ){
        
        child.object.scale.set(1.1,1.1,1.1);
    }
    */

    myViewer.render();
}


const updateMousePointer = (e) => {
    const x = (e.clientX / settings.sizes.w) * 2 - 1;
    const y = (e.clientY / settings.sizes.h) * 2 - 1;
    settings.mousePointer.x = x;
    settings.mousePointer.y = -y;

    raycasting();
}

const myViewer = new Viewer(threejsOptions);
// myViewer.addGizmo(2);

// Ajouter un event resize et appeler la fonction qui
// gère les changements de tailles
window.addEventListener("resize", () => {
    myViewer.resize();
});

window.addEventListener('mousemove', (e) => {
    updateMousePointer(e);
});

window.addEventListener("click", () => {
    myViewer.indexCamera++;
    const length = myViewer.cameraPositions.length;
    gsap.to( myViewer.camera.position, {
        duration: 1,
        x: myViewer.cameraPositions[ myViewer.indexCamera % length ].x,
        y: myViewer.cameraPositions[ myViewer.indexCamera % length ].y,
        z: myViewer.cameraPositions[ myViewer.indexCamera % length ].z,
        onUpdate: () => {
            myViewer.camera.lookAt(0,0,0);
            myViewer.render();
        }
    });
    // myViewer.camera.position.set( myViewer.cube2.position.x, myViewer.cube2.position.y, myViewer.cube2.position.z );
    // myViewer.camera.lookAt(0,0,0);
    // myViewer.render();
});