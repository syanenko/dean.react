//
// Tales from Topographic Oceans
//
import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// var resolution = new THREE.Vector2(1920, 1200);
var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
var texture = new THREE.TextureLoader().load("data/textures/TFTOInfo.jpg");

//
// Materials
//
const mat = {'default': 0};
Object.freeze(mat);

// Whirlpool
var matWhirpool = new THREE.ShaderMaterial(
{
  uniforms: { u_time:       { value: 1.0        },
              u_texture:    { value: texture    },
              u_resolution: { value: resolution },
              u_a:          { value: 400.0      },
              u_b:          { value: 200.0      }},

  vertexShader: document.getElementById( 'vertexDefault' ).textContent,
  fragmentShader: document.getElementById( 'fragmentWhirlpool' ).textContent
} );


//
// Scene
//
var mesh;
var renderer;
var mixer;
var speed = 0.3;

class sceneTFTO extends React.Component
{
  componentDidMount()
  {
    const scene  = new THREE.Scene();
    // const camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
    // camera.position.y = 100;
    camera.position.z = 300;
    camera.lookAt(0,0,0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);
    this.mount.appendChild(renderer.domElement);
    
    let scale = 3; // TODO: Find better way
    const geometry = new THREE.PlaneGeometry( resolution.x / scale, resolution.y / scale);
    mesh = new THREE.Mesh(geometry, matWhirpool);
    scene.add(mesh);

    var clock = new THREE.Clock();

    // Animate
    var animate = function ()
    {
      requestAnimationFrame( animate );
/*
      if(matWhirpool.uniforms['u_time'])
         matWhirpool.uniforms['u_time'].value = performance.now() / 1000;
*/
      // Fish animation
      var delta = clock.getDelta();
  		if ( mixer ) mixer.update( delta * speed);

      renderer.render(scene, camera);
    };

    // Load fish
    const loader = new GLTFLoader();
    loader.load(
      'data/objects/Fish_01.glb',
      function ( gltf ) {
        mixer = new THREE.AnimationMixer( gltf.scene );
        var action = mixer.clipAction( gltf.animations[0] );
        action.play();
        scene.add( gltf.scene );
        gltf.scene.position.y = -40;
      },

      function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },

      function ( error ) {
        console.log( 'An error happened' );
      }
    );

    animate();
  }

  render()
  {
    return ( <div ref={ref =>	(this.mount = ref)} />)
  }
}

export {sceneTFTO, mesh, renderer};
