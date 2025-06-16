const bucket1 = document.querySelector("#bucket1");
const counter1 = document.querySelector("#counterText1");
const bucketsContainer = document.querySelector(".buckets");
const addJarBtn = document.querySelector(".add-jar-btn");
const messageBox = document.querySelector(".message-box");

let bucket2 = null;
let cubeCount = 0;
let bucket2Count = 0;
const maxCubes = 10;
const cubeSize = 50;
const bucketHeight = 250;
let canAddCubes = false;
let hasStarted = false;

// Initial message
showMessage("Let's learn about place value!");

addJarBtn.textContent = "GO";
addJarBtn.style.display = "block";

addJarBtn.addEventListener("click", () => {
  if (addJarBtn.textContent === "GO") {
    canAddCubes = true;
    hasStarted = true;
    showMessage("Click the purple box to add a block.");
    addJarBtn.style.display = "none";

  } else if (addJarBtn.textContent === "Add Jar") {
    if (!bucket2) {
      const wrapper = document.createElement("div");

      const counter2 = document.createElement("div");
      counter2.classList.add("counter");
      counter2.id = "bucket2Counter";
      counter2.innerHTML = `<p id="counterText2">0</p>`;

      bucket2 = document.createElement("div");
      bucket2.classList.add("bucket");
      bucket2.id = "bucket2";

      wrapper.appendChild(counter2);
      wrapper.appendChild(bucket2);
      bucketsContainer.appendChild(wrapper);

      showMessage("Let's group 10 blocks Click a block to make a rod.");
    }

    jarCreated = true; // ✅ Mark it so reset won't show Add Jar again
    addJarBtn.textContent = "Restart";
    addJarBtn.style.display = "block";

  } else if (addJarBtn.textContent === "Restart") {
    window.location.reload();
  }
});


bucket1.addEventListener("click", (e) => {
  if (!canAddCubes) return;

  if (cubeCount >= maxCubes) {
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

  bucket1.appendChild(cube);
  cubeCount++;

  if (cubeCount >= maxCubes) {
    counter1.innerHTML = "<span style='color: red;'>X</span>";
    addJarBtn.textContent = "Add Jar";
    addJarBtn.style.display = "block";
    enableCubeTransfer();
    showMessage("Whoops! This box is full with 10 blocks.");
  } else {
    counter1.textContent = cubeCount;
    showMessage(`Let's keep adding blocks!`);
  }
});

function enableCubeTransfer() {
  const cubes = bucket1.querySelectorAll(".cube");
  cubes.forEach(cube => {
    cube.addEventListener("click", () => {
      animateCubesToward(cube);
    }, { once: true });
  });
}

function animateCubesToward(targetCube) {
  const cubes = bucket1.querySelectorAll(".cube");
  const targetRect = targetCube.getBoundingClientRect();
  const bucketRect = bucket1.getBoundingClientRect();

  const targetX = targetRect.left - bucketRect.left;
  const targetY = targetRect.top - bucketRect.top;

  let completed = 0;
  cubes.forEach(cube => {
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
        completed++;
        if (completed === cubes.length - 1) {
          spawnRodCube(targetX, targetY);
          resetBucket1();
        }
      }
    });
  });
}

function spawnRodCube(x = 50, y = 30) {
  if (!bucket2) return;

  const rod = document.createElement("div");
  rod.classList.add("super-rod");

  for (let i = 0; i < 10; i++) {
    const miniCube = document.createElement("div");
    miniCube.classList.add("mini-cube");
    rod.appendChild(miniCube);
  }

  const maxX = bucket2.clientWidth - 50;
  const randomX = Math.floor(Math.random() * maxX);
  rod.style.left = `${randomX}px`;
  rod.style.top = `50px`;

  bucket2.appendChild(rod);
  bucket2Count++;

  const counter2 = document.querySelector("#counterText2");
  if (counter2) counter2.textContent = bucket2Count;

  // ✅ Trigger bucket2 vibration
  bucket2.classList.add("vibrate");
  setTimeout(() => bucket2.classList.remove("vibrate"), 300);

  showMessage(`Great job That's 1 rod of 10 cubes`);

  enableRodReverseTransfer();
}


function resetBucket1() {
  bucket1.innerHTML = "";
  cubeCount = 0;
  counter1.textContent = "0";
  canAddCubes = false;

  // ✅ Only show GO/Add Jar if jar was not created
  if (!jarCreated) {
    addJarBtn.textContent = "GO";
  } else {
    addJarBtn.textContent = "Restart";
  }
  addJarBtn.style.display = "block";
}

function restoreCubesToBucket1() {
  const bucketWidth = bucket1.clientWidth;

  for (let i = 0; i < 10; i++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");

    const x = Math.floor(Math.random() * (bucketWidth - cubeSize));
    const y = Math.floor(Math.random() * (bucketHeight - cubeSize));

    cube.style.left = `${x}px`;
    cube.style.top = `${y}px`;
    cube.style.opacity = 0;

    bucket1.appendChild(cube);

    gsap.to(cube, {
      opacity: 1,
      duration: 0.3,
      delay: i * 0.05
    });
  }

  // ✅ Vibrate bucket1 when restored
  bucket1.classList.add("vibrate");
  setTimeout(() => bucket1.classList.remove("vibrate"), 300);

  cubeCount = 10;
  counter1.innerHTML = "<span style='color: red;'>X</span>";

  // 🛠️ Proper button text logic
  if (bucket2) {
    addJarBtn.textContent = "Restart";
  } else {
    addJarBtn.textContent = "Add Jar";
  }
  addJarBtn.style.display = "block";

  // Update Bucket 2 Counter
  const counter2 = document.querySelector("#counterText2");
  bucket2Count = Math.max(0, bucket2Count - 1);
  if (counter2) counter2.textContent = bucket2Count;

  showMessage("There they are! 10 single blocks again.");
  enableCubeTransfer();
}




function enableRodReverseTransfer() {
  const rods = bucket2.querySelectorAll(".super-rod");
  rods.forEach(rod => {
    rod.addEventListener("click", () => {
      gsap.to(rod, {
        duration: 0.5,
        y: 50,
        opacity: 0,
        onComplete: () => {
          rod.remove();
          restoreCubesToBucket1();
        }
      });
    }, { once: true });
  });
}

// Message logic: stays fixed, changes after GO
function showMessage(text) {
  if (!hasStarted && text !== "Let's learn about place value!") return;
  if (messageBox) messageBox.textContent = text;
}

