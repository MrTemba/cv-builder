document.addEventListener('DOMContentLoaded', () => {
  // helpers
  const $ = id => document.getElementById(id);
  const escapeHtml = str => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  const trim = v => (v || '').toString().trim();

  // elements
  const themeSelector = $('themeSelector');
  const profilePic = $('profilePic');
  const profilePreview = $('profilePreview');
  const addExperienceBtn = $('addExperienceBtn');
  const experienceContainer = $('experienceContainer');
  const addEducationBtn = $('addEducationBtn');
  const educationContainer = $('educationContainer');
  const addReferenceBtn = $('addReferenceBtn');
  const referenceContainer = $('referenceContainer');
  const addLanguageBtn = $('addLanguageBtn');
  const languageContainer = $('languageContainer');
  const generateBtn = $('generateBtn');
  const downloadBtn = $('downloadBtn');
  const applyBtn = $('applyBtn');
  const cvPreview = $('cvPreview');
  const forenamesEl = $('forenames');
  const middleEl = $('middleName');
  const surnameEl = $('surname');

  // safety: bail if minimal DOM missing
  if (!generateBtn || !cvPreview) {
    console.warn('Essential elements missing — script aborted.');
    return;
  }

  // initial state
  let expCount = 0;
  let eduCount = 0;
  let refCount = 0;
  let langCount = 0;
  if (profilePreview) profilePreview.style.display = profilePreview.src ? 'block' : 'none';
  if (downloadBtn) downloadBtn.disabled = true; // require preview first

  // Theme switching
  if (themeSelector) {
    themeSelector.addEventListener('change', e => {
      const v = e.target.value;
      document.body.classList.remove('modern','elegant','minimal','dark');
      if (['modern','elegant','minimal','dark'].includes(v)) document.body.classList.add(v);
    });
  }

  // Profile picture preview (shows/hides image element)
  if (profilePic && profilePreview) {
    profilePic.addEventListener('change', function () {
      const file = this.files && this.files[0];
      if (!file) {
        profilePreview.src = '';
        profilePreview.style.display = 'none';
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        profilePreview.src = e.target.result;
        profilePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  }

  // Add experience block
  if (addExperienceBtn && experienceContainer) {
    addExperienceBtn.addEventListener('click', () => {
      expCount++;
      const div = document.createElement('div');
      div.className = 'exp-block';
      div.innerHTML = `
        <h4>Work Experience ${expCount}</h4>
        <label>Job Title</label>
        <input type="text" id="jobTitle${expCount}">
        <label>Company</label>
        <input type="text" id="company${expCount}">
        <label>Location</label>
        <input type="text" id="location${expCount}">
        <label>Start Date</label>
        <input type="date" id="expStart${expCount}">
        <label>End Date</label>
        <input type="date" id="expEnd${expCount}">
        <label>Responsibilities</label>
        <textarea id="responsibilities${expCount}" placeholder="Managed client accounts, prepared financial reports, and improved workflow efficiency"></textarea>
        <button type="button" class="remove-btn">Remove</button>
        <hr>
      `;
      experienceContainer.appendChild(div);
      div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
    });
  }

  // Add education block
  if (addEducationBtn && educationContainer) {
    addEducationBtn.addEventListener('click', () => {
      eduCount++;
      const div = document.createElement('div');
      div.className = 'edu-block';
      div.innerHTML = `
        <h4>Higher Education ${eduCount}</h4>
        <label>Institution</label><input type="text" id="institution${eduCount}">
        <label>Degree</label><input type="text" id="degree${eduCount}">
        <label>Field</label><input type="text" id="field${eduCount}">
        <label>Year Start</label><input type="date" id="yearStart${eduCount}">
        <label>Year End</label><input type="date" id="yearEnd${eduCount}">
        <button type="button" class="remove-btn">Remove</button>
        <hr>
      `;
      educationContainer.appendChild(div);
      div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
    });
  }

  // Add reference block
  if (addReferenceBtn && referenceContainer) {
    addReferenceBtn.addEventListener('click', () => {
      refCount++;
      const div = document.createElement('div');
      div.className = 'ref-block';
      div.innerHTML = `
        <h4>Reference ${refCount}</h4>
        <label>Name</label><input type="text" id="refName${refCount}">
        <label>Company</label><input type="text" id="refCompany${refCount}">
        <label>Position</label><input type="text" id="refPosition${refCount}">
        <label>Phone</label><input type="text" id="refPhone${refCount}">
        <label>Email</label><input type="text" id="refEmail${refCount}">
        <button type="button" class="remove-btn">Remove</button>
        <hr>
      `;
      referenceContainer.appendChild(div);
      div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
    });
  }

  // Add language block
  if (addLanguageBtn && languageContainer) {
    addLanguageBtn.addEventListener('click', () => {
      langCount++;
      const div = document.createElement('div');
      div.className = 'lang-block';
      div.innerHTML = `
        <label>Language</label><input type="text" id="langName${langCount}">
        <label>Fluency</label>
        <select id="langLevel${langCount}">
          <option value="Fluent">Fluent</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Basic">Basic</option>
        </select>
        <button type="button" class="remove-btn">Remove</button>
        <hr>
      `;
      languageContainer.appendChild(div);
      div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
    });
  }

  // Build preview HTML safely
  function buildPreviewHtml() {
    const forenames = escapeHtml(trim(forenamesEl?.value));
    const middle = escapeHtml(trim(middleEl?.value));
    const surname = escapeHtml(trim(surnameEl?.value));
    const imgSrc = profilePreview?.src || '';
    const dob = escapeHtml(trim($('dob')?.value));
    const phone = escapeHtml(trim($('phone')?.value));
    const email = escapeHtml(trim($('email')?.value));
    const address = escapeHtml(trim($('address')?.value));
    const summary = escapeHtml(trim($('summary')?.value));
    const skillsRaw = escapeHtml(trim($('skills')?.value));
    const skillsArr = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
    const hobbiesRaw = escapeHtml(trim($('hobbies')?.value));
    const hobbiesArr = hobbiesRaw ? hobbiesRaw.split(',').map(h => h.trim()).filter(Boolean) : [];

    const contactInfo = `
      <div class="contact-info">
        ${dob ? `<p><span class="cv-icon">&#x1F4C5;</span> ${dob}</p>` : ''}
        ${address ? `<p><span class="cv-icon">&#x1F4CD;</span> ${address}</p>` : ''}
        ${phone ? `<p><span class="cv-icon">&#x260E;</span> ${phone}</p>` : ''}
        ${email ? `<p><span class="cv-icon">&#x2709;</span> ${email}</p>` : ''}
      </div>
    `;

    const summaryBlock = summary ? `<div class="cv-summary"><h4>Profile</h4><p>${summary}</p></div>` : '';

    const skillsBlock = skillsArr.length
      ? `<div class="cv-skills"><h4>Skills</h4><ul>${skillsArr.map(skill => `<li>${skill}</li>`).join('')}</ul></div>`
      : '';

    const hobbiesBlock = hobbiesArr.length
      ? `<div class="cv-hobbies"><h4>Hobbies</h4><ul>${hobbiesArr.map(hobby => `<li>${hobby}</li>`).join('')}</ul></div>`
      : '';

    // Experiences
    const expBlocks = experienceContainer ? experienceContainer.querySelectorAll('.exp-block') : [];
    let expHTML = '';
    expBlocks.forEach((block, idx) => {
      const i = idx + 1;
      const jobTitle = escapeHtml(trim(block.querySelector(`#jobTitle${i}`)?.value || ''));
      const company = escapeHtml(trim(block.querySelector(`#company${i}`)?.value || ''));
      const location = escapeHtml(trim(block.querySelector(`#location${i}`)?.value || ''));
      const start = escapeHtml(trim(block.querySelector(`#expStart${i}`)?.value || ''));
      const end = escapeHtml(trim(block.querySelector(`#expEnd${i}`)?.value || ''));
      const resp = escapeHtml(trim(block.querySelector(`#responsibilities${i}`)?.value || ''));
      if (jobTitle || company || resp) {
        expHTML += `
          <div class="cv-card">
            <div class="cv-card-title">
              <strong>${jobTitle || 'Job Title'}</strong>${company ? ' at ' + company : ''} ${location ? `(${location})` : ''}
            </div>
            <div class="cv-card-meta">${start || ''}${start && end ? ' - ' : ''}${end || ''}</div>
            <div class="cv-resp">${resp || ''}</div>
          </div>
        `;
      }
    });

    // Education
    const eduBlocks = educationContainer ? educationContainer.querySelectorAll('.edu-block') : [];
    let eduHTML = '';
    eduBlocks.forEach((block, idx) => {
      const i = idx + 1;
      const institution = escapeHtml(trim(block.querySelector(`#institution${i}`)?.value || ''));
      const degree = escapeHtml(trim(block.querySelector(`#degree${i}`)?.value || ''));
      const field = escapeHtml(trim(block.querySelector(`#field${i}`)?.value || ''));
      const yearStart = escapeHtml(trim(block.querySelector(`#yearStart${i}`)?.value || ''));
      const yearEnd = escapeHtml(trim(block.querySelector(`#yearEnd${i}`)?.value || ''));
      if (institution || degree) {
        eduHTML += `
          <div class="cv-card">
            <div class="cv-card-title">
              <strong>${degree || 'Qualification'}</strong> ${field ? 'in ' + field : ''}
            </div>
            <div class="cv-card-meta">${institution}${(yearStart||yearEnd) ? ` (${yearStart || ''} - ${yearEnd || ''})` : ''}</div>
          </div>
        `;
      }
    });

    // References
    const refBlocks = referenceContainer ? referenceContainer.querySelectorAll('.ref-block') : [];
    let referencesBlock = '';
    if (refBlocks.length) {
      referencesBlock = `<h4 class="cv-heading">References</h4>`;
      refBlocks.forEach((block, idx) => {
        const i = idx + 1;
        const name = escapeHtml(trim(block.querySelector(`#refName${i}`)?.value || ''));
        const company = escapeHtml(trim(block.querySelector(`#refCompany${i}`)?.value || ''));
        const position = escapeHtml(trim(block.querySelector(`#refPosition${i}`)?.value || ''));
        const phone = escapeHtml(trim(block.querySelector(`#refPhone${i}`)?.value || ''));
        const email = escapeHtml(trim(block.querySelector(`#refEmail${i}`)?.value || ''));
        if (name) {
          referencesBlock += `
            <div class="cv-card">
              <div class="cv-card-title"><strong>${name}</strong> ${position ? `(${position})` : ''}</div>
              <div class="cv-card-meta">${company}</div>
              <div class="cv-card-meta">${phone ? `Phone: ${phone}` : ''} ${email ? `Email: ${email}` : ''}</div>
            </div>
          `;
        }
      });
    }

    // Languages
    const langBlocks = languageContainer ? languageContainer.querySelectorAll('.lang-block') : [];
    let languagesBlock = '';
    if (langBlocks.length) {
      languagesBlock = `<div class="cv-skills"><h4>Languages</h4><ul>`;
      langBlocks.forEach((block, idx) => {
        const i = idx + 1;
        const name = escapeHtml(trim(block.querySelector(`#langName${i}`)?.value || ''));
        const level = escapeHtml(trim(block.querySelector(`#langLevel${i}`)?.value || ''));
        if (name) {
          languagesBlock += `<li>${name} (${level})</li>`;
        }
      });
      languagesBlock += `</ul></div>`;
    }

    const leftPic = imgSrc ? `<img src="${imgSrc}" class="cv-pic">` : '';
    const nameLine = `<h3 class="cv-name">${forenames} ${middle} ${surname}</h3>`;

    return `
      <div class="cv-preview-bg">
        <div class="cv-preview-main">
          ${leftPic}
          ${nameLine}
          ${contactInfo}
          ${summaryBlock}
          ${skillsBlock}
          ${hobbiesBlock}
          ${languagesBlock}
          <h4 class="cv-heading">Work Experience</h4>
          ${expHTML || '<p class="cv-empty">No work experience added.</p>'}
          <h4 class="cv-heading">Higher Education</h4>
          ${eduHTML || '<p class="cv-empty">No higher education added.</p>'}
          ${referencesBlock}
        </div>
      </div>
    `;
  }

  // --- Auto-preview as you type ---
  const autoPreviewFields = [
    'forenames', 'middleName', 'surname', 'dob', 'phone', 'email', 'address', 'summary', 'skills', 'hobbies'
  ];
  autoPreviewFields.forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', () => {
      cvPreview.innerHTML = buildPreviewHtml();
      if (downloadBtn) downloadBtn.disabled = false;
    });
  });

  // Also update preview when adding/removing experience/education
  experienceContainer.addEventListener('input', () => {
    cvPreview.innerHTML = buildPreviewHtml();
    if (downloadBtn) downloadBtn.disabled = false;
  });
  educationContainer.addEventListener('input', () => {
    cvPreview.innerHTML = buildPreviewHtml();
    if (downloadBtn) downloadBtn.disabled = false;
  });
  referenceContainer.addEventListener('input', () => {
    cvPreview.innerHTML = buildPreviewHtml();
    if (downloadBtn) downloadBtn.disabled = false;
  });
  languageContainer.addEventListener('input', () => {
    cvPreview.innerHTML = buildPreviewHtml();
    if (downloadBtn) downloadBtn.disabled = false;
  });

  // Preview (generate) button still works
  generateBtn.addEventListener('click', () => {
    cvPreview.innerHTML = buildPreviewHtml();
    if (downloadBtn) downloadBtn.disabled = false;
    cvPreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Download PDF
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      try {
        if (!cvPreview.innerHTML.trim()) {
          alert('Please generate your CV preview first!');
          return;
        }
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Preparing...';

        const canvas = await html2canvas(cvPreview, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        doc.save('CV.pdf');
      } catch (err) {
        console.error('PDF export failed:', err);
        alert('PDF export failed — check console for details.');
      } finally {
        if (downloadBtn) {
          downloadBtn.disabled = false;
          downloadBtn.textContent = 'Download PDF';
        }
      }
    });
  }

  // Apply online
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      window.open('https://mail.google.com/mail/?view=cm&fs=1&to=t3cgardens@gmail.com&su=Job%20Application', '_blank');
    });
  }
});
