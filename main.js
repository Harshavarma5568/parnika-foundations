(() => {
  const DEMO_WHATSAPP = '917893148389';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Mobile navigation
  const menuButton = $('.menu-btn');
  const nav = $('.nav');
  menuButton?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  $$('.nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  // Dynamic year
  $('#year').textContent = new Date().getFullYear();

  // Property category filtering
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(item => item.classList.toggle('active', item === button));
    const type = button.dataset.filter;
    $$('.property-card').forEach(card => {
      card.classList.toggle('hidden', type !== 'all' && card.dataset.type !== type);
    });
  }));

  // Property detail modal
  const propertyInfo = {
    plot: {label:'OPEN PLOTS', title:'Make space for your plans.', description:'Explore open-plot opportunities in the Parnika Foundations project area. Ask the team for the current layout, plot dimensions, road details, approvals, pricing and availability.'},
    duplex: {label:'DUPLEX HOMES', title:'More room to grow together.', description:'Discover multi-level home possibilities. Contact the team for available configurations, floor plans, built-up area, specifications, pricing and current status.'},
    simplex: {label:'SIMPLEX HOMES', title:'All you need. On one level.', description:'Explore single-level home possibilities. Ask the team for floor plans, plot and built-up areas, specifications, pricing and current availability.'}
  };
  const modal = $('#property-modal');
  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  $$('.details-btn').forEach(button => button.addEventListener('click', () => {
    const item = propertyInfo[button.dataset.id];
    $('#modal-label').textContent = item.label;
    $('#modal-title').textContent = item.title;
    $('#modal-description').textContent = item.description;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('.modal-close').focus();
  }));
  $$('[data-close]').forEach(button => button.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
  $('#modal-enquire').addEventListener('click', closeModal);

  // WhatsApp enquiry handoff. Visitor reviews and sends the message in WhatsApp.
  $('#enquiry-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const digits = String(data.get('phone') || '').replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) {
      $('#form-status').textContent = 'Please enter a valid mobile number.';
      return;
    }
    const message = [
      'Hello Parnika Foundations, I would like to know more about your properties.',
      '',
      'Name: ' + data.get('name'),
      'Mobile: ' + data.get('phone'),
      'Interested in: ' + data.get('interest'),
      'Message: ' + (data.get('message') || 'Not provided'),
      '',
      'This enquiry came through the Parnika Foundations website demo.'
    ].join('\n');
    $('#form-status').textContent = 'Opening WhatsApp. Please review your enquiry and press Send.';
    const url = 'https://wa.me/' + DEMO_WHATSAPP + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();