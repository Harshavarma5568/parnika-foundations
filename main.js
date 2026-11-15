
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

// ======================================
// 7. THREE.JS ARCHITECTURAL EXPERIENCE
// ======================================

const canvas = $('#architecture-scene');

if (canvas) {

  try {

    // SCENE

    const scene = new THREE.Scene();

    scene.background = new THREE.Color('#17251d');

    scene.fog = new THREE.Fog(
      '#17251d',
      13,
      28
    );

    // CAMERA

    const camera = new THREE.PerspectiveCamera(
      34,
      1,
      0.1,
      100
    );

    camera.position.set(
      8.8,
      6.4,
      10.5
    );

    // RENDERER

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.7)
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.15;

    // WORLD

    const world = new THREE.Group();

    scene.add(world);

    // MATERIALS

    const material = (
      color,
      roughness = 0.72,
      metalness = 0
    ) => {

      return new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness
      });

    };

    const stone = material('#d6d0bf');

    const pale = material('#eee8d9');

    const dark = material('#46584a');

    const glass = new THREE.MeshPhysicalMaterial({
      color: '#78958a',
      roughness: 0.18,
      metalness: 0.15,
      transparent: true,
      opacity: 0.72
    });

    const bronze = material(
      '#b79a69',
      0.35,
      0.6
    );

    const groundMaterial = material('#536b56');

    // ==================================
    // LIGHTING
    // ==================================

    const ambient = new THREE.HemisphereLight(
      '#e8e2cf',
      '#334638',
      2.1
    );

    scene.add(ambient);

    const sun = new THREE.DirectionalLight(
      '#ffe5bd',
      3.2
    );

    sun.position.set(-5, 10, 7);

    sun.castShadow = true;

    sun.shadow.mapSize.set(1024, 1024);

    scene.add(sun);

    const fill = new THREE.PointLight(
      '#c2d6c4',
      1.3,
      22
    );

    fill.position.set(6, 4, -4);

    scene.add(fill);

    // ==================================
    // LAND
    // ==================================

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(35, 35),
      groundMaterial
    );

    ground.rotation.x = -Math.PI / 2;

    ground.position.y = -0.04;

    ground.receiveShadow = true;

    world.add(ground);

    // ==================================
    // ARCHITECTURAL FOUNDATION
    // ==================================

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.34, 6.6),
      material('#9b9b83')
    );

    base.position.y = 0.12;

    base.receiveShadow = true;

    base.castShadow = true;

    world.add(base);

    // MAIN BUILDING

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 2.8, 3.7),
      stone
    );

    body.position.set(0, 1.68, 0);

    body.castShadow = true;

    body.receiveShadow = true;

    world.add(body);

    // UPPER FLOOR

    const upper = new THREE.Mesh(
      new THREE.BoxGeometry(4.15, 1.25, 3.35),
      pale
    );

    upper.position.set(0.28, 3.62, -0.08);

    upper.castShadow = true;

    world.add(upper);

    // ROOF

    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(4.55, 0.16, 3.72),
      dark
    );

    roof.position.set(0.28, 4.34, -0.08);

    roof.castShadow = true;

    world.add(roof);

    // PROJECTING CANOPY

    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(5.7, 0.16, 1.15),
      bronze
    );

    canopy.position.set(0, 2.95, 2.05);

    canopy.castShadow = true;

    world.add(canopy);

    // ==================================
    // GLASS WINDOWS
    // ==================================

    for (
      let x = -1.65;
      x <= 1.66;
      x += 1.1
    ) {

      const windowGlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.78, 1.48, 0.07),
        glass
      );

      windowGlass.position.set(
        x,
        3.55,
        1.61
      );

      world.add(windowGlass);

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.055, 1.55, 0.09),
        bronze
      );

      frame.position.set(
        x - 0.42,
        3.55,
        1.66
      );

      world.add(frame);

    }

    // MAIN ENTRANCE

    const entry = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 2.15, 0.12),
      dark
    );

    entry.position.set(0.15, 1.32, 1.91);

    world.add(entry);

    const entryGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 1.82, 0.04),
      glass
    );

    entryGlass.position.set(0.15, 1.35, 1.99);

    world.add(entryGlass);

    // SIDE WING

    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(1.45, 1.9, 2.5),
      pale
    );

    wing.position.set(2.5, 1.22, -0.25);

    wing.castShadow = true;

    world.add(wing);

    // BALCONY

    const balcony = new THREE.Mesh(
      new THREE.BoxGeometry(2.15, 0.12, 1.05),
      bronze
    );

    balcony.position.set(0.25, 2.85, 2.48);

    world.add(balcony);

    for (let i = 0; i < 7; i++) {

      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.62, 0.035),
        pale
      );

      rail.position.set(
        -0.7 + i * 0.32,
        3.2,
        2.9
      );

      world.add(rail);

    }

    // ENTRANCE STEPS

    const steps = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.12, 0.65),
      pale
    );

    steps.position.set(0.1, 0.42, 3.05);

    world.add(steps);

    // WALKWAY

    const path = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.035, 4.4),
      material('#b9b49e')
    );

    path.position.set(0.15, 0.31, 5.1);

    world.add(path);

    // ==================================
    // LANDSCAPING
    // ==================================

    function createTree(x, z, height = 2.2) {

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.07,
          0.11,
          height * 0.48,
          7
        ),
        material('#675743')
      );

      trunk.position.set(
        x,
        height * 0.24,
        z
      );

      trunk.castShadow = true;

      world.add(trunk);

      const crown = new THREE.Mesh(
        new THREE.IcosahedronGeometry(
          height * 0.31,
          1
        ),
        material('#6d866b')
      );

      crown.position.set(
        x,
        height * 0.62,
        z
      );

      crown.castShadow = true;

      world.add(crown);

      const crown2 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(
          height * 0.22,
          1
        ),
        material('#87987a')
      );

      crown2.position.set(
        x + 0.16,
        height * 0.78,
        z + 0.04
      );

      world.add(crown2);

    }

    createTree(-3.5, 1.9, 2.5);

    createTree(3.8, 1.3, 2.8);

    createTree(-3.2, -2.5, 2.1);

    createTree(3.8, -2.7, 2.4);

    // ==================================
    // GARDEN WALLS
    // ==================================

    const wallMaterial = material('#b5b39f');

    const wallPositions = [
      [-3.4, 0, 0.12, 5.7],
      [3.7, -0.5, 0.12, 4.6],
      [-0.2, -3.15, 7, 0.12]
    ];

    wallPositions.forEach(position => {

      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(
          position[2],
          0.42,
          position[3]
        ),
        wallMaterial
      );

      wall.position.set(
        position[0],
        0.2,
        position[1]
      );

      world.add(wall);

    });

    // ==================================
    // SITE GRID
    // ==================================

    const grid = new THREE.GridHelper(
      30,
      30,
      '#87927c',
      '#637365'
    );

    grid.position.y = -0.025;

    grid.material.transparent = true;

    grid.material.opacity = 0.18;

    world.add(grid);

    // ==================================
    // INTERACTIVE CAMERA
    // ==================================

    let targetX = 0;

    let targetY = 0;

    let dragging = false;

    let lastX = 0;

    let lastY = 0;

    let autoRotate = true;

    canvas.addEventListener(
      'pointerdown',
      event => {

        dragging = true;

        autoRotate = false;

        lastX = event.clientX;

        lastY = event.clientY;

        canvas.setPointerCapture(event.pointerId);

      }
    );

    canvas.addEventListener(
      'pointermove',
      event => {

        if (!dragging) return;

        targetY +=
          (event.clientX - lastX) * 0.006;

        targetX +=
          (event.clientY - lastY) * 0.003;

        targetX = THREE.MathUtils.clamp(
          targetX,
          -0.22,
          0.28
        );

        lastX = event.clientX;

        lastY = event.clientY;

      }
    );

    const stopDragging = () => {
      dragging = false;
    };

    canvas.addEventListener(
      'pointerup',
      stopDragging
    );

    canvas.addEventListener(
      'pointercancel',
      stopDragging
    );

    // ==================================
    // RESPONSIVE RENDERING
    // ==================================

    const resize = () => {

      const width = canvas.clientWidth;

      const height = canvas.clientHeight;

      if (!width || !height) return;

      renderer.setSize(
        width,
        height,
        false
      );

      camera.aspect = width / height;

      camera.updateProjectionMatrix();

    };

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);

    resize();

    // ==================================
    // ANIMATION LOOP
    // ==================================

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const clock = new THREE.Clock();

    function animate() {

      requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      if (autoRotate && !reducedMotion) {

        targetY = Math.sin(time * 0.16) * 0.16;

      }

      world.rotation.y +=
        (targetY - world.rotation.y) * 0.035;

      world.rotation.x +=
        (targetX - world.rotation.x) * 0.035;

      const pulse =
        1 + Math.sin(time * 0.7) * 0.008;

      world.scale.setScalar(pulse);

      camera.lookAt(0, 1.65, 0);

      renderer.render(scene, camera);

    }

    animate();

    // DOUBLE CLICK TO RESET AUTO MOVEMENT

    canvas.addEventListener(
      'dblclick',
      () => {

        autoRotate = true;

        targetX = 0;

      }
    );

  } catch (error) {

    console.warn(
      '3D scene could not initialise:',
      error
    );

    canvas.style.background =
      'linear-gradient(135deg,#344b3c,#101b17)';

  }

}
