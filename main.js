
import * as THREE from 'three';

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

const WHATSAPP_NUMBER = '917893148389';
// Replace with the client's official number before launch.

// ======================================
// 1. LOADING SCREEN
// ======================================

const loader = $('#loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader?.classList.add('done');
  }, 450);
});

$('#year').textContent = new Date().getFullYear();

// ======================================
// 2. MOBILE NAVIGATION
// ======================================

const menuButton = $('.menu-toggle');
const nav = $('.navigation');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');

  menuButton.setAttribute(
    'aria-expanded',
    String(open)
  );
});

$$('.navigation a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');

    menuButton?.setAttribute(
      'aria-expanded',
      'false'
    );
  });
});

// ======================================
// 3. SCROLL REVEAL ANIMATIONS
// ======================================

const revealTargets = $$(
  '.intro-title, .intro-copy, .section-heading, .property-card, .location-grid, .gallery-wait, .contact-copy, .enquiry-form'
);

revealTargets.forEach(element => {
  element.classList.add('reveal');
});

if ('IntersectionObserver' in window) {

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add('visible');

          observer.unobserve(entry.target);
        }

      });
    },
    {
      threshold: 0.12
    }
  );

  revealTargets.forEach(element => {
    observer.observe(element);
  });

} else {

  revealTargets.forEach(element => {
    element.classList.add('visible');
  });

}

// ======================================
// 4. PROPERTY FILTERS
// ======================================

$$('.filter').forEach(button => {

  button.addEventListener('click', () => {

    $$('.filter').forEach(item => {
      item.classList.toggle(
        'active',
        item === button
      );
    });

    const selectedType = button.dataset.filter;

    $$('.property-card').forEach(card => {

      const shouldHide =
        selectedType !== 'all' &&
        card.dataset.type !== selectedType;

      card.classList.toggle('hidden', shouldHide);

    });

  });

});

// ======================================
// 5. PROPERTY DETAILS
// ======================================

const propertyDetails = {

  plot: [
    'OPEN PLOTS',
    'Make space for your plans.',
    'Explore open-plot opportunities in the project area. Ask the team for the current layout, plot dimensions, road details, approvals, pricing and availability.'
  ],

  duplex: [
    'DUPLEX HOMES',
    'More room to grow together.',
    'Discover multi-level home possibilities. Contact the team for available configurations, floor plans, built-up area, specifications, pricing and current status.'
  ],

  simplex: [
    'SIMPLEX HOMES',
    'All you need. On one level.',
    'Explore single-level home possibilities. Ask the team for floor plans, plot and built-up areas, specifications, pricing and current availability.'
  ]

};

const modal = $('#property-modal');

function closeModal() {

  modal.classList.remove('open');

  modal.setAttribute('aria-hidden', 'true');

  document.body.style.overflow = '';

}

$$('.details-btn').forEach(button => {

  button.addEventListener('click', () => {

    const details = propertyDetails[button.dataset.id];

    if (!details) return;

    $('#modal-label').textContent = details[0];

    $('#modal-title').textContent = details[1];

    $('#modal-description').textContent = details[2];

    modal.classList.add('open');

    modal.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';

    $('.modal-x').focus();

  });

});

$$('[data-close]').forEach(button => {
  button.addEventListener('click', closeModal);
});

document.addEventListener('keydown', event => {

  if (
    event.key === 'Escape' &&
    modal.classList.contains('open')
  ) {
    closeModal();
  }

});

$('#modal-enquire').addEventListener('click', closeModal);

// ======================================
// 6. WHATSAPP ENQUIRY FORM
// ======================================

$('#enquiry-form').addEventListener('submit', event => {

  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  const data = new FormData(form);

  const phone = String(
    data.get('phone') || ''
  ).replace(/\D/g, '');

  if (phone.length < 8 || phone.length > 15) {

    $('#form-status').textContent =
      'Please enter a valid mobile number.';

    return;
  }

  const message = [

    'Hello Parnika Foundations, I would like to know more about your properties.',

    '',

    'Name: ' + data.get('name'),

    'Mobile: ' + data.get('phone'),

    'Interested in: ' + data.get('interest'),

    'Message: ' + (
      data.get('message') || 'Not provided'
    ),

    '',

    'This enquiry came through the Parnika Foundations website.'

  ].join('\n');

  $('#form-status').textContent =
    'Opening WhatsApp. Please review your enquiry and press Send.';

  window.open(
    'https://wa.me/' +
    WHATSAPP_NUMBER +
    '?text=' +
    encodeURIComponent(message),

    '_blank',

    'noopener,noreferrer'
  );

});


/* =========================================
   7. PARNIKA — BLOCK BY BLOCK HOUSE BUILD
========================================= */

const canvas = $('#architecture-scene');

