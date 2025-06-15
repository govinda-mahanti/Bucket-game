const bucket1 = document.querySelector("#bucket1");
const counter1 = document.querySelector("#counterText1");
const bucketsContainer = document.querySelector(".buckets");
const addJarBtn = document.querySelector(".add-jar-btn");

let bucket2 = null;
let cubeCount = 0;
const maxCubes = 10;
const cubeSize = 50;
const bucketHeight = 250;
let canAddCubes = false;
let bucket2Count = 0;

addJarBtn.textContent = "GO";
addJarBtn.style.display = "block";

addJarBtn.addEventListener("click", () => {
  if (addJarBtn.textContent === "GO") {
    canAddCubes = true;
    addJarBtn.style.display = "none";
  } else if (addJarBtn.textContent === "Add Jar") {
    if (bucket2) return;

    const bucketWrapper = document.createElement("div");

    const counter2 = document.createElement("div");
    counter2.classList.add("counter");
    counter2.innerHTML = `<p id="counterText2">0</p>`;

    bucket2 = document.createElement("div");
    bucket2.classList.add("bucket");
    bucket2.id = "bucket2";

    bucketWrapper.appendChild(counter2);
    bucketWrapper.appendChild(bucket2);
    bucketsContainer.appendChild(bucketWrapper);
  }
});

bucket1.addEventListener("click", (e) => {
  if (!canAddCubes) return;

  if (cubeCount >= maxCubes) {
    // Add vibrate effect
    bucket1.classList.add("vibrate");
    setTimeout(() => bucket1.classList.remove("vibrate"), 200);
    return;
  }

  const rect = bucket1.getBoundingClientRect();
  const x = e.clientX - rect.left - cubeSize / 2;
  const y = e.clientY - rect.top - cubeSize / 2;

  const cube = document.createElement("div");
  cube.classList.add("cube");
  cube.style.left = `${x}px`;
  cube.style.top = `${y}px`;
  cube.draggable = true;

  bucket1.appendChild(cube);
  cubeCount++;

  if (cubeCount >= maxCubes) {
    counter1.textContent = "X";
    counter1.style.cursor = "pointer";
    addJarBtn.textContent = "Add Jar";
    addJarBtn.style.display = "block";
  } else {
    counter1.textContent = cubeCount;
  }
});

document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("cube")) {
    e.dataTransfer.setData("text/plain", "drag-cube");

    const draggedCube = e.target;
    draggedCube.classList.add("dragged");

    animateCubesToward(draggedCube);
  } else if (e.target.classList.contains("super-rod")) {
    e.dataTransfer.setData("text/plain", "drag-rod");
    e.target.setAttribute("id", "dragging-rod");
  }
});

document.addEventListener("dragover", (e) => e.preventDefault());

document.addEventListener("drop", (e) => {
  const bucket1Rect = bucket1.getBoundingClientRect();
  const bucket2Rect = bucket2?.getBoundingClientRect();

  const inBucket2 = bucket2 &&
    e.clientX >= bucket2Rect.left &&
    e.clientX <= bucket2Rect.right &&
    e.clientY >= bucket2Rect.top &&
    e.clientY <= bucket2Rect.bottom;

  const inBucket1 =
    e.clientX >= bucket1Rect.left &&
    e.clientX <= bucket1Rect.right &&
    e.clientY >= bucket1Rect.top &&
    e.clientY <= bucket1Rect.bottom;

  const dragType = e.dataTransfer.getData("text/plain");

  if (dragType === "drag-cube" && inBucket2) {
    spawnRodCube();
    resetBucket1();
  }

  if (dragType === "drag-rod" && inBucket1) {
    const rod = document.getElementById("dragging-rod");
    if (rod) {
      rod.remove();
      restoreCubesToBucket1();
    }
  }

  const dragged = document.querySelector(".dragged");
  if (dragged) dragged.classList.remove("dragged");
});

function spawnRodCube() {
  if (!bucket2) return;

  const rod = document.createElement("div");
  rod.classList.add("super-rod");
  rod.draggable = true;

  for (let i = 1; i <= 10; i++) {
    const miniCube = document.createElement("div");
    miniCube.classList.add("mini-cube");
    rod.appendChild(miniCube);
  }

  const maxX = bucket2.clientWidth - 50;
  const randomX = Math.floor(Math.random() * maxX);
  rod.style.left = `${randomX}px`;
  rod.style.top = `30px`;
  bucket2.appendChild(rod);

  bucket2Count += 1;
  const counter2 = document.querySelector("#counterText2");
  if (counter2) counter2.textContent = bucket2Count;
}

function resetBucket1() {
  bucket1.innerHTML = "";
  cubeCount = 0;
  counter1.textContent = "0";
  counter1.style.cursor = "default";
  addJarBtn.textContent = "GO";
  addJarBtn.style.display = "block";
  canAddCubes = false;
}

function restoreCubesToBucket1() {
  const bucketWidth = bucket1.clientWidth;

  for (let i = 0; i < 10; i++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.draggable = true;

    const x = Math.floor(Math.random() * (bucketWidth - cubeSize));
    const y = Math.floor(Math.random() * (bucketHeight - cubeSize));

    cube.style.left = `${x}px`;
    cube.style.top = `${y}px`;

    bucket1.appendChild(cube);
  }

  cubeCount = 10;
  counter1.textContent = "X";
  addJarBtn.textContent = "Add Jar";
  addJarBtn.style.display = "block";

  bucket2Count = Math.max(0, bucket2Count - 1);
  const counter2 = document.querySelector("#counterText2");
  if (counter2) counter2.textContent = bucket2Count;
}

// 🧲 Animate all cubes toward dragged cube
function animateCubesToward(targetCube) {
  const cubes = bucket1.querySelectorAll(".cube");

  const targetRect = targetCube.getBoundingClientRect();
  const bucketRect = bucket1.getBoundingClientRect();

  const targetX = targetRect.left - bucketRect.left;
  const targetY = targetRect.top - bucketRect.top;

  cubes.forEach((cube) => {
    if (cube === targetCube) return;

    const rect = cube.getBoundingClientRect();
    const x = rect.left - bucketRect.left;
    const y = rect.top - bucketRect.top;

    const dx = targetX - x;
    const dy = targetY - y;

    gsap.to(cube, {
      duration: 0.5,
      x: dx,
      y: dy,
      ease: "power2.inOut",
      onComplete: () => {
        cube.style.transform = "none";
        cube.style.left = `${targetX}px`;
        cube.style.top = `${targetY}px`;
      }
    });
  });
}
