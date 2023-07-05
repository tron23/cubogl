/*
** Seminario #3: Iluminacion y Materiales
** @author: rvivo@upv.es
** @date: 3-03-2021
** @dependencies: OrbitControls.js, Tween.js, dat.gui.min.js
*/

"use strict";

// Variables globales estandar
var renderer, scene, camera;

// Objetos
var dodge, audi, nissan, ferrari, touareg, truck, dragon, boat, avion, cubo;
var materialUsuario;

// Control
var cameraControls, effectControls;

// Temporales
var angulo = 0;
var antes = Date.now();

// Acciones
init();
loadScene();
setupGUI();
render();

//Movimiento de los coches
var audisalto, audivolver;
var dodgesalto, dodgevolver;
var nissansalto, nissanvolver;
var ferrarisalto, ferrarivolver;
var touaregsalto, touaregvolver;
var trucksalto, truckvolver;
var dragonsalto, dragonvolver;
var boatsalto, boatvolver;
var avionsalto, avionvolver;
////////////////////////////


//Video
var video, videoImage, videoImageContent, videoTexture;

// Minicamara ................................................
var minicam;

function init() {
	// Funcion de inicializacion de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color(0x000000) );
	renderer.shadowMap.enabled = true;
	renderer.autoClear = false; 
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
    minicam = new THREE.OrthographicCamera(-36,36, 36,-36, -36,360);
    minicam.position.set(0,1,0);
    minicam.up.set(0,0,-1);
    minicam.lookAt(0,-1,0);
    scene.add(minicam);

	// Luces
	/*var ambiental = new THREE.AmbientLight(0x222222);
	ambiental.castShadow = true;

	scene.add(ambiental);*/
/*
	var direccional = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );
	direccional.position.set( 0,1,0 );
	direccional.castShadow = true;
	scene.add( direccional );*/

	var puntual = new THREE.PointLight( 0xFFFFFFF, 1 );
	puntual.position.set( 0, 60, 0 );
	puntual.castShadow = true;
	scene.add( puntual );

	/*var focal = new THREE.SpotLight( 0xFFFFFF, 0.5 );
	focal.position.set( -2, 7, 4 );
	focal.target.position.set( 0,0,0 );
	focal.angle = Math.PI/7;
	focal.penumbra = 0.5;
	focal.castShadow = true;

	scene.add( focal );*/

	// Atender al eventos
	window.addEventListener( 'resize', updateAspectRatio );
    renderer.domElement.addEventListener('dblclick',saltar);
}

function loadScene() {
	// Construye el grafo de escena
	// - Objetos (geometria, material)
	// - Transformaciones 
	// - Organizar el grafo
	dragon = new THREE.Object3D();

	var direccional = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );
	direccional.position.set( 0,1,0 );
	dragon.add(direccional);


	var path = "images/tahir1/";

	// Objetos de la escena
	/*nissan = new THREE.Object3D();
	nissan.name='nissan';
	nissan.position.y = 0;

	dodge = new THREE.Object3D();
	dodge.name='dodge';
	dodge.position.y = 0;

	audi = new THREE.Object3D();
	audi.name='audi';
	audi.position.y = 0;*/

