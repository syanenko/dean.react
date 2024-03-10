//
// Worlds test scene
//
import React from 'react';

import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { degToRad } from 'three/src/math/MathUtils';

// var resolution = new THREE.Vector2(1200, 750);
var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

//
// Materials
//
const mat = {'default': 0};
Object.freeze(mat);

var mesh;
var renderer;
class sceneStereo extends React.Component
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
    // DEBUG !
    // alert(XRWebGLLayer.getNativeFramebufferScaleFactor());
    renderer.xr.setFramebufferScaleFactor( 8.0 );
    
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

    var textures = getTexturesFromAtlasFile( 'data/textures/Sea_star_8192x4096_VR180_STEREO.png', 2 );     // +
    // var textures = getTexturesFromAtlasFile( 'data/textures/checker-map_4096x4096.png', 6 );     // +
    // var textures = getTexturesFromAtlasFile( 'data/textures/checker-map_2048x2048.png', 12 ); // +
    // var textures = getTexturesFromAtlasFile( 'data/textures/checker-map_3072x3072.png', 12 ); // +/- (Falls after power reset)
    // var textures = getTexturesFromAtlasFile( 'data/textures/checker-map_4096x4096.png', 8 );  // - 
    // var textures = getTexturesFromAtlasFile( 'data/textures/checker-map_3584x3584.png', 12 ); // -
    // var textures = getTexturesFromAtlasFile( 'data/textures/checker-map_8192x8192.png', 12 ); // -
    // const textures = getTexturesFromAtlasFile( 'data/textures/sun_temple_stripe_stereo.jpg', 12 );
    
    const materials = [];
    for ( let i = 0; i < 6; i ++ ) {       
      materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );
      materials[i].side = THREE.DoubleSide;
    }
    
    const materialsR = [];
    for ( let i = 6; i < 12; i ++ ) {
      materialsR.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );
    }

    // Test plane
    /*
    const plane_geometry = new THREE.PlaneGeometry( 20, 10);
    const plane = new THREE.Mesh( plane_geometry, materials[0]);
    plane.layers.set( 1 );
    plane.translateZ(-10);
    scene.add( plane );
    */

    // Test sphere
    const sphere_geometry = new THREE.SphereGeometry(10, 360, 360, 0, Math.PI);

    // Left eye
    const sphereL = new THREE.Mesh( sphere_geometry, materials[0]);
    scene.add( sphereL );
    sphereL.rotateY(Math.PI);
    sphereL.translateX(0.11);
    sphereL.layers.set( 1 );

    // Right eye
    const sphereR = new THREE.Mesh( sphere_geometry, materials[1]);
    scene.add( sphereR );
    sphereR.rotateY(Math.PI);
    sphereR.translateX(-0.11);
    sphereR.layers.set( 2 );
       
    // skyBox left
    const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    geometry.scale( 1, 1, - 1 );
    
    const skyBox = new THREE.Mesh( geometry, materials );
    skyBox.layers.set( 1 );
    //scene.add( skyBox );
    
    // skyBox right
    //const skyBoxR = new THREE.Mesh( geometry, materialsR );
    const skyBoxR = new THREE.Mesh( geometry, materials );
    skyBoxR.layers.set( 2 );
    //scene.add( skyBoxR );
    
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
      // DEBUG
      // sphere.rotateOnAxis(new THREE.Vector3(0,1,0), 0.005 );
      renderer.render( scene, camera );
    }
    
    animate();
  }

  render()
  {
    return ( <div ref={ref =>	(this.mount = ref)} />)
  }
}

export {sceneStereo, mesh, renderer};
