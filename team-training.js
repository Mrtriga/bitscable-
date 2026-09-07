const ttRoleData = {
  owners: ['Digital Operations', 'Analytics', 'Security', 'AI Opportunities'],
  marketing: ['Content', 'SEO', 'Website Updates', 'Analytics'],
  sales: ['Digital Enquiries', 'Customer Workflows', 'Communication'],
  admins: ['Website Updates', 'Content', 'Basic SEO', 'Troubleshooting']
};

const ttRoleTabs = document.getElementById('ttRoleTabs');
const ttRoleTopics = document.getElementById('ttRoleTopics');

if (ttRoleTabs && ttRoleTopics) {
  ttRoleTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.tt-roles__tab');
    if (!tab) return;

    ttRoleTabs.querySelectorAll('.tt-roles__tab').forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');

    const topics = ttRoleData[tab.dataset.role] || [];
    ttRoleTopics.innerHTML = topics.map(t => `<li>${t}</li>`).join('');
  });
}
const ttFaqList = document.getElementById('ttFaqList');

if (ttFaqList) {
  ttFaqList.addEventListener('click', (e) => {
    const btn = e.target.closest('.service-faq__q');
    if (!btn) return;

    const item = btn.closest('.service-faq__item');
    const wasOpen = item.classList.contains('is-open');

    ttFaqList.querySelectorAll('.service-faq__item').forEach(i => i.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
}