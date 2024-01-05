//
// Worlds
//
import React from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
// import { resolution, materials } from './materials';

var resolution = new THREE.Vector2(1200, 750);

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
    const camera = new THREE.PerspectiveCamera( 70, resolution.x / resolution.y, 0.01, 1000 );
    camera.layers.enable( 1 );
    
    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(resolution.x, resolution.y);
    // renderer.setSize( window.innerWidth, window.innerHeight );

    this.mount.appendChild(renderer.domElement);
       
    // XR
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType( 'local' );
    
    renderer.xr.addEventListener( 'sessionstart', function ( event ) {
      renderer.setSize( window.innerWidth, window.innerHeight );
    } );
    
    renderer.xr.addEventListener( 'sessionend', function ( event ) {
      // TODO: Set proper view
      renderer.setSize(resolution.x, resolution.y);
      // unmountComponent (this);
    } );

    // VR Button
    const vrButton = VRButton.createButton( renderer )
    vrButton.addEventListener("click", function(event) {
      renderer.setSize( window.innerWidth, window.innerHeight );
    });

    this.mount.appendChild( vrButton );

    // Geometry
    const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    geometry.scale( 1, 1, - 1 );

    const textures = getTexturesFromAtlasFile( 'data/textures/sun_temple_stripe.jpg', 12 );
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
          context.drawImage( imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
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

      // renderer.setSize( window.innerWidth, window.innerHeight );
      // renderer.setSize(resolution.x, resolution.y);
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
