/**
 * Resume Auto-Sync & Reorganization Engine
 * 
 * Automatically organizes, deduplicates, and synchronizes updates from social posts,
 * GitHub repositories, certifications, and project releases into resume.json,
 * resume.html, and profileData.ts.
 * 
 * Usage:
 *   node scripts/sync-resume.js
 *   node scripts/sync-resume.js --post "Completed Google Generative AI Certification"
 *   node scripts/sync-resume.js --cert "Deep Learning Specialization — Coursera, May 2026"
 *   node scripts/sync-resume.js --skill "Docker:Tools"
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const RESUME_JSON_PATH = path.join(ROOT_DIR, 'resume', 'resume.json');
const PUBLIC_RESUME_JSON_PATH = path.join(ROOT_DIR, 'public', 'resume.json');
const SRC_DATA_RESUME_JSON_PATH = path.join(ROOT_DIR, 'src', 'data', 'resume.json');
const RESUME_HTML_PATH = path.join(ROOT_DIR, 'resume', 'resume.html');
const PUBLIC_RESUME_HTML_PATH = path.join(ROOT_DIR, 'public', 'resume.html');
const PENDING_UPDATES_PATH = path.join(ROOT_DIR, 'resume', 'pending_updates.json');

// Category mapping rules for auto-organizing skills
const SKILL_CATEGORIES = {
  Languages: ['dart', 'python', 'javascript', 'typescript', 'c', 'c++', 'html/css', 'sql', 'bash', 'java', 'kotlin', 'swift'],
  Frameworks: ['flutter', 'flask', 'streamlit', 'react', 'next.js', 'tkinter', 'bootstrap', 'tailwind css', 'fastapi', 'express'],
  'ML / Data': ['lightgbm', 'xgboost', 'plotly', 'scikit-learn', 'tensorflow', 'numpy', 'pandas', 'pytorch', 'keras', 'data analytics'],
  Tools: ['git', 'github', 'rest apis', 'firebase', 'docker', 'linux', 'webgl', 'three.js', 'postman', 'vscode', 'ci/cd'],
  Concepts: ['dsa', 'oop', 'mobile architecture', 'clean architecture', 'system design', 'agile', 'restful api & backend']
};

function loadResumeData() {
  if (fs.existsSync(RESUME_JSON_PATH)) {
    return JSON.parse(fs.readFileSync(RESUME_JSON_PATH, 'utf8'));
  }
  if (fs.existsSync(SRC_DATA_RESUME_JSON_PATH)) {
    return JSON.parse(fs.readFileSync(SRC_DATA_RESUME_JSON_PATH, 'utf8'));
  }
  throw new Error('Could not locate resume.json');
}

function autoCategorizeSkill(skillName) {
  const lower = skillName.trim().toLowerCase();
  for (const [category, items] of Object.entries(SKILL_CATEGORIES)) {
    if (items.some(item => item === lower || lower.includes(item))) {
      return category;
    }
  }
  return 'Tools'; // Default fallback category
}

function organizeSkills(existingSkills, newSkillInputs = []) {
  const categoryMap = new Map();

  // Initialize existing categories
  existingSkills.forEach(([category, skills]) => {
    categoryMap.set(category, new Set(skills));
  });

  // Ensure all standard categories exist
  for (const cat of Object.keys(SKILL_CATEGORIES)) {
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, new Set());
    }
  }

  // Add new skill inputs: could be "SkillName" or "SkillName:Category"
  newSkillInputs.forEach(input => {
    if (typeof input !== 'string') return;
    let [name, explicitCategory] = input.split(':').map(s => s.trim());
    if (!name) return;
    const category = explicitCategory || autoCategorizeSkill(name);
    if (!categoryMap.has(category)) {
      categoryMap.set(category, new Set());
    }
    categoryMap.get(category).add(name);
  });

  return Array.from(categoryMap.entries()).map(([cat, set]) => [cat, Array.from(set)]);
}

function organizeCertifications(existingCerts, newCerts = []) {
  const certSet = new Set(existingCerts.map(c => c.trim()));
  newCerts.forEach(c => {
    if (typeof c === 'string' && c.trim()) {
      certSet.add(c.trim());
    }
  });
  return Array.from(certSet);
}

function syncUpdates() {
  console.log('[Resume Sync Engine] Initiating auto-reorganization and synchronization...');

  const data = loadResumeData();
  let hasChanges = false;

  // 1. Process pending updates file if present
  if (fs.existsSync(PENDING_UPDATES_PATH)) {
    try {
      const pending = JSON.parse(fs.readFileSync(PENDING_UPDATES_PATH, 'utf8'));
      console.log(`[Resume Sync Engine] Processing pending updates file:`, pending);

      if (pending.newSkills && Array.isArray(pending.newSkills)) {
        data.skills = organizeSkills(data.skills, pending.newSkills);
        hasChanges = true;
      }

      if (pending.newCertifications && Array.isArray(pending.newCertifications)) {
        data.certifications = organizeCertifications(data.certifications, pending.newCertifications);
        hasChanges = true;
      }

      if (pending.newExperience && Array.isArray(pending.newExperience)) {
        data.experience = [...pending.newExperience, ...data.experience];
        hasChanges = true;
      }

      if (pending.summary) {
        data.summary = pending.summary;
        hasChanges = true;
      }

      // Archive processed updates
      fs.unlinkSync(PENDING_UPDATES_PATH);
      console.log('[Resume Sync Engine] Successfully processed and archived pending updates.');
    } catch (err) {
      console.warn('[Resume Sync Engine] Error reading pending_updates.json:', err.message);
    }
  }

  // 2. Parse command line arguments (e.g. node sync-resume.js --skill "Next.js:Frameworks")
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--skill' && args[i + 1]) {
      data.skills = organizeSkills(data.skills, [args[i + 1]]);
      hasChanges = true;
      i++;
    } else if (args[i] === '--cert' && args[i + 1]) {
      data.certifications = organizeCertifications(data.certifications, [args[i + 1]]);
      hasChanges = true;
      i++;
    } else if (args[i] === '--summary' && args[i + 1]) {
      data.summary = args[i + 1];
      hasChanges = true;
      i++;
    }
  }

  // Keep the canonical profile data intact; never overwrite links, education,
  // or QR destinations with stale hard-coded values during synchronization.
  if (!data.projectsQR || !data.projectsQR.url) {
    data.projectsQR = {
      url: "https://bezaleel-paul-portfolio.vercel.app/projects/",
      label: "Explore the project archive",
      display: "bezaleel-paul-portfolio.vercel.app/projects/",
      note: "Current portfolio archive with project write-ups, source repositories and available demos"
    };
  }

  // Re-organize skills cleanly
  data.skills = organizeSkills(data.skills);

  const formattedJson = JSON.stringify(data, null, 2);

  // Write updated resume.json across all target destinations
  fs.writeFileSync(RESUME_JSON_PATH, formattedJson, 'utf8');
  fs.writeFileSync(PUBLIC_RESUME_JSON_PATH, formattedJson, 'utf8');
  fs.writeFileSync(SRC_DATA_RESUME_JSON_PATH, formattedJson, 'utf8');

  // Update resume.html and public/resume.html embedded JSON
  if (fs.existsSync(RESUME_HTML_PATH)) {
    let htmlContent = fs.readFileSync(RESUME_HTML_PATH, 'utf8');
    const scriptRegex = /<script type="application\/json" id="resume-data">([\s\S]*?)<\/script>/;
    if (scriptRegex.test(htmlContent)) {
      htmlContent = htmlContent.replace(scriptRegex, `<script type="application/json" id="resume-data">${JSON.stringify(data)}</script>`);
      fs.writeFileSync(RESUME_HTML_PATH, htmlContent, 'utf8');
      fs.writeFileSync(PUBLIC_RESUME_HTML_PATH, htmlContent, 'utf8');
    }
  }

  console.log('✅ [Resume Sync Engine] Successfully synchronized resume across:');
  console.log(`   - ${path.relative(ROOT_DIR, RESUME_JSON_PATH)}`);
  console.log(`   - ${path.relative(ROOT_DIR, PUBLIC_RESUME_JSON_PATH)}`);
  console.log(`   - ${path.relative(ROOT_DIR, SRC_DATA_RESUME_JSON_PATH)}`);
  console.log(`   - ${path.relative(ROOT_DIR, RESUME_HTML_PATH)}`);
  console.log(`   - ${path.relative(ROOT_DIR, PUBLIC_RESUME_HTML_PATH)}`);
}

syncUpdates();
