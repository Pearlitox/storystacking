import * as THREE from "https://unpkg.com/three@latest/build/three.module.js";
import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const settings = {
    wrapper: document.querySelector(".js-canvas-wrapper"),
    canvas: document.querySelector(".js-canvas-3d"),
    raf: window.requestAnimationFrame,
    glb: "../assets/Ampoule_Test.glb",
    sizes: {},
    raycaster: new THREE.Raycaster(),
    mousePointer: new THREE.Vector2()
};

const threejsOptions = {
    canvas: settings.canvas,
};

const values = {};

//// VIEWER CLASS

class Viewer {
    constructor(options) {
        this.canvas = options.canvas;

        this.setRenderer(options);
    }

    populate() {
        // Tout les éléments à ajouter dans la scene

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const sphere = new THREE.SphereGeometry(15, 32, 16);
        const material = new THREE.MeshBasicMaterial({
            color: "slateblue",
        });
        const material1 = new THREE.MeshBasicMaterial({
            color: "gold",
        });
        const mesh = new THREE.Mesh(geometry, material);
        const mesh1 = new THREE.Mesh(sphere, material1);
        console.log(mesh1)
        mesh1.position.z = 5
        this.scene.add(mesh, mesh1);
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
    settings.raycaster.setFromCamera(
        settings.mousePointer, myViewer.camera);
    const intersects = settings.raycaster.intersectObjects(
        myViewer.scene.children );
        myViewer.scene.children.forEach(item => {
            item.scale.set(1, 1, 1);
        })

        for (const child of intersects ){
            console.log(child.object);
            child.object.scale.set(2,2,2)
             
        }
        myViewer.render();
};

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