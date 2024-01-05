//
// Tales from Topographic Oceans
//
import React from 'react';
import * as THREE from 'three';
// import { resolution, materials } from './materials';

var resolution = new THREE.Vector2(1200, 750);
var texture = new THREE.TextureLoader().load("data/textures/TFTOInfo.jpg");
console.dir(texture);

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
class sceneTFTO extends React.Component
{
  componentDidMount()
  {
    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);

    this.mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry( 2, 2 );
    mesh = new THREE.Mesh(geometry, matWhirpool);
    scene.add(mesh);

    var animate = function ()
    {
      requestAnimationFrame( animate );

      if(matWhirpool.uniforms['u_time'])
         matWhirpool.uniforms['u_time'].value = performance.now() / 1000;

      renderer.render(scene, camera);
    };

    animate();
  }

  render()
  {
    return ( <div ref={ref =>	(this.mount = ref)} />)
  }
}

export {sceneTFTO, mesh, renderer};
