//
// Worlds test scene
//
import React from 'react';

import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
// var resolution = new THREE.Vector2(1200, 750);
var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
// import { resolution, materials } from './materials';

//
// Materials
//
const mat = {'default': 0};
Object.freeze(mat);

var mesh;
var renderer;
class sceneWorld1 extends React.Component
{
  componentDidMount()
  {
    // Scene
    const scene = new THREE.Scene();
    
    // Camera
    // const camera = new THREE.PerspectiveCamera( 70, resolution.x / resolution.y, 1, 1000 );
    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.layers.enable( 1 );
        
    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight);
    
    // DEBUG !
    // this.mount.appendChild(renderer.domElement);
    document.getElementById('root').appendChild(renderer.domElement);

    // XR
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType( 'local' );
    
    renderer.xr.addEventListener( 'sessionstart', function ( event ) {
      renderer.setSize( window.innerWidth, window.innerHeight );
    } );
    
    renderer.xr.addEventListener( 'sessionend', function ( event ) {
      onWindowResize();
    } );

    // VR Button
    const vrButton = VRButton.createButton( renderer )
    vrButton.addEventListener("click", function(event) {
      renderer.setSize( window.innerWidth, window.innerHeight );
    });
    this.mount.appendChild( vrButton );
    
    //
    // TODO: Correct exit from VR - Refresh button
    // window.location.reload();
    /* 
    const buttonStyle = {
      margin: '10px 0'
    };
    const button = ({ label, handleClick }) => (
      <button
        className="btn btn-default"
        style={buttonStyle}
        onClick={handleClick}
      >
        {label}
      </button>
    );
    this.mount.appendChild( button );
    */

    // Geometry
    // TODO: Sphere projection (?)
    // const geometry = new THREE.SphereGeometry(50);
    
    const geometry = new THREE.BoxGeometry( 1000, 1000, 1000 );
    geometry.scale( 1, 1, - 1 );
    var textures = getTexturesFromAtlasFile( 'data/textures/checker-map_3072x3072.png', 12 ); // + (!)
    // var textures = getTexturesFromAtlasFile( 'data/textures/checker-map_2048x2048.png', 12 ); // +    
    // var textures = getTexturesFromAtlasFile( 'data/textures/checker-map_3584x3584.png', 12 ); // -
    // var textures = getTexturesFromAtlasFile( 'data/textures/checker-map_8192x8192.png', 12 ); // -
    // const textures = getTexturesFromAtlasFile( 'data/textures/sun_temple_stripe_stereo.jpg', 12 );
    
    const materials = [];
    for ( let i = 0; i < 6; i ++ ) {       
      materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );
    }

    const skyBox = new THREE.Mesh( geometry, materials );
    skyBox.layers.set( 1 );
    scene.add( skyBox );
    
    const materialsR = [];
    for ( let i = 6; i < 12; i ++ ) {
      materialsR.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );
    }

    const skyBoxR = new THREE.Mesh( geometry, materialsR );
    skyBoxR.layers.set( 2 );
    scene.add( skyBoxR );
    
    window.addEventListener( 'resize', onWindowResize );
            
    //
    // getTexturesFromAtlasFile
    //
    function getTexturesFromAtlasFile( atlasImgUrl, tilesNum ) {

      const textures = [];

      for ( let i = 0; i < tilesNum; i ++ ) {

        textures[ i ] = new THREE.Texture();
      }

      const loader = new THREE.ImageLoader();
      loader.load( atlasImgUrl, function ( imageObj ) {

        let canvas, context;
        const tileWidth = imageObj.height;

        for ( let i = 0; i < textures.length; i ++ ) {

          canvas = document.createElement( 'canvas' );
          context = canvas.getContext( '2d' );
          canvas.height = tileWidth;
          canvas.width = tileWidth;
          // DEBUG !
          // context.drawImage( imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
          context.drawImage( imageObj, 0, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );          
          textures[ i ].colorSpace = THREE.SRGBColorSpace;
          textures[ i ].image = canvas;
          textures[ i ].needsUpdate = true;
        }

      } );

      return textures;
    }

    //
    // onWindowResize
    //
    function onWindowResize(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    //
    // Animate
    // 
    function animate() {
      renderer.setAnimationLoop( render );
    }
    
    //
    // Render
    //
    function render() {
      renderer.render( scene, camera );
    }
    
    animate();
  }

  render()
  {
    return ( <div ref={ref =>	(this.mount = ref)} />)
  }
}

export {sceneWorld1, mesh, renderer};
