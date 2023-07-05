/*
** Seminario #2: Animacion e Interaccion 
** @author: rvivo@upv.es
** @date: 24-02-2021
** @dependencies: OrbitControls.js, Tween.js, dat.gui.min.js
*/


// Variables globales estandar
var renderer, scene, camera;

// Objetos
var esfera, cubo, conjunto, triangle;


// Control
var cameraControls, effectControls;

//Variables dependientes del tiempo-> Temporales
var angulo = 0;
var antes = Date.now();

// Acciones
init();
loadScene();
setupGUI();
render();

function init() {
	// Funcion de inicializacion de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();//Motor basado de Webgl
	renderer.setSize( window.innerWidth, window.innerHeight );//fijar propiedades->tamaño de toda la area del cliente
	renderer.setClearColor( new THREE.Color(0x000000) );
	document.getElementById('container').appendChild(renderer.domElement);//cogemos el contenedor de s2.html y le asignamos el canvas(lienzo) que está en el motor(renderer) en su propiedad domelement

	// Escena
	scene = new THREE.Scene();

	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight;//la razon de aspecto es la misma razon del cliente.
	camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100 );	// Perspectiva
	//camera = new THREE.OrthographicCamera( -10,10, 10/aspectRatio, -10/aspectRatio, 0.1, 100); //Ortografica
	camera.position.set( 0.5, 7, 5 );//X,y,Z
	camera.lookAt( new THREE.Vector3( 0,0,0 ) );//Donde mira mi camara, al origen de coordenadas

	// Control de camara
	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.target.set( 0, 0, 0 );
	cameraControls.noZoom = false;

	// Atender al eventos
	window.addEventListener( 'resize', updateAspectRatio );
}

