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
        <h4>Education/Training ${eduCount}</h4>
        <label>Institution</label><input type="text" id="institution${eduCount}">
        <label>Degree/Certificate</label><input type="text" id="degree${eduCount}">
        <label>Field</label><input type="text" id="field${eduCount}">
        <label>Year Start</label><input type="date" id="yearStart${eduCount}">
        <label>Year End</label><input type="date" id="yearEnd${eduCount}">
        <label>Grade/GPA (optional)</label><input type="text" id="gpa${eduCount}">
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
    // Personal details
    const fullName = escapeHtml(trim($('fullName')?.value));
    const gender = escapeHtml(trim($('gender')?.value));
    const maritalStatus = escapeHtml(trim($('maritalStatus')?.value));
    const children = escapeHtml(trim($('children')?.value));
    const nationality = escapeHtml(trim($('nationality')?.value));
    const nrc = escapeHtml(trim($('nrc')?.value));
    const tpin = escapeHtml(trim($('tpin')?.value));
    const napsa = escapeHtml(trim($('napsa')?.value));
    const postalAddress = escapeHtml(trim($('postalAddress')?.value));
    const residentialAddress = escapeHtml(trim($('residentialAddress')?.value));
    const town = escapeHtml(trim($('town')?.value));
    const plotNo = escapeHtml(trim($('plotNo')?.value));
    const phone = escapeHtml(trim($('phone')?.value));
    const altPhone = escapeHtml(trim($('altPhone')?.value));
    const email = escapeHtml(trim($('email')?.value));
    // Employment info
    const position = escapeHtml(trim($('position')?.value));
    const altPosition = escapeHtml(trim($('altPosition')?.value));
    const expectedPay = escapeHtml(trim($('expectedPay')?.value));
    const otherExpectations = escapeHtml(trim($('otherExpectations')?.value));
    const startDate = escapeHtml(trim($('startDate')?.value));
    const reasonLeaving = escapeHtml(trim($('reasonLeaving')?.value));
    const currentOccupation = escapeHtml(trim($('currentOccupation')?.value));
    const driversLicense = escapeHtml(trim($('driversLicense')?.value));
    // Health info
    const health = escapeHtml(trim($('health')?.value));
    const illnesses = escapeHtml(trim($('illnesses')?.value));
    const allergies = escapeHtml(trim($('allergies')?.value));
    const disabilities = escapeHtml(trim($('disabilities')?.value));
    // Certifications
    const certifications = escapeHtml(trim($('certifications')?.value));
    // Additional info
    const achievements = escapeHtml(trim($('achievements')?.value));
    const attributes = escapeHtml(trim($('attributes')?.value));
    const hobbiesRaw = escapeHtml(trim($('hobbies')?.value));
    const hobbiesArr = hobbiesRaw ? hobbiesRaw.split(',').map(h => h.trim()).filter(Boolean) : [];
    // Declaration
    const declarationDate = escapeHtml(trim($('declarationDate')?.value));
    const signature = escapeHtml(trim($('signature')?.value));

    // Profile picture
    const imgSrc = profilePreview?.src || '';
    const leftPic = imgSrc ? `<img src="${imgSrc}" class="cv-pic">` : '';

    // Education blocks
    const eduBlocks = educationContainer ? educationContainer.querySelectorAll('.edu-block') : [];
    let eduHTML = '';
    eduBlocks.forEach((block, idx) => {
      const i = idx + 1;
      const institution = escapeHtml(trim(block.querySelector(`#institution${i}`)?.value || ''));
      const degree = escapeHtml(trim(block.querySelector(`#degree${i}`)?.value || ''));
      const field = escapeHtml(trim(block.querySelector(`#field${i}`)?.value || ''));
      const yearStart = escapeHtml(trim(block.querySelector(`#yearStart${i}`)?.value || ''));
      const yearEnd = escapeHtml(trim(block.querySelector(`#yearEnd${i}`)?.value || ''));
      const gpa = escapeHtml(trim(block.querySelector(`#gpa${i}`)?.value || ''));
      if (institution || degree) {
        eduHTML += `
          <div class="cv-card">
            <div class="cv-card-title">
              <strong>${degree || 'Qualification'}</strong> ${field ? 'in ' + field : ''}
            </div>
            <div class="cv-card-meta">${institution}${(yearStart||yearEnd) ? ` (${yearStart || ''} - ${yearEnd || ''})` : ''}</div>
            ${gpa ? `<div class="cv-card-meta">Grade/GPA: ${gpa}</div>` : ''}
          </div>
        `;
      }
    });

    // Experience blocks
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

    // Hobbies
    let hobbiesBlock = '';
    if (hobbiesArr.length) {
      hobbiesBlock = `<div class="cv-hobbies"><h4>Hobbies & Past Activities</h4><ul>${hobbiesArr.map(hobby => `<li>${hobby}</li>`).join('')}</ul></div>`;
    }

    // Health Info Block
    let healthBlock = `
      <h4 class="cv-heading">Health Information</h4>
      <div class="cv-card">
        <p><strong>State of Health:</strong> ${health}</p>
        ${illnesses ? `<p><strong>Illnesses:</strong> ${illnesses}</p>` : ''}
        ${allergies ? `<p><strong>Allergies:</strong> ${allergies}</p>` : ''}
        ${disabilities ? `<p><strong>Disabilities:</strong> ${disabilities}</p>` : ''}
      </div>
    `;

    // Profile summary (now from attributes field)
    let profileSummary = '';
    if (attributes) {
      profileSummary = `<div class="cv-summary"><h4>Profile</h4><p>${attributes}</p></div>`;
    }

    // Achievements block
    let achievementsBlock = '';
    if (achievements) {
      achievementsBlock = `<div class="cv-card"><p><strong>Special Achievements:</strong> ${achievements}</p></div>`;
    }

    // Build two-column preview HTML (balanced)
    return `
      <div class="cv-preview-bg">
        <div class="cv-grid">
          <div class="cv-left">
            ${leftPic}
            <h3 class="cv-name">${fullName}</h3>
            <div class="contact-info">
              <p><strong>Gender:</strong> ${gender}</p>
              <p><strong>Marital Status:</strong> ${maritalStatus}</p>
              <p><strong>No. of Children:</strong> ${children}</p>
              <p><strong>Nationality:</strong> ${nationality}</p>
              <p><strong>NRC #:</strong> ${nrc}</p>
              <p><strong>TPIN:</strong> ${tpin}</p>
              <p><strong>NAPSA SSN:</strong> ${napsa}</p>
              <p><strong>Postal Address:</strong> ${postalAddress}</p>
              ${residentialAddress ? `<p><strong>Residential Address:</strong> ${residentialAddress}</p>` : ''}
              <p><strong>Town:</strong> ${town}</p>
              <p><strong>Plot No:</strong> ${plotNo}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              ${altPhone ? `<p><strong>Alternate Phone:</strong> ${altPhone}</p>` : ''}
              <p><strong>Email:</strong> ${email}</p>
            </div>
            ${healthBlock}
            ${profileSummary}
            ${achievementsBlock}
            ${hobbiesBlock}
            ${languagesBlock}
          </div>
          <div class="cv-right">
            <h4 class="cv-heading">Employment Information</h4>
            <div class="cv-card">
              <p><strong>Position Applied For:</strong> ${position}</p>
              ${altPosition ? `<p><strong>Alternate Position:</strong> ${altPosition}</p>` : ''}
              <p><strong>Expected Minimum Gross Pay:</strong> ${expectedPay}</p>
              ${otherExpectations ? `<p><strong>Other Expectations:</strong> ${otherExpectations}</p>` : ''}
              <p><strong>Ready to Start Date:</strong> ${startDate}</p>
              ${reasonLeaving ? `<p><strong>Reason for Leaving Last Employment:</strong> ${reasonLeaving}</p>` : ''}
              ${currentOccupation ? `<p><strong>Current Occupation:</strong> ${currentOccupation}</p>` : ''}
              <p><strong>Valid Driver’s License:</strong> ${driversLicense}</p>
            </div>
            <h4 class="cv-heading">Education & Training</h4>
            ${eduHTML || '<p class="cv-empty">No education/training added.</p>'}
            <h4 class="cv-heading">Certifications & Learning</h4>
            ${certifications ? `<div class="cv-card"><p>${certifications}</p></div>` : ''}
            <h4 class="cv-heading">Work Experience</h4>
            ${expHTML || '<p class="cv-empty">No work experience added.</p>'}
            ${referencesBlock}
            <h4 class="cv-heading">Declaration</h4>
            <div class="cv-card">
              <p>I certify that the information provided is true and correct to the best of my knowledge.</p>
              <p><strong>Date:</strong> ${declarationDate}</p>
              <p><strong>Signature:</strong> ${signature}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Auto-preview as you type ---
  [
    'fullName', 'gender', 'maritalStatus', 'children', 'nationality', 'nrc', 'tpin', 'napsa',
    'postalAddress', 'residentialAddress', 'town', 'plotNo', 'phone', 'altPhone', 'email',
    'position', 'altPosition', 'expectedPay', 'otherExpectations', 'startDate', 'reasonLeaving',
    'currentOccupation', 'driversLicense', 'health', 'illnesses', 'allergies', 'disabilities',
    'certifications', 'achievements', 'attributes', 'hobbies', 'declarationDate', 'signature'
  ].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', () => {
      cvPreview.innerHTML = buildPreviewHtml();
      if (downloadBtn) downloadBtn.disabled = false;
    });
  });

  // Also update preview when adding/removing experience/education/reference/language
  [experienceContainer, educationContainer, referenceContainer, languageContainer].forEach(container => {
    if (container) {
      container.addEventListener('input', () => {
        cvPreview.innerHTML = buildPreviewHtml();
        if (downloadBtn) downloadBtn.disabled = false;
      });
    }
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
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let position = margin;
        let remainingHeight = imgHeight;
        let imgY = 0;

        // If image fits on one page
        if (imgHeight <= pageHeight - margin * 2) {
          doc.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        } else {
          // Multi-page logic
          let pageCount = Math.ceil(imgHeight / (pageHeight - margin * 2));
          for (let i = 0; i < pageCount; i++) {
            let sourceY = (canvas.height / imgHeight) * (i * (pageHeight - margin * 2));
            let sourceHeight = (canvas.height / imgHeight) * Math.min(pageHeight - margin * 2, remainingHeight);

            // Create a temp canvas for each page
            let pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = sourceHeight;
            let ctx = pageCanvas.getContext('2d');
            ctx.drawImage(
              canvas,
              0, sourceY, canvas.width, sourceHeight,
              0, 0, canvas.width, sourceHeight
            );
            let pageImgData = pageCanvas.toDataURL('image/png');
            doc.addImage(pageImgData, 'PNG', margin, margin, imgWidth, (sourceHeight * imgWidth) / canvas.width);
            if (i < pageCount - 1) doc.addPage();
            remainingHeight -= (pageHeight - margin * 2);
          }
        }
        doc.save('Employment-Form.pdf');
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
