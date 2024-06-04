import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as data from '../Pages/occupancy_data.json';

interface ModelingPageProps {
  distances: number[];
  videoTime: number;
}

const ModelingPage: React.FC<ModelingPageProps> = ({distances, videoTime}) => {
  //Added for click and drag movement
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsRef = useRef<THREE.Mesh[]>([]);
  const parentRef = useRef<THREE.Object3D | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);

  let occupiedSpotsArrays: number[][] = [];   //keeps track of which spots are occupied

  const data2: {[key: string]: string}[] = data;  //convert to string key return string

  for(let i = 0; i < data2.length; i++){
    let occupiedSpots: number[] = [];   //keeps track of which spots are occupied
    const status = data2[i];
    let k = 0;
    //console.log(data2[i]);
    for(const key in status){
      if(status[key] === 'occupied'){
        occupiedSpots.push(1);
      }else{
        occupiedSpots.push(0);
      }
      k++;
    }

    occupiedSpotsArrays.push(occupiedSpots);
  }

  const [verticalHeight, setVerticalHeight] = useState(0);  //vertical height of parking lot
  const [horizontalHeight, setHorizontalHeight] = useState(0);  //horizontal height of parking lot

  const [HeightRatio, setHeightRatio] = useState(1); //HEIGHT OF PARKINGLOT / WIDTH OF PARKING LOT

  const [parkingLineLength, setParkingLineLength] = useState(2);//length from top to bottom of a parking line
    
  const [runBuild, setRunBuild] = useState(false);  //Controls whether the parking lot is built or not

  useEffect(() => {
    if (distances.length == 4) {  //when given the distances from the DistanceButton, updates parking lot dimensions
      setHorizontalHeight(distances[0]);
      setVerticalHeight(distances[1]);
      setParkingLineLength(6 / distances[0] * distances[3]);
    }
    if (horizontalHeight > 0){  //Made because the parking lot was not rendering, added horizontalHeigth to dependencies
      setHeightRatio(verticalHeight/horizontalHeight);
      setRunBuild(true);
    }
    
  }, [distances, horizontalHeight]);

  useEffect(() => {
    //prevents parking lot from being built immediatly
    if(!runBuild){  
      return;
    }

    //create objects for 3JS enviroment
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff); //set background to white

    //Added to enable click and drag movement
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    document.body.appendChild(renderer.domElement);

    //parent used to group objects for rotation with mouse
    const parent = new THREE.Object3D();
    parentRef.current = parent;
    scene.add(parent);
    

    //START OF PARKING LOT CREATION
    const geometry = new THREE.BoxGeometry(6, 6*HeightRatio, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const rectangle = new THREE.Mesh(geometry, material);
    rectangle.position.set(0, 0, 0); 
    parent.add(rectangle);
    objectsRef.current.push(rectangle);

    const geometry3 = new THREE.BoxGeometry(6, 0.25, 0.3); 
    const material3 = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
    const topSideWalk = new THREE.Mesh(geometry3, material3);
    topSideWalk.position.set(0, 6*(HeightRatio/2), 0); 
    parent.add(topSideWalk);
    objectsRef.current.push(topSideWalk);

    const geometry4 = new THREE.BoxGeometry(6, 0.25, 0.3); 
    const material4 = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
    const bottomSideWalk = new THREE.Mesh(geometry4, material4);
    bottomSideWalk.position.set(0, -6*(HeightRatio/2), 0); 
    parent.add(bottomSideWalk);
    objectsRef.current.push(bottomSideWalk);


    var numberOfKeys = Object.keys(data2[0]).length;
    let numOfParkingLines = numberOfKeys + 2;         //CHANGE FOR THE NUMBER OF PARKING SPOTS (THERE ARE TWO MORE PARKING LINES THAN SPOTS)

  
    let parkingSpotWidth = 6/ (numOfParkingLines/2-1)       //width of the parking lot / one row of the parking spots
   

    const parkingLineGeometry = new THREE.BoxGeometry(0.075, parkingLineLength, 0.1); //Setup geometry and materials for parking lines
    const parkingLineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500 });

    const geometryParking = new THREE.BoxGeometry(parkingSpotWidth, parkingLineLength, 0.1);  //Setup geometry and materials for parking spots
    const materialParking = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });

    const allParkingSpaces: THREE.Mesh[] = [];

    let parkingSpotsXPosition: number[] = []; //keeps track of the x position of all parking spots

    let parkingSpotsYPosition: number[] = []; //keeps track of the y position of all parking spots

    //Generates the bottom row of parking lines and parking spots
    for (let i = 0; i < numOfParkingLines/2; i++) {

      const parkingLine = new THREE.Mesh(parkingLineGeometry, parkingLineMaterial);

      const totalWidth = 6 / (numOfParkingLines/2 - 1+0.075);  //Have to add half of the parking line width so it doesnt go over
      
      const positionX = 3 - (i * totalWidth) -0.0375; //accounts for the width of half of the parking line
      const positionY = -6*(HeightRatio/2) + 0.1125 + (parkingLineLength/2); //account for half the height of the bottom sidewalk
      const positionZ = 0.02; 
      
      parkingLine.position.set(positionX, positionY, positionZ);
      
      parent.add(parkingLine);
      
      objectsRef.current.push(parkingLine);

      if(i > 0){  //one more parking like and space 
        const positionX2 = 3 - i*(6/(numOfParkingLines/2 - 1)) + parkingSpotWidth/2 - 0.0375; //full width - half the width of a parking spot - half the width of a parking line

        const positionZ2 = 0.02; 

        const parkingSpot = new THREE.Mesh(geometryParking, materialParking);
        parkingSpot.position.set(positionX2, positionY, positionZ2 ); 
        parent.add(parkingSpot);

        allParkingSpaces.push(parkingSpot); //push spaces to array

        parkingSpotsXPosition.push(positionX2);

        parkingSpotsYPosition.push(positionY);
      }
      
    }

    //Generates the top row of parking lines and parking spots
    for (let i = 0; i < numOfParkingLines/2; i++) {

      const parkingLine = new THREE.Mesh(parkingLineGeometry, parkingLineMaterial);

      const totalWidth = 6 / (numOfParkingLines/2 - 1+0.075);  //Have to add half of the parking line width so it doesnt go over
      
      const positionX = 3 - (i * totalWidth) -0.0375; //accounts for the width of half of the parking line
      const positionY = 6*(HeightRatio/2) - 0.1125 - (parkingLineLength/2); //account for half the height of the bottom sidewalk
      const positionZ = 0.02; 
      
      parkingLine.position.set(positionX, positionY, positionZ);
      
      parent.add(parkingLine);
      
      objectsRef.current.push(parkingLine);

      if(i > 0){  //one more parking like and space 
        const positionX2 = 3 - i*(6/(numOfParkingLines/2 - 1)) + parkingSpotWidth/2 - 0.0375; //full width - half the width of a parking spot - half the width of a parking line

        const positionZ2 = 0.02; 

        const parkingSpot = new THREE.Mesh(geometryParking, materialParking);
        parkingSpot.position.set(positionX2, positionY, positionZ2 ); 
        parent.add(parkingSpot);

        allParkingSpaces.push(parkingSpot); //push spaces to array

        parkingSpotsXPosition.push(positionX2);

        parkingSpotsYPosition.push(positionY);
      }
      
    } 

    let occupiedSpotsSelected: number[] = occupiedSpotsArrays[videoTime-1];

    let lastOccupied : String[] = [];   //keeps track of when the last time each spot was occupied

    for(let i = 0; i < numOfParkingLines - 2; i++){
      lastOccupied.push("NA");
    }

    //adds last occupied times to the last occupied array
    for(let k = 0; k <= videoTime-1; k++){
      for(let i = 0; i < numOfParkingLines - 2; i++){
        if(occupiedSpotsArrays[k][i] == 1){
          let timeMessage = Math.floor((k+1)/60) + ':';
          if((k+1)%60 < 10){
            timeMessage += '0' + (k+1)%60;
          }else{
            timeMessage += (k+1)%60;
          }
          lastOccupied[i] = (timeMessage);
        }else{
        }
      } 
    }

    //Generates the cars for each spot if occupied
    for(let i = 0; i < occupiedSpotsSelected.length; i++){
      if(occupiedSpotsSelected[i] == 1){
        const loader = new GLTFLoader();
        loader.load('CarFolder/scene.gltf',
        function (gltf) {
          const carModel = gltf.scene;
          carModel.scale.set(0.01, 0.01, 0.01);
          const rotationX = Math.PI/2; 
          const rotationY = Math.PI/2; 

          carModel.rotation.set(rotationX, rotationY, 0);
          
          carModel.position.set(parkingSpotsXPosition[i]-0.35, parkingSpotsYPosition[i]+0.65, 0.05);
          parent.add(carModel);
        });
      }
    }

    camera.position.z = 5;

    //Next three functions handle mouse movement on the 3D object and rotation.
    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = (event.clientX / window.innerWidth) * 2 - 1 - mouseRef.current.x;
        const deltaY = -(event.clientY / window.innerHeight) * 2 + 1 - mouseRef.current.y;
        parentRef.current!.rotation.y += deltaX * 0.5; 
        parentRef.current!.rotation.x += deltaY * 0.5;
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    const previewWindow = document.createElement('div');
    previewWindow.classList.add('preview-window');
    document.body.appendChild(previewWindow);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    //IMPLEMENTS HOVERING OVER DIFFERENT PARKING SPOTS
    function onMouseMove(event: MouseEvent) {
      
      const rect = renderer.domElement.getBoundingClientRect();
      
      mouse.x = ((event.clientX - rect.left) / renderer.domElement.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / renderer.domElement.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const selectedParkingSpot= new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.25 });

      const intersections: THREE.Intersection[][] = [];

      // Push intersects array into intersections array
      allParkingSpaces.forEach((parkingSpaceTemp, index) => {
          const intersects = raycaster.intersectObject(parkingSpaceTemp);
          intersections.push(intersects); 
      });
      
      previewWindow.style.display = 'none';

      // Loop through intersections array
      for(let k = 0; k < intersections.length; k += 1){
          const intersects = intersections[k];
          const parkingSpace = allParkingSpaces[k]; // Get corresponding parking space
          if (intersects.length > 0) {
            let status :String = "EMPTY";
            if(occupiedSpotsSelected[k] == 1){  //update status of parking spot
              status = "IN USE";
            }
            
              previewWindow.innerText = `Parking Spot ${k + 1}:\n Status: ${status} \nLast Used: ${lastOccupied[k]}`;
              parkingPreviewWindow(event.clientX, event.clientY, parkingSpace.position);
              parkingSpace.material = selectedParkingSpot; // Update material of the parking space
          }else{
            parkingSpace.material = materialParking;
          }
      }
    //Grabs locations of objects to pick up collision
    }

    //Checks location for preview window and changes based on the mouse position.
    function parkingPreviewWindow(clientX: number, clientY: number, position: THREE.Vector3) {
      previewWindow.style.display = 'block';
      const scrollX = document.documentElement.scrollLeft;
      const scrollY = document.documentElement.scrollTop;
      previewWindow.style.left = `${clientX + scrollX}px`;
      previewWindow.style.top = `${clientY + scrollY}px`;
    }

    document.addEventListener('mousemove', onMouseMove, false);
      

    // Renders the 3JS Objects
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      renderer.dispose();

    }; 
  }, [HeightRatio, runBuild]);

  return null; 
};

export default ModelingPage;