function loadScene() {
	// Construye el grafo de escena
	// - Objetos (geometria, material)
	// - Transformaciones 
	// - Organizar el grafo

	// Objeto contenedor de cubo y esfera
	conjunto = new THREE.Object3D();
	conjunto.position.y = 1;//la matriz de modelo tenga una traslacion, todos los objetos se suben en una unidad.

	// Cubo
	var geoCubo = new THREE.BoxGeometry(2,2,2);
	var matCubo = new THREE.MeshBasicMaterial( {color:'green',wireframe:true} );//Material del cubo
	cubo = new THREE.Mesh( geoCubo, matCubo );
	cubo.position.x = 2;

	// Esfera
	var geoEsfera = new THREE.SphereGeometry( 1, 30, 30 );
	var material = new THREE.MeshBasicMaterial( {color:'yellow', wireframe: true} );
	esfera = new THREE.Mesh( geoEsfera, material );
	esfera.position.x=-2
	//Triangulo
	/*var starPoints = [];
	
	starPoints.push( new THREE.Vector2 (   0,  3 ) );
	starPoints.push( new THREE.Vector2 (  1,  0 ) );
	starPoints.push( new THREE.Vector2 (  4,  0 ) );
	starPoints.push( new THREE.Vector2 (  2, -1 ) );
	starPoints.push( new THREE.Vector2 (  3, -5 ) );
	starPoints.push( new THREE.Vector2 (   0, -2 ) );
	starPoints.push( new THREE.Vector2 ( -3, -5 ) );
	starPoints.push( new THREE.Vector2 ( -2, -1 ) );
	starPoints.push( new THREE.Vector2 ( -4,  0 ) );
	starPoints.push( new THREE.Vector2 ( -1,  0) );
	
	var starShape = new THREE.Shape( starPoints );

	var extrusionSettings = {
		size: 0, height: 0, curveSegments: 0,
		bevelThickness: 0, bevelSize: 0, bevelEnabled: false,
		material: 0, extrudeMaterial: 0
	};
	
	var starGeometry = new THREE.ExtrudeGeometry( starShape, extrusionSettings );
	
	var materialFront = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	var materialSide = new THREE.MeshBasicMaterial( { color: 0xff8800 } );
	var materialArray = [ materialFront, materialSide ];
	var starMaterial = new THREE.MeshFaceMaterial(materialArray);
	
	var star = new THREE.Mesh( starGeometry, starMaterial );
	star.position.set(0,4,3);
	conjunto.add(star);*/


	// Suelo
	var geoSuelo = new THREE.PlaneGeometry(10,10,12,12);
	var matSuelo = new THREE.MeshBasicMaterial( {color:'grey', wireframe: false} );
	var suelo = new THREE.Mesh( geoSuelo, matSuelo );
	suelo.rotation.x = -Math.PI/2;
	suelo.position.y = -0.1;

	// Objeto importado
	var loader = new THREE.ObjectLoader();
	loader.load( 'models/touareg/scene.json', 
		         function (objeto){
                    objeto.position.y = -1;
                    objeto.scale.set(0.0005,0.0005,0.0005); 
		         	cubo.add(objeto);

		         	// Movimiento interpolado del objeto
		         	var salto = new TWEEN.Tween( objeto.position ).
		         	            to( {x: [0.2,0.3,0.5],
		         	            	 y: [0.1,0.5,0.3],
		         	            	 z: [0,0,0]}, 1000);
		         	salto.easing( TWEEN.Easing.Bounce.Out );
		         	salto.interpolation( TWEEN.Interpolation.Bezier );
		         	salto.start();

		         	var volver = new TWEEN.Tween( objeto.position );
		         	volver.to( {x:0,y:-1,z:0}, 2000);
		         	salto.chain( volver );
		         	volver.chain( salto );

		         });

	loader.load( 'models/nissan/model.json', 
	         function (objeto){
                objeto.position.y = -1;
                //objeto.scale.set(1,0.0005,0.0005); 
	         	conjunto.add(objeto);

	         	// Movimiento interpolado del objeto
	         	var salto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [0.2,0.3,0.5],
	         	            	 y: [0.1,0.5,0.3],
	         	            	 z: [0,0,0]}, 1000);
	         	salto.easing( TWEEN.Easing.Bounce.Out );
	         	salto.interpolation( TWEEN.Interpolation.Bezier );
	         	salto.start();

	         	var volver = new TWEEN.Tween( objeto.position );
	         	volver.to( {x:0,y:-1,z:0}, 2000);
	         	salto.chain( volver );
	         	volver.chain( salto );

	         });

	// Texto
	var fontLoader = new THREE.FontLoader();
	fontLoader.load( 'fonts/gentilis_bold.typeface.json',
		             function(font){
		             	var geoTexto = new THREE.TextGeometry( 
		             		'SOLDADO',
		             		{
		             			size: 0.5,
		             			height: 0.1,
		             			curveSegments: 3,
		             			style: "normal",
		             			font: font,
		             			bevelThickness: 0.05,
		             			bevelSize: 0.04,
		             			bevelEnabled: true
		             		});
		             	var matTexto = new THREE.MeshBasicMaterial( {color:'red'} );
		             	var texto = new THREE.Mesh( geoTexto, matTexto );
		             	scene.add( texto );
		             	texto.position.x = -1;
		             });


	// Grafo
	conjunto.add( cubo );
	conjunto.add( esfera );

	scene.add( conjunto );
	star.add( new THREE.AxesHelper(3) );
	scene.add(new THREE.AxesHelper(2));
	scene.add( suelo );
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

	// Controles
	effectControls = {
		mensaje: "Interfaz",
		posY: 1.0,
		separacion: [],
		caja: true,
		color: "rgb(255,255,0)"
	};

	// Interfaz
	var gui = new dat.GUI();
	var folder = gui.addFolder("Interfaz SOLDADO");
	folder.add( effectControls, "mensaje" ).name("App");
	folder.add( effectControls, "posY", 1.0, 3.0, 0.1 ).name("Subir/Bajar");
	folder.add( effectControls, "separacion", {Ninguna:0, Media:1, Maxima:2} ).name("Separacion");
	folder.add( effectControls, "caja" ).name("Ver a Mario");
	folder.addColor( effectControls, "color" ).name("Color esfera");
}

function update()
{
	// Cambiar propiedades entre frames

	// Tiempo transcurrido
	var ahora = Date.now();
	// Incremento de 20º por segundo
	angulo += Math.PI/9 * (ahora-antes)/1000;
	antes = ahora;

	esfera.rotation.y = angulo;
	conjunto.rotation.y = angulo/10;

	// Cambio por demanda de usuario
	conjunto.position.y = effectControls.posY;
	esfera.position.x = -effectControls.separacion;
	cubo.visible = effectControls.caja;
	esfera.material.setValues( {color:effectControls.color} );

	// Actualizar interpoladores
	TWEEN.update();
}

function render() {
	// Blucle de refresco
	requestAnimationFrame( render );//callback
	update();
	renderer.render( scene, camera );//render renderize de la escena y camara
}
