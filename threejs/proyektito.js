/*
** Seminario #4: Otros_efectos
** Picking, video y multivista
** @author: rvivo@upv.es
** @date: 3-03-2021
** @dependencies: OrbitControls.js, Tween.js, dat.gui.min.js
*/

"use strict";

// Variables globales estandar
var renderer, scene, camera;

// Objetos
var dodge, nissan, ferrari, touareg, truck, dragon, boat, avion, cubo;
var materialUsuario;

// Control
var cameraControls, effectControls;

// Temporales
var angulo = 0;
var antes = Date.now();

// Variables para video --------------------------------------
var video, videoImage, videoImageContent, videoTexture;
// -----------------------------------------------------------

// Movimiento del soldado ++++++++++++++++++++++++++++++++++++
var salto, volver;
var audisalto, audivolver;
var dodgesalto, dodgevolver;
var nissansalto, nissanvolver;
var ferrarisalto, ferrarivolver;
var touaregsalto, touaregvolver;
var trucksalto, truckvolver;
var dragonsalto, dragonvolver;
var boatsalto, boatvolver;
var avionsalto, avionvolver;

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Minicamara ................................................
var minicam

// Acciones
init();
loadScene();
setupGUI();
render();

function init() {
	// Funcion de inicializacion de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color(0x000000) );
	renderer.shadowMap.enabled = true;
    renderer.autoClear = false; // <.......................
	document.getElementById('container').appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene();

	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100 );	// Perspectiva
	//camera = new THREE.OrthographicCamera( -10,10, 10/aspectRatio, -10/aspectRatio, 0.1, 100); //Ortografica
	camera.position.set( 0.5, 2, 5 );
	camera.lookAt( new THREE.Vector3( 0,0,0 ) );
    scene.add(camera);

	// Control de camara
	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.target.set( 0, 0, 0 );
	cameraControls.noZoom = false;

    // Minicam .....................................................
    minicam = new THREE.OrthographicCamera(-10,10, 10,-10, -10,100);
    minicam.position.set(0,1,0);
    minicam.up.set(0,0,-1);
    minicam.lookAt(0,-1,0);
    scene.add(minicam);
    // .............................................................

	// Luces
	var ambiental = new THREE.AmbientLight(0x222222);
	scene.add(ambiental);

	var direccional = new THREE.DirectionalLight( 0xFFFFFF, 0.1 );
	direccional.position.set( 0,1,0 );
	scene.add( direccional );

	var puntual = new THREE.PointLight( 0xFFFFFFF, 0.3 );
	puntual.position.set( 0, 60, 0 );
	puntual.castShadow = true;
	scene.add( puntual );

	var focal = new THREE.SpotLight( 0xFFFFFF, 0.5 );
	focal.position.set( -2, 7, 4 );
	focal.target.position.set( 0,0,0 );
	focal.angle = Math.PI/7;
	focal.penumbra = 0.5;
	focal.castShadow = true;

	scene.add( focal );

	// Atender al eventos
	window.addEventListener( 'resize', updateAspectRatio );
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++
    renderer.domElement.addEventListener('dblclick',saltar);
}

