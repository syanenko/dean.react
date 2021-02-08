//
// Tales from Topographic Oceans
//
import React from 'react';
import * as THREE from 'three';
import { resolution, materials } from './materials';

var mesh;
var renderer;
const matIndex = 0;
class sceneTFTO extends React.Component
{
  componentDidMount()
  {
    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);

    this.mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneBufferGeometry( 2, 2 );
    mesh = new THREE.Mesh(geometry, materials[matIndex]);
    scene.add(mesh);

    var animate = function ()
    {
      requestAnimationFrame( animate );

      if(materials[matIndex].uniforms['u_time'])
         materials[matIndex].uniforms['u_time'].value = performance.now() / 1000;

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
