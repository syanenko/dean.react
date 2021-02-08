import * as THREE from 'three';
//
// Globals
//
var resolution = new THREE.Vector2(1024, 768);
var texture = new THREE.TextureLoader().load("data/textures/TFTOInfo.jpg");
console.dir(texture);

//
// Materials
//
var materials =
[
  // Whirlpool
  new THREE.ShaderMaterial(
  {
    uniforms: { u_time:       { value: 1.0        },
                u_texture:    { value: texture    },
                u_resolution: { value: resolution },
                u_a:          { value: 400.0      },
                u_b:          { value: 200.0      }},

    vertexShader: document.getElementById( 'vertexDefault' ).textContent,
    fragmentShader: document.getElementById( 'fragmentWhirlpool' ).textContent
  } )
];

export { resolution, materials };
