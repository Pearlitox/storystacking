console.info('Hello world');
import * as THREE from 'three';

const options = {
    bg: document.querySelector('.bg'),
    sizes: {},
    raycaster: new THREE.Raycaster(),
    mousePointer: new THREE.Vector2()
};
options.sizes.h = options.bg.clientHeight;
options.sizes.w = options.bg.clientWidth;
options.sizes.dpr = Math.min(window.devicePixelRatio, 2 );


class Viewer{

    constructor ( canvas ){
        this.canvas = canvas;
        this.setRenderer();
        
    }
    populate(){
        const cube = new THREE.BoxGeometry( 1, 1, 1),
        gold= new THREE.MeshBasicMaterial({
                color: 'red'
            }),
        mesh = new THREE.Mesh(cube, gold);
        this.scene.add( mesh );
        this.renderer.render(this.scene, this.camera );
    };
    
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

    render( scene = this.scene, camera = this.camera ){
        this.renderer.render( scene, camera );
    }
    
    setRenderer(){
        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: this.canvas
            }
        );
        this.renderer.setSize(
            options.sizes.w, options.sizes.h
        );
        this.renderer.setPixelRatio(
            options.sizes.dpr
        );
        this.camera = new THREE.PerspectiveCamera(
            75 ,
            options.sizes.w / options.sizes.h,
            1,
            10
        );
        this.camera.position.z = 5;
        this.scene = new THREE.Scene();
        this.scene.add( this.camera );
        this.populate();
        this.renderer.render( this.scene, this.camera)
    }
}
const myViewer = new Viewer( options.bg );