//VIDEO

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

	// Entorno
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
	suelo.rotation.x = -Math.PI/2;
	suelo.position.y = -1;
	suelo.receiveShadow = true;

	// Objeto importado



	var loader2 = new THREE.ObjectLoader();

	loader2.load( 'models/audi/modelaudi8.json', 
	         function (objeto){
	         	objeto.name = 'audi';
                objeto.position.y = 0.3;
                objeto.position.x = -28;
                objeto.position.z = -25;
                objeto.rotation.z= 89.55;
                objeto.scale.set(0.35,0.35,0.35);
				objeto.receiveShadow=true;
		        objeto.castShadow=true;
                audi=objeto;
	         	//conjunto.add(objeto);
	         	audisalto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [-28,-28,-28],
	         	            	 y: [0.3,0.3,0.3],
	         	            	 z: [-25,30,3]}, 10000);
	         	audisalto.easing( TWEEN.Easing.Bounce.Out );
	         	audisalto.interpolation( TWEEN.Interpolation.Bezier );
	         	//audisalto.start();
                // +++
	         	audivolver = new TWEEN.Tween( objeto.position );
	         	audivolver.to( {x:-28,y:0.3,z:-25}, 10000);
				//audisalto.chain( audivolver );
		        //audivolver.chain( audisalto );
		        scene.add(audi);
	         });

	var loader3 = new THREE.ObjectLoader();

	loader3.load( 'models/dodge/dodge.json',
	         function (objeto){
	         	objeto.name = 'dodge';
                objeto.position.y = -1;
                objeto.position.x = -23;
                objeto.position.z = -25;
                objeto.rotation.x= 89.55;
                objeto.rotation.y= -84.83;
				objeto.receiveShadow=true;
		        objeto.castShadow=true;

                objeto.scale.set(0.40,0.40,0.40);
	         	dodge=objeto;
	         	dodgesalto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [-23,-23,-23],
	         	            	 y: [-1,-1,-1],
	         	            	 z: [-25,30,3]}, 9000);
	         	dodgesalto.easing( TWEEN.Easing.Bounce.Out );
	         	dodgesalto.interpolation( TWEEN.Interpolation.Bezier );
	         	//audisalto.start();

                // +++
	         	dodgevolver = new TWEEN.Tween( objeto.position );
	         	dodgevolver.to( {x:-23,y:-1,z:-25}, 10000);
	         	scene.add(dodge);
	         });

	loader3 = new THREE.ObjectLoader();

	loader3.load( 'models/nissan/nissan.json', 
	         function (objeto){
                objeto.position.y = 0;
                objeto.position.x = -17;
                objeto.position.z = -26;
				objeto.rotation.y= -84.83;
                objeto.scale.set(1.5,1.5,1.5);
				objeto.receiveShadow=true;
		        objeto.castShadow=true;              
				nissan=objeto;
	         	nissansalto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [-17,-17,-17],
	         	            	 y: [0,0,0],
	         	            	 z: [-26,30,3]}, 8000);
	         	nissansalto.easing( TWEEN.Easing.Bounce.Out );
	         	nissansalto.interpolation( TWEEN.Interpolation.Bezier );
	         	//audisalto.start();

                // +++
	         	nissanvolver = new TWEEN.Tween( objeto.position );
	         	nissanvolver.to( {x:-17,y:0,z:-26}, 10000);
				scene.add(nissan);

	         });

	var loader4 = new THREE.ObjectLoader();

	loader4.load( 'models/ferrari/ferrari.json', 
	         function (objeto){
                objeto.position.y = -0.15;
                objeto.position.x = -13;
                objeto.position.z = -26;
				objeto.rotation.y= 42.41;
				objeto.receiveShadow=true;
		        objeto.castShadow=true;
                objeto.scale.set(0.33,0.33,0.33);
				ferrari=objeto;
	         	ferrarisalto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [-13,-13,-13],
	         	            	 y: [-0.15,-0.15,-0.15],
	         	            	 z: [-26,30,3]}, 7000);
	         	ferrarisalto.easing( TWEEN.Easing.Bounce.Out );
	         	ferrarisalto.interpolation( TWEEN.Interpolation.Bezier );
	         	//audisalto.start();

                // +++
	         	ferrarivolver = new TWEEN.Tween( objeto.position );
	         	ferrarivolver.to( {x:-13,y:-0.15,z:-26}, 10000);
				scene.add(ferrari);

	         });

	var loader1 = new THREE.ObjectLoader();
	loader1.load( 'models/touareg/scene5.json', 
	         function (objeto){
	         	console.log("objetoid"+ objeto.id);
	         	touareg=objeto.name;
                objeto.position.y = -1;
                objeto.position.x = -8;
                objeto.position.z = -26.1;
                objeto.rotation.y= -89.55;
				objeto.receiveShadow=true;
		        objeto.castShadow=true;
                objeto.scale.set(0.0016,0.0016,0.0016);

                touareg=objeto;
	         	touaregsalto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [-8,-8,-8],
	         	            	 y: [-1,-1,-1],
	         	            	 z: [-26.1,30,3]}, 6000);
	         	touaregsalto.easing( TWEEN.Easing.Bounce.Out );
	         	touaregsalto.interpolation( TWEEN.Interpolation.Bezier );
	         	//audisalto.start();

                // +++
	         	touaregvolver = new TWEEN.Tween( objeto.position );
	         	touaregvolver.to( {x:-8,y:-1,z:-26.1}, 10000);
	         	scene.add(touareg);
				objeto.castShadow = true;  

	         });

	var loader5 = new THREE.ObjectLoader();

	loader5.load( 'models/camion/mining-dump-truck9.json', 
	         function (objeto){
	         	truck=objeto;
                objeto.position.y = -1.25;
                objeto.position.x = 0;
                objeto.position.z = -27.5;
                objeto.rotation.y= -91.1;
				objeto.receiveShadow=true;
		        objeto.castShadow=true;
                objeto.scale.set(0.030,0.030,0.030); 
	         	scene.add(truck);
	         	trucksalto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [0,0,0],
	         	            	 y: [-1.25,-1.25,-1.25],
	         	            	 z: [-27.5,30,3]}, 12000);
	         	trucksalto.easing( TWEEN.Easing.Bounce.Out );
	         	trucksalto.interpolation( TWEEN.Interpolation.Bezier );

                // +++
	         	truckvolver = new TWEEN.Tween( objeto.position );
	         	truckvolver.to( {x:0,y:-1.25,z:-27.5}, 10000);
	         });

	var loader6 = new THREE.ObjectLoader();

	loader6.load( 'models/dragon/dragon.json', 
	         function (objeto){
	         	dragon=objeto;
                objeto.position.y = 4.25;
                objeto.position.x = 0;
                objeto.position.z = -25.5;
                objeto.rotation.z= 0.05;
				objeto.receiveShadow=true;
		        objeto.castShadow=true;
                objeto.scale.set(0.7,0.7,0.7);
				var txdragon = new THREE.TextureLoader().load('models/dragon/dragon_C.jpg');
				objeto.material.setValues({map:txdragon});

	         	scene.add(dragon);
	         	dragonsalto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [0,-25,0],
	         	            	 y: [4.25,50.25,20],
	         	            	 z: [-25.5,35,3]}, 17000);
	         	dragonsalto.easing( TWEEN.Easing.Linear.None );
	         	dragonsalto.interpolation( TWEEN.Interpolation.Bezier );

                // +++
	         	dragonvolver = new TWEEN.Tween( objeto.position );
	         	dragonvolver.to( {x:0,y:4.25,z:-25.5}, 5000);
	         });

	var loader7 = new THREE.ObjectLoader();

	loader7.load( 'models/player2/boat1.json', 
	         function (objeto){
	         	boat=objeto;
                objeto.position.y = 6.5;
                objeto.position.x = -27;
                objeto.position.z = 27;
                objeto.rotation.z= 130.4;


				objeto.receiveShadow=true;
		        objeto.castShadow=true;
                objeto.scale.set(0.025,0.025,0.025);
                scene.add(boat);
	         	boatsalto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [-27,25,0],
	         	            	 y: [6.5,6.5,6.5],
	         	            	 z: [27,27,27]}, 9000);
	         	boatsalto.easing( TWEEN.Easing.Sinusoidal.InOut );
	         	boatsalto.interpolation( TWEEN.Interpolation.Bezier );

                // +++
	         	boatvolver = new TWEEN.Tween( objeto.position );
	         	boatvolver.to( {x:-27,y:6.5,z:27}, 4000);


	         });
	
	var loader7 = new THREE.ObjectLoader();

	loader7.load( 'models/player3/avion2.json', 
	         function (objeto){
	         	avion=objeto;
                objeto.position.y = 20;
                objeto.position.x = 20;
                objeto.position.z = -20;

				objeto.receiveShadow=true;
		        objeto.castShadow=true;
                objeto.scale.set(1,1,1);
	         	scene.add(avion);
	         	avionsalto = new TWEEN.Tween( objeto.position ).
	         	            to( {x: [20,20,20],
	         	            	 y: [20,5,5],
	         	            	 z: [-20,37,3]}, 18000);
	         	avionsalto.easing( TWEEN.Easing.Linear.None );
	         	avionsalto.interpolation( TWEEN.Interpolation.Bezier );

	         	avionvolver = new TWEEN.Tween( objeto.position );
	         	avionvolver.to( {x:20,y:20,z:-20}, 4000);
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

	// Controles
	effectControls = {
		mensaje: "TehryCars S.L",
		roty: 20.0,
		rotx: 43.7,
		separacion: [],
		caja: true,
		color: "rgb(255,0,0)"
	};

	// Interfaz
	var gui = new dat.GUI();
	var folder = gui.addFolder("Interfaz Mario World");
	folder.add( effectControls, "mensaje" ).name("App");
	folder.add( effectControls, "roty", 10.0, 20.0, 0.1 ).name("Girar Dcha/Izq");
	folder.add( effectControls, "rotx", 40.0, 45.0, 0.1 ).name("Girar Arriba/Abajo");
	folder.add( effectControls, "separacion", {Ninguna:0, Media:1, Maxima:2} ).name("Separacion");
	folder.add( effectControls, "caja" ).name("Ver al soldado");
	folder.addColor( effectControls, "color" ).name("Color texto");
}

function update()
{
	// Cambiar propiedades entre frames

	// Tiempo transcurrido
	var ahora = Date.now();
	// Incremento de 20º por segundo
	angulo += Math.PI/9 * (ahora-antes)/1000;
	antes = ahora;

	cubo.rotation.y = angulo;

	//esfera.rotation.y = angulo;
	//conjunto.rotation.y = angulo/10;

	// Cambio por demanda de usuario
	avion.rotation.y = effectControls.roty;
	avion.rotation.x = effectControls.rotx;
	//esfera.position.x = -effectControls.separacion;
	//touareg.material.visible = effectControls.caja;
	//soldado.material.setValues( {color:effectControls.color} );
	// Actualizar interpoladores
	TWEEN.update();

    // 4. Poner el frame en la textura
    if(video.readyState === video.HAVE_ENOUGH_DATA){
        videoImageContent.drawImage(video,0,0);
        if(videoTexture) videoTexture.needsUpdate = true;
    }



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
        // Ver si es audi
    	for(var i=0;i<interseccion.length;i++){
    		    console.log("interseccion["+i+"]= "+ interseccion[i].object);
    	}
        	if(interseccion[0].object.name == 'audi'){
				audisalto.chain(audivolver);
				audisalto.start();
        	}
        	if(interseccion[0].object.name == 'dodge'){
        		dodgesalto.chain(dodgevolver);
        		dodgesalto.start();
        	}
        	if(interseccion[0].object.name == 'nissan'){
        		nissansalto.chain(nissanvolver);
        		nissansalto.start();
        	}
        	if(interseccion[0].object.name == 'ferrari'){
        		ferrarisalto.chain(ferrarivolver);
        		ferrarisalto.start();
        	}
        	if(interseccion[0].object.name == 'touareg'){
        		touaregsalto.chain(touaregvolver);
        		touaregsalto.start();
        	}
        	if(interseccion[0].object.name == 'truck'){
        		trucksalto.chain(truckvolver);
        		trucksalto.start();
				dragonsalto.chain(dragonvolver);
        		dragonsalto.start();
        	}
        	if(interseccion[0].object.name == 'dragon'){
				dragonsalto.chain(dragonvolver);
        		dragonsalto.start();
        	}
        	if(interseccion[0].object.name == 'boat'){
				boatsalto.chain(boatvolver);
        		boatsalto.start();
        	}
        	if(interseccion[0].object.name == 'avion'){
				avionsalto.chain(avionvolver);
        		avionsalto.start();
        	}
    }
}
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

