const https = require('https');
const fs = require('fs');
const path = require('path');

function fetch(url, followRedirects = true, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const latency = Date.now() - startTime;

      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (!followRedirects || maxRedirects <= 0) {
          return resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: '',
            latency,
            redirectTo: res.headers.location
          });
        }
        return resolve(fetch(res.headers.location, true, maxRedirects - 1));
      }

      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data,
        latency
      }));
    }).on('error', reject);
  });
}

async function runLiveAudit() {
  console.log('================================================================');
  console.log('🚀 SCOPEGUARD PRODUCTION QA & LIVE VERIFICATION');
  console.log('================================================================\n');

  const liveUrl = 'https://chaudhryshiraz.github.io/scopeguard-business/';
  const productionUrl = 'https://scopeguard.app/';
  const projectRoot = path.resolve(__dirname, '..');
  const localHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const localCss = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');

  console.log('--- HTTP Status & Accessibility Verification ---');

  // Test GitHub Pages deployment
  let githubPass = false;
  try {
    const githubResponse = await fetch(liveUrl);
    const statusPass = githubResponse.statusCode === 200;
    githubPass = statusPass && githubResponse.body.length > 10000;
    console.log(`${statusPass ? '✅' : '❌'} GitHub Pages HTTP Status: ${githubResponse.statusCode} (${githubResponse.latency}ms)`);
    console.log(`${githubResponse.body.length > 10000 ? '✅' : '❌'} Content-Length: ${githubResponse.body.length} bytes`);

    const liveHtml = githubResponse.body;

    // Production URL check
    try {
      const prodResponse = await fetch(productionUrl);
      const prodPass = prodResponse.statusCode === 200;
      console.log(`${prodPass ? '✅' : '❌'} Production URL (scopeguard.app) HTTP Status: ${prodResponse.statusCode} (${prodResponse.latency}ms)`);
    } catch (err) {
      console.log(`❌ Production URL (scopeguard.app) unreachable: ${err.message}`);
    }

    // JSON-LD parsing and FAQ alignment
    console.log('\n--- JSON-LD Schema & FAQ Alignment ---');
    const jsonLdMatch = liveHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    let jsonLdPass = false;
    let faqAlignmentPass = false;

    if (jsonLdMatch) {
      try {
        const jsonLd = JSON.parse(jsonLdMatch[1]);
        jsonLdPass = true;
        console.log('✅ JSON-LD parses successfully');

        // Find FAQPage in @graph
        const faqPage = jsonLd['@graph']?.find(item => item['@type'] === 'FAQPage');
        if (faqPage && faqPage.mainEntity) {
          const jsonFaqs = faqPage.mainEntity;
          console.log(`✅ Found ${jsonFaqs.length} FAQ entries in JSON-LD`);

          // Extract FAQ questions from DOM
          const domFaqQuestions = [...liveHtml.matchAll(/<summary class="faq-question">([\s\S]*?)<\/summary>/g)]
            .map(m => m[1].replace(/<[^>]+>/g, '').trim());

          console.log(`✅ Found ${domFaqQuestions.length} FAQ entries in DOM`);

          // Cross-check alignment
          let mismatchCount = 0;
          jsonFaqs.forEach((faq, i) => {
            const jsonQuestion = faq.name.trim();
            const domQuestion = domFaqQuestions[i];
            if (jsonQuestion !== domQuestion) {
              console.log(`❌ FAQ ${i+1} mismatch: JSON-LD="${jsonQuestion.substring(0, 50)}" vs DOM="${domQuestion?.substring(0, 50) || 'missing'}"`);
              mismatchCount++;
            }
          });

          faqAlignmentPass = mismatchCount === 0 && jsonFaqs.length === domFaqQuestions.length;
          if (faqAlignmentPass) {
            console.log('✅ All JSON-LD FAQ questions align perfectly with DOM');
          }
        } else {
          console.log('❌ No FAQPage entity found in JSON-LD @graph');
        }
      } catch (e) {
        console.log(`❌ JSON-LD parsing failed: ${e.message}`);
      }
    } else {
      console.log('❌ No JSON-LD script found in HTML');
    }

    // Semantic HTML5 landmarks
    console.log('\n--- Semantic HTML5 Landmarks ---');
    const landmarks = [
      { tag: '<nav', name: 'Navigation' },
      { tag: '<header', name: 'Header' },
      { tag: '<main', name: 'Main content' },
      { tag: '<section', name: 'Sections' },
      { tag: '<footer', name: 'Footer' }
    ];

    let landmarksPass = true;
    landmarks.forEach(l => {
      const present = liveHtml.includes(l.tag);
      console.log(`${present ? '✅' : '❌'} ${l.name} (${l.tag})`);
      if (!present) landmarksPass = false;
    });

    // Accessibility hooks
    console.log('\n--- Accessibility Hooks ---');
    const ariaLabelCount = (liveHtml.match(/aria-label="/g) || []).length;
    const labelForCount = (liveHtml.match(/<label[^>]+for="/g) || []).length;
    const altTextCount = (liveHtml.match(/<img[^>]+alt="/g) || []).length;
    const headingHierarchy = ['<h1', '<h2', '<h3', '<h4'].every(h => liveHtml.includes(h));

    console.log(`${ariaLabelCount > 0 ? '✅' : '❌'} ARIA labels: ${ariaLabelCount} found`);
    console.log(`${labelForCount > 0 ? '✅' : '❌'} Form label bindings: ${labelForCount} found`);
    console.log(`${altTextCount > 0 ? '✅' : '❌'} Image alt text: ${altTextCount} found`);
    console.log(`${headingHierarchy ? '✅' : '❌'} Heading hierarchy (h1-h4)`);

    const accessibilityPass = ariaLabelCount > 0 && labelForCount > 0 && headingHierarchy;

    // Required files verification
    console.log('\n--- Required Distribution Files ---');
    const requiredFiles = [
      { name: 'index.html', path: path.join(projectRoot, 'index.html') },
      { name: 'styles.css', path: path.join(projectRoot, 'styles.css') },
      { name: 'app.js', path: path.join(projectRoot, 'app.js') },
      { name: 'robots.txt', path: path.join(projectRoot, 'robots.txt') },
      { name: 'sitemap.xml', path: path.join(projectRoot, 'sitemap.xml') }
    ];

    let filesPass = true;
    requiredFiles.forEach(f => {
      const exists = fs.existsSync(f.path);
      console.log(`${exists ? '✅' : '❌'} ${f.name}`);
      if (!exists) filesPass = false;
    });

    // Sitemap & Robots validation
    console.log('\n--- Sitemap & Robots Validation ---');
    const robotsTxt = fs.readFileSync(path.join(projectRoot, 'robots.txt'), 'utf8');
    const sitemapXml = fs.readFileSync(path.join(projectRoot, 'sitemap.xml'), 'utf8');

    const robotsSitemapRef = robotsTxt.includes('Sitemap: https://scopeguard.app/sitemap.xml');
    const sitemapValidXml = sitemapXml.includes('<?xml') && sitemapXml.includes('<urlset');
    const sitemapHasUrls = (sitemapXml.match(/<loc>/g) || []).length >= 5;

    console.log(`${robotsSitemapRef ? '✅' : '❌'} robots.txt references sitemap.xml`);
    console.log(`${sitemapValidXml ? '✅' : '❌'} sitemap.xml valid XML structure`);
    console.log(`${sitemapHasUrls ? '✅' : '❌'} sitemap.xml contains ${(sitemapXml.match(/<loc>/g) || []).length} URLs`);

    const seoPass = robotsSitemapRef && sitemapValidXml && sitemapHasUrls;

    // Print CSS validation
    console.log('\n--- Print CSS Validation ---');
    const printMediaMatch = localCss.match(/@media print\s*\{([\s\S]*?)\n\}/);
    let printCssPass = false;

    if (printMediaMatch) {
      const printBlock = printMediaMatch[1];
      const hidesNavbar = printBlock.includes('.navbar') && printBlock.includes('display: none');
      const hidesHero = printBlock.includes('.hero-section') && printBlock.includes('display: none');
      const hidesFooter = printBlock.includes('.footer') && printBlock.includes('display: none');
      const showsDocument = printBlock.includes('.document-sheet');

      printCssPass = hidesNavbar && hidesHero && hidesFooter && showsDocument;

      console.log(`${hidesNavbar ? '✅' : '❌'} Print CSS hides .navbar`);
      console.log(`${hidesHero ? '✅' : '❌'} Print CSS hides .hero-section`);
      console.log(`${hidesFooter ? '✅' : '❌'} Print CSS hides .footer`);
      console.log(`${showsDocument ? '✅' : '❌'} Print CSS styles .document-sheet`);
    } else {
      console.log('❌ No @media print block found in styles.css');
    }

    // DOM integrity checks
    console.log('\n--- DOM Integrity ---');
    const localIdMatches = [...localHtml.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
    const uniqueLocalIds = [...new Set(localIdMatches)];
    const missingFromLive = uniqueLocalIds.filter(id => !liveHtml.includes(`id="${id}"`));

    const domIntegrityPass = missingFromLive.length === 0;
    console.log(`${domIntegrityPass ? '✅' : '❌'} DOM ID integrity: ${uniqueLocalIds.length} local IDs, ${missingFromLive.length} missing from live`);

    if (missingFromLive.length > 0 && missingFromLive.length <= 5) {
      console.log('   Missing IDs:', missingFromLive.join(', '));
    }

    const modules = [
      { name: 'Loss Calculator View', id: 'calc-view' },
      { name: 'Change Order Builder View', id: 'co-view' },
      { name: 'Risk Diagnostic Quiz View', id: 'quiz-view' },
      { name: 'Scripts View', id: 'scripts-view' },
      { name: 'Toolkit View', id: 'affiliate-view' }
    ];

    console.log('\n--- Core Modules ---');
    let allModulesOk = true;
    modules.forEach(m => {
      const present = liveHtml.includes(`id="${m.id}"`);
      console.log(`${present ? '✅' : '❌'} ${m.name}`);
      if (!present) allModulesOk = false;
    });

    const cssPass = liveHtml.includes('href="styles.css"');
    const jsPass = liveHtml.includes('src="app.js"');
    console.log(`${cssPass ? '✅' : '❌'} styles.css linked`);
    console.log(`${jsPass ? '✅' : '❌'} app.js linked`);

    // Final verdict
    console.log('\n' + '='.repeat(80));
    const allPass = githubPass && jsonLdPass && faqAlignmentPass && landmarksPass &&
                     accessibilityPass && filesPass && seoPass && printCssPass &&
                     domIntegrityPass && allModulesOk && cssPass && jsPass;

    if (allPass) {
      console.log('🎉 VERDICT: ALL CHECKS PASSED - ScopeGuard is fully operational');
    } else {
      console.log('⚠️  VERDICT: ISSUES DETECTED - See failures above');
    }
    console.log('='.repeat(80));

  } catch (err) {
    console.error('❌ Fatal error during verification:', err.message);
    process.exit(1);
  }
}

runLiveAudit().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