if (canvas) {
  try {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#073B3A');
    scene.fog = new THREE.Fog('#073B3A', 17, 32);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(8, 6, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const world = new THREE.Group();
    scene.add(world);

    /* LIGHTING */

    scene.add(new THREE.HemisphereLight('#fff4df', '#314b40', 2.2));

    const sun = new THREE.DirectionalLight('#ffe4bd', 3.3);
    sun.position.set(-6, 10, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const fill = new THREE.PointLight('#a6e3d0', 1.5, 24);
    fill.position.set(5, 5, -4);
    scene.add(fill);

    /* MATERIALS */

    const concrete = new THREE.MeshStandardMaterial({
      color: '#c9c8b9',
      roughness: 0.85
    });

    const lightConcrete = new THREE.MeshStandardMaterial({
      color: '#e7e2d3',
      roughness: 0.8
    });

    const brick = new THREE.MeshStandardMaterial({
      color: '#b96b43',
      roughness: 0.9
    });

    const dark = new THREE.MeshStandardMaterial({
      color: '#244b43',
      roughness: 0.65
    });

    const wood = new THREE.MeshStandardMaterial({
      color: '#936447',
      roughness: 0.7
    });

    const glass = new THREE.MeshPhysicalMaterial({
      color: '#8fc5bb',
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.78
    });

    const gold = new THREE.MeshStandardMaterial({
      color: '#d4a45f',
      metalness: 0.55,
      roughness: 0.35
    });

    const green = new THREE.MeshStandardMaterial({
      color: '#39785a',
      roughness: 0.9
    });

    /* GROUND */

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(35, 35),
      new THREE.MeshStandardMaterial({
        color: '#173d35',
        roughness: 1
      })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.15;
    ground.receiveShadow = true;
    world.add(ground);

    const grid = new THREE.GridHelper(30, 30, '#658b78', '#365d4d');
    grid.position.y = -0.13;
    grid.material.transparent = true;
    grid.material.opacity = 0.16;
    world.add(grid);

    /* ANIMATION BLOCK SYSTEM */

    const animatedBlocks = [];
    let sequence = 0;

    function addBlock(x, y, z, width, height, depth, material, delay = null) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
      );

      const target = new THREE.Vector3(x, y, z);

      const start = new THREE.Vector3(
        x + Math.sin(sequence * 2.3) * 3.2,
        y + 3.5 + (sequence % 4) * 0.45,
        z + Math.cos(sequence * 1.7) * 3
      );

      mesh.position.copy(start);
      mesh.scale.setScalar(0.88);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.userData.target = target;
      mesh.userData.start = start.clone();
      mesh.userData.delay = delay ?? sequence * 0.085;

      animatedBlocks.push(mesh);
      world.add(mesh);

      sequence++;
      return mesh;
    }

    /* STAGE 1 — FOUNDATION */

    for (let x = -2.4; x <= 2.41; x += 0.8) {
      for (let z = -1.8; z <= 1.81; z += 0.9) {
        addBlock(
          x, 0.12, z,
          0.78, 0.24, 0.87,
          concrete
        );
      }
    }

    /* STAGE 2 — WALL BLOCKS */

    const blockWidth = 0.76;
    const blockHeight = 0.43;
    const frontZ = 1.95;

    // Front wall, with space for the entrance.
    for (let row = 0; row < 6; row++) {
      for (let col = -3; col <= 3; col++) {
        const x = col * 0.8;

        // Leave a central doorway opening.
        if (Math.abs(x) < 0.55 && row < 4) continue;

        // Leave two window openings.
        const leftWindow = x < -0.7 && x > -1.7 && row >= 2 && row <= 3;
        const rightWindow = x > 0.7 && x < 1.7 && row >= 2 && row <= 3;

        if (leftWindow || rightWindow) continue;

        addBlock(
          x,
          0.35 + row * 0.44,
          frontZ,
          blockWidth,
          blockHeight,
          0.24,
          row % 2 === 0 ? brick : concrete
        );
      }
    }

    // Left and right side walls.
    for (let side of [-1, 1]) {
      for (let row = 0; row < 6; row++) {
        for (let z = -1.5; z <= 1.51; z += 0.8) {
          addBlock(
            side * 2.45,
            0.35 + row * 0.44,
            z,
            0.24,
            blockHeight,
            0.76,
            concrete
          );
        }
      }
    }

    // Back wall.
    for (let row = 0; row < 6; row++) {
      for (let col = -3; col <= 3; col++) {
        addBlock(
          col * 0.8,
          0.35 + row * 0.44,
          -1.95,
          blockWidth,
          blockHeight,
          0.24,
          concrete
        );
      }
    }

    /* STAGE 3 — STRUCTURAL PILLARS */

    for (const x of [-2.35, 2.35]) {
      addBlock(x, 1.65, 1.95, 0.25, 3.1, 0.3, lightConcrete);
    }

    // Door lintel and window supports.
    addBlock(0, 2.16, 1.95, 1.4, 0.28, 0.3, lightConcrete);

    for (const x of [-1.25, 1.25]) {
      addBlock(x, 2.3, 1.95, 0.12, 1.05, 0.3, lightConcrete);
    }

    /* STAGE 4 — ROOF */

    addBlock(0, 3.12, 0, 5.35, 0.32, 4.5, dark);
    addBlock(0, 3.32, 0, 5.05, 0.12, 4.2, lightConcrete);

    // Front architectural fascia.
    addBlock(0, 3.1, 2.18, 5.45, 0.18, 0.18, gold);

    /* STAGE 5 — WINDOWS AND FINISHES */

    // Window glass.
    for (const x of [-1.25, 1.25]) {
      const windowMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.82, 0.92, 0.08),
        glass
      );

      windowMesh.position.set(x, 1.9, 2.09);
      windowMesh.castShadow = true;
      windowMesh.userData.target = windowMesh.position.clone();
      windowMesh.userData.start = windowMesh.position.clone().add(
        new THREE.Vector3(0, 3, 0)
      );
      windowMesh.userData.delay = sequence * 0.085;
      windowMesh.position.copy(windowMesh.userData.start);

      animatedBlocks.push(windowMesh);
      world.add(windowMesh);
      sequence++;
    }

    // Main entrance door.
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 2.05, 0.12),
      wood
    );

    door.userData.target = new THREE.Vector3(0, 1.2, 2.08);
    door.userData.start = new THREE.Vector3(0, 4.5, 2.08);
    door.userData.delay = sequence * 0.085;
    door.position.copy(door.userData.start);
    door.castShadow = true;
    animatedBlocks.push(door);
    world.add(door);
    sequence++;

    // Balcony.
    addBlock(0.5, 2.55, 2.5, 2.5, 0.12, 1.05, gold);

    // Balcony rail.
    addBlock(0.5, 2.9, 3, 2.5, 0.07, 0.07, lightConcrete);

    /* STAGE 6 — STEPS AND LANDSCAPING */

    for (let i = 0; i < 3; i++) {
      addBlock(
        0,
        0.22 - i * 0.055,
        2.6 + i * 0.38,
        1.65 - i * 0.18,
        0.12,
        0.38,
        lightConcrete
      );
    }

    function createTree(x, z, delay) {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.1, 1.1, 8),
        wood
      );

      trunk.userData.target = new THREE.Vector3(x, 0.55, z);
      trunk.userData.start = new THREE.Vector3(x, 3.5, z);
      trunk.userData.delay = delay;
      trunk.position.copy(trunk.userData.start);
      animatedBlocks.push(trunk);
      world.add(trunk);

      const crown = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.65, 1),
        green
      );

      crown.userData.target = new THREE.Vector3(x, 1.45, z);
      crown.userData.start = new THREE.Vector3(x, 4.5, z);
      crown.userData.delay = delay + 0.12;
      crown.position.copy(crown.userData.start);
      crown.castShadow = true;
      animatedBlocks.push(crown);
      world.add(crown);
    }

    createTree(-3.5, 1.3, sequence * 0.085);
    createTree(3.5, 1.3, sequence * 0.085 + 0.2);
    createTree(-3.5, -2.2, sequence * 0.085 + 0.4);

    /* CAMERA AND INTERACTION */

    let targetRotation = 0;
    let currentRotation = 0;
    let dragging = false;
    let lastPointerX = 0;

    canvas.addEventListener('pointerdown', event => {
      dragging = true;
      lastPointerX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener('pointermove', event => {
      if (!dragging) return;

      targetRotation += (event.clientX - lastPointerX) * 0.006;
      lastPointerX = event.clientX;
    });

    const stopDragging = () => {
      dragging = false;
    };

    canvas.addEventListener('pointerup', stopDragging);
    canvas.addEventListener('pointercancel', stopDragging);

    canvas.addEventListener('dblclick', () => {
      targetRotation = 0;
    });

    /* RESPONSIVE RESIZE */

    function resizeScene() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (!width || !height) return;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resizeScene);
    resizeObserver.observe(canvas);
    resizeScene();

    /* BUILD ANIMATION */

    const clock = new THREE.Clock();
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const buildDuration = 8.5;

    function easeOut(value) {
      return 1 - Math.pow(1 - value, 3);
    }

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      animatedBlocks.forEach(mesh => {
        const localTime = reducedMotion
          ? 1
          : (elapsed - mesh.userData.delay) / buildDuration * 2.2;

        const progress = THREE.MathUtils.clamp(localTime, 0, 1);
        const eased = easeOut(progress);

        mesh.position.lerpVectors(
          mesh.userData.start,
          mesh.userData.target,
          eased
        );

        const scale = 0.88 + 0.12 * eased;
        mesh.scale.setScalar(scale);
      });

      // Smooth interactive camera rotation.
      currentRotation += (targetRotation - currentRotation) * 0.045;
      world.rotation.y = currentRotation + Math.sin(elapsed * 0.18) * 0.035;

      camera.lookAt(0, 1.55, 0);
      renderer.render(scene, camera);
    }

    animate();

  } catch (error) {
    console.error('Parnika 3D construction animation error:', error);
    canvas.style.background = 'linear-gradient(135deg,#245c4b,#073B3A)';
  }
}