function loadScene() {
	// Construye el grafo de escena
	// - Objetos (geometria, material)
	// - Transformaciones 
	// - Organizar el grafo
	dragon = new THREE.Object3D();

	var path = "images/tahir1/";

	// Objeto contenedor de cubo y esfera

	// Cubo ---------------------------------------------------------

    // 1. Crear el elemento de video en el documento
    video = document.createElement('video');
    video.src = "videos/pixar.mp4";
    video.muted = true;
    video.load();
    video.play();

    // 2. Asociar la imagen de video a un canvas
    videoImage = document.createElement('canvas');
    videoImage.width = 632;
    videoImage.height = 256;
    videoImageContent = videoImage.getContext('2d');
    videoImageContent.fillStyle = '#0000FF';
    videoImageContent.fillRect( 0,0,videoImage.width,videoImage.height);

    // 3. Crear la textura
    videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.maxFilter = THREE.LinearFilter;

    var materialVideo = new THREE.MeshLambertMaterial( {
        color:'white',
        wireframe: false,
        map: videoTexture
    });

    var geoCubo = new THREE.BoxGeometry(4,4,4);
    cubo = new THREE.Mesh( geoCubo, materialVideo );
    cubo.name = 'cubo';
    cubo.position.y = 0.3;
    cubo.position.x = 27;
    cubo.position.z = 27;
    cubo.receiveShadow = cubo.castShadow = true;
	scene.add(cubo);

    // --------------------------------------------------------------

	// Esfera
	var entorno = [ path+"posx.jpg" , path + "negx.jpg",
	                path+"posy.jpg" , path + "negy.jpg",
	                path+"posz.jpg" , path + "negz.jpg"];


	var texEsfera = new THREE.CubeTextureLoader().load( entorno );

	// Suelo
	var texSuelo = new THREE.TextureLoader().load("images/tahir/suelo.jpg");
	texSuelo.minFilter = THREE.LinearFilter;
	texSuelo.magFilter = THREE.LinearFilter;
	texSuelo.repeat.set( 2,3 );
	texSuelo.wrapS = texSuelo.wrapT = THREE.MirroredRepeatWrapping;

	var geoSuelo = new THREE.PlaneGeometry(80,80);
	var matSuelo = new THREE.MeshLambertMaterial( {color:'gray', map:texSuelo} );
	var suelo = new THREE.Mesh( geoSuelo, matSuelo );
    suelo.name = 'suelo';
	suelo.rotation.x = -Math.PI/2;
	suelo.position.y = -1;
	suelo.receiveShadow = true;

	// Objeto importado

	var loader2 = new THREE.ObjectLoader();

	loader2.load( 'models/audi/audi11.json', 
	         function (objeto){
	         	objeto.name = 'audi';
                objeto.position.y = 0.3;
                objeto.position.x = -28;
                objeto.position.z = -25;
                objeto.rotation.z= 89.55;
		        scene.add(objeto);



                objeto.scale.set(0.35,0.35,0.35);
				//objeto.castShadow=true;
	         	audisalto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [-28,-28,-28],
	         	            	 y: [0.3,0.3,0.3],
	         	            	 z: [-25,30,3]}, 10000);
	         	audisalto.easing( TWEEN.Easing.Bounce.Out );
	         	audisalto.interpolation( TWEEN.Interpolation.Bezier );
	         	audivolver = new TWEEN.Tween( objeto.position );
	         	audivolver.to( {x:-28,y:0.3,z:-25}, 10000);
	         });

	// Habitacion
	var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = texEsfera;

	var matParedes = new THREE.ShaderMaterial( {
						vertexShader: shader.vertexShader,
						fragmentShader: shader.fragmentShader,
						uniforms: shader.uniforms,
						depthWrite: false,
						side: THREE.BackSide
	} );

	var habitacion = new THREE.Mesh( new THREE.CubeGeometry(80,80,80), matParedes );
    habitacion.name = 'habitacion';

	// Grafo
	scene.add( new THREE.AxesHelper(3) );
	scene.add( suelo );
	scene.add( habitacion );
}

function updateAspectRatio()
{
	// Mantener la relacion de aspecto entre marco y camara

	var aspectRatio = window.innerWidth/window.innerHeight;
	// Renovar medidas de viewport
	renderer.setSize( window.innerWidth, window.innerHeight );
	// Para la perspectiva
	camera.aspect = aspectRatio;
	// Para la ortografica
	// camera.top = 10/aspectRatio;
	// camera.bottom = -10/aspectRatio;

	// Hay que actualizar la matriz de proyeccion
	camera.updateProjectionMatrix();
}

function setupGUI()
{
	// Interfaz grafica de usuario 

	/*// Controles
	effectControls = {
		mensaje: "Interfaz",
		posY: 1.0,
		separacion: [],
		caja: true,
		color: "rgb(255,0,0)"
	};

	// Interfaz
	var gui = new dat.GUI();
	var folder = gui.addFolder("Interfaz Soldado World");
	folder.add( effectControls, "mensaje" ).name("App");
	folder.add( effectControls, "posY", 1.0, 3.0, 0.1 ).name("Subir/Bajar");
	folder.add( effectControls, "separacion", {Ninguna:0, Media:1, Maxima:2} ).name("Separacion");
	folder.add( effectControls, "caja" ).name("Ver al soldado");
	folder.addColor( effectControls, "color" ).name("Color texto");*/
}

function update()
{
	// Cambiar propiedades entre frames

	// Tiempo transcurrido
	var ahora = Date.now();
	// Incremento de 20º por segundo
	angulo += Math.PI/9 * (ahora-antes)/1000;
	antes = ahora;

	// Actualizar interpoladores
	TWEEN.update();

    // ACtualizar video ----------------------------------------------

    // 4. Poner el frame en la textura
    if(video.readyState === video.HAVE_ENOUGH_DATA){
        videoImageContent.drawImage(video,0,0);
        if(videoTexture) videoTexture.needsUpdate = true;
    }

    // --------------------------------------------------------------
}

function saltar(event) // ++++++++++++++++++++++++++++++++++++++++
{
    // Callback de atencion al doble click

    // Localizar la posicion del doble click en coordenadas de ventana
    var x = event.clientX;
    var y = event.clientY;

    // Normalizar al espacio de 2x2 centrado
    x = x * 2/window.innerWidth - 1;
    y = -y * 2/window.innerHeight + 1;

    // Construir el rayo que pasa por el punto de vista y el punto x,y
    var rayo = new THREE.Raycaster();
    rayo.setFromCamera( new THREE.Vector2(x,y), camera);

    // Calcular interseccion con objetos de la escena
    var interseccion = rayo.intersectObjects( scene.children, true );
    if( interseccion.length > 0){
        // Ver si es el soldado
        if(interseccion[0].object.name == 'soldado'){
            salto.chain(volver);
            salto.start();
        }
    }

}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


function render() {
	// Blucle de refresco
	requestAnimationFrame( render );
	update();

    renderer.clear();

    renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
	renderer.render( scene, camera );

    renderer.setViewport( 10,10,200,200 );
    renderer.render( scene, minicam );
}
