//
// Tales from Topographic Oceans
//
import React from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
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
/*
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
*/

//
// Scene
//
/*
var mesh;
var renderer;
class sceneWorld1 extends React.Component
{
  componentDidMount()
  {
    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);
    this.mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneBufferGeometry( 2, 2 );
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
*/

var mesh;
var renderer;
class sceneWorld1 extends React.Component
{
  componentDidMount()
  {
/*    
    // Cube
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);
    this.mount.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    function animate() {
      requestAnimationFrame( animate );

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render( scene, camera );
    }
 */
 
/*  // TFTO
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
*/
    // Scene
    const scene = new THREE.Scene();
    
    // Camera
    // var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    // const camera = new THREE.PerspectiveCamera( 70, resolution.x / resolution.y, 1, 1000 );
    const camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    camera.layers.enable( 1 );
    
    // Renderer
    const renderer = new THREE.WebGLRenderer();
    // renderer.setPixelRatio( window.devicePixelRatio );
    
    // renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize(resolution.x, resolution.y);

    this.mount.appendChild(renderer.domElement);
    this.mount.appendChild( VRButton.createButton( renderer ) );    
    // document.body.appendChild( renderer.domElement );
    // document.body.appendChild( VRButton.createButton( renderer ) );
        
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType( 'local' );
    
    // Geometry
    // const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    const geometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
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
      renderer.setSize(resolution.x, resolution.y);
    }

    //
    // Animate
    // 
    function animate() {
      requestAnimationFrame( animate );
      //cube.rotation.x += 0.01;
      //cube.rotation.y += 0.01;
      renderer.render( scene, camera );
      // renderer.setAnimationLoop( render );
    }

    /*
    // DEBUG !
    function render() {
      renderer.render( scene, camera );
    }
    */

    animate();
  }

  render()
  {
    return ( <div ref={ref =>	(this.mount = ref)} />)
  }
}

export {sceneWorld1, mesh, renderer};
