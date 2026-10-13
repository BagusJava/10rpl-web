/**
 * ==========================================================================
 * Cyberlink Systems Microsite — Interactive JavaScript
 * Modular, Accessible, and Clean Vanilla ES6+
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectFilters();
  initLivePing();
  initNewsletter();
  initModals();
  initTelemetryCounters();
  initCodeInspector();
});

/**
 * 1. Filter Projects by Category (All, AI, Backend, Cloud)
 */
function initProjectFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Toggle active styling
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter') || 'all';

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 2. Real-time Edge Ping Simulator
 * Simulates realistic edge network ping (11ms - 17ms)
 */
function initLivePing() {
  const pingValueElem = document.getElementById('pingValue');
  if (!pingValueElem) return;

  function updatePing() {
    const latencies = [11, 12, 13, 14, 15, 16];
    const jitter = latencies[Math.floor(Math.random() * latencies.length)];
    pingValueElem.textContent = `${jitter}ms`;
  }

  setInterval(updatePing, 3500);
}

/**
 * 3. Newsletter Subscription Form Handler
 */
function initNewsletter() {
  const form = document.getElementById('dispatchForm');
  const emailInput = document.getElementById('dispatchEmail');
  const feedback = document.getElementById('dispatchFeedback');
  const submitBtn = document.getElementById('dispatchSubmitBtn');

  if (!form || !emailInput || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email || !email.includes('@') || !email.includes('.')) {
      feedback.textContent = '✖ Please enter a valid engineering email address.';
      feedback.className = 'dispatch-feedback error';
      return;
    }

    // Submit loading state
    submitBtn.textContent = 'Encrypting...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = 'Subscribed ✓';
      feedback.textContent = `✔ Key generated for ${email}. Weekly Kernel Dispatch will deliver to your inbox.`;
      feedback.className = 'dispatch-feedback success';
      emailInput.value = '';
      
      setTimeout(() => {
        submitBtn.textContent = 'Subscribe';
        submitBtn.disabled = false;
      }, 4000);
    }, 800);
  });
}

/**
 * 4. Modal System (General Popups, Project Details, Whitepaper, Mentorship)
 */
function initModals() {
  // Generic modal close triggers
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  // Close modal when clicking on overlay background
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // ESC key to close open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });

  // Connect Button
  const connectBtn = document.getElementById('connectBtn');
  const connectModal = document.getElementById('connectModal');
  if (connectBtn && connectModal) {
    connectBtn.addEventListener('click', () => {
      connectModal.classList.add('active');
    });
  }

  // Copy Email helper inside Connect modal
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('aris@cyberlink.tech');
      copyEmailBtn.textContent = 'Copied to Clipboard! ✓';
      setTimeout(() => {
        copyEmailBtn.textContent = 'Copy Email Address';
      }, 2500);
    });
  }

  // Project action buttons with dynamic modal viewer
  const projectActionBtns = document.querySelectorAll('.card-action-btn');
  const projectModal = document.getElementById('projectModal');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalBody = document.getElementById('projectModalBody');

  const projectDetailsMap = {
    'aethercore': {
      title: 'AetherCore AI Inference Engine',
      content: `
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <p><strong>AetherCore</strong> is an ultra-low latency tensor dispatch engine compiled to WebAssembly and native Rust binaries.</p>
          <div style="background:#04060c;border:1px solid rgba(0,245,255,0.2);padding:1rem;border-radius:8px;font-family:var(--font-mono);font-size:0.75rem;">
            <div style="color:var(--cyan-primary);margin-bottom:0.5rem;">// Live Microbenchmark (Client-Side Wasm Execution)</div>
            <div>[SIMD-128] FP16 Matrix Multiplication: <span style="color:#34d399;">0.84ms / batch</span></div>
            <div>[Zero-Copy] Memory Buffer Sharding: <span style="color:#34d399;">14.2 GB/s throughput</span></div>
            <div>[Target Arch] x86_64, aarch64, wasm32-unknown-unknown</div>
          </div>
          <p style="font-size:0.8rem;color:var(--text-muted);">
            Engineered for high-frequency distributed nodes where sub-millisecond tensor handoffs are mission critical.
          </p>
          <button id="runWasmSimBtn" style="padding:0.6rem 1rem;background:var(--cyan-primary);color:#060911;font-weight:700;border:none;border-radius:6px;cursor:pointer;">
            Run 100k Tensor Ops Test
          </button>
          <div id="wasmBenchmarkResult" style="font-family:var(--font-mono);font-size:0.75rem;color:#34d399;"></div>
        </div>
      `
    },
    'neuromesh': {
      title: 'NeuroMesh Distributed Weights',
      content: `
        <div style="display:flex;flex-direction:column;gap:0.8rem;">
          <p>Decentralized tensor sharding and peer-to-peer parameter synchronization with sub-5ms ring gradients.</p>
          <ul style="padding-left:1.2rem;font-size:0.82rem;color:var(--text-muted);display:flex;flex-direction:column;gap:0.4rem;">
            <li>All-Reduce ring topology optimized over RDMA and eBPF kernel sockets</li>
            <li>Lossless parameter quantization down to int4 with FP8 master gradients</li>
            <li>Fault tolerance: Dynamic ring healing in under 15ms upon node disconnection</li>
          </ul>
        </div>
      `
    },
    'rust-kernel': {
      title: 'Rust Microkernel Architecture',
      content: `
        <div style="display:flex;flex-direction:column;gap:0.8rem;">
          <p>Capability-based isolation with asynchronous IPC message passing engineered for zero allocation overhead.</p>
          <p style="font-size:0.82rem;color:var(--text-muted);">
            Written entirely in <code>no_std</code> bare-metal Rust. Utilizes hardware paging tables directly with no intermediate virtualization layer.
          </p>
        </div>
      `
    },
    'event-broker': {
      title: 'High-throughput Event Broker',
      content: `
        <div style="display:flex;flex-direction:column;gap:0.8rem;">
          <p>Memory-mapped zero-copy queue pipeline achieving 14.8M ops/sec with deterministic P99.9 latency.</p>
          <p style="font-size:0.82rem;color:var(--text-muted);">
            Employs cache-line padded ring buffers and kernel-bypass network drivers for deterministic tail-latency SLAs.
          </p>
        </div>
      `
    },
    'edge-k8s': {
      title: 'Kubernetes Edge Orchestrator',
      content: `
        <div style="display:flex;flex-direction:column;gap:0.8rem;">
          <p>Autonomous lightweight control plane deploying resilient AI workloads across heterogeneous edge nodes.</p>
          <p style="font-size:0.82rem;color:var(--text-muted);">
            Integrated with Cilium eBPF mesh for telemetry-aware automatic pod rebalancing across cellular and satellite uplinks.
          </p>
        </div>
      `
    },
    'serverless-gw': {
      title: 'Multi-Region Serverless Gateway',
      content: `
        <div style="display:flex;flex-direction:column;gap:0.8rem;">
          <p>Geo-distributed API router executing smart failovers and localized edge compute caching in under 12ms.</p>
          <p style="font-size:0.82rem;color:var(--text-muted);">
            Full HTTP/3 QUIC stream multiplexing with zero-RTT connection resumption across 34 global PoPs.
          </p>
        </div>
      `
    }
  };

  projectActionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project');
      const data = projectDetailsMap[projectKey];
      if (data && projectModal && projectModalTitle && projectModalBody) {
        projectModalTitle.textContent = data.title;
        projectModalBody.innerHTML = data.content;
        projectModal.classList.add('active');

        // Setup benchmark button if inside AetherCore
        const simBtn = document.getElementById('runWasmSimBtn');
        const resText = document.getElementById('wasmBenchmarkResult');
        if (simBtn && resText) {
          simBtn.addEventListener('click', () => {
            simBtn.textContent = 'Executing tensors...';
            simBtn.disabled = true;
            setTimeout(() => {
              resText.textContent = '✔ 100,000 matrix ops completed in 24.8ms (4.03M ops/sec throughput). Memory peak: 12MB.';
              simBtn.textContent = 'Run Benchmark Again';
              simBtn.disabled = false;
            }, 600);
          });
        }
      }
    });
  });

  // Resource link modals (Whitepaper, WebGL Demo, Mentorship)
  const whitepaperBtn = document.getElementById('whitepaperBtn');
  const whitepaperModal = document.getElementById('whitepaperModal');
  if (whitepaperBtn && whitepaperModal) {
    whitepaperBtn.addEventListener('click', (e) => {
      e.preventDefault();
      whitepaperModal.classList.add('active');
    });
  }

  const mentorshipBtn = document.getElementById('mentorshipBtn');
  const mentorshipModal = document.getElementById('mentorshipModal');
  if (mentorshipBtn && mentorshipModal) {
    mentorshipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mentorshipModal.classList.add('active');
    });
  }
}

/**
 * 5. Animated Telemetry Numbers
 */
function initTelemetryCounters() {
  const metrics = [
    { id: 'statStars', target: 15.2, suffix: 'k+' },
    { id: 'statUptime', target: 99.99, suffix: '%' },
    { id: 'statCrates', target: 42, suffix: '' },
    { id: 'statDownloads', target: 2.1, suffix: 'M+' }
  ];

  metrics.forEach(m => {
    const el = document.getElementById(m.id);
    if (!el) return;
    el.textContent = `${m.target}${m.suffix}`;
  });
}

/**
 * 6. Code Inspector & 3-File Downloader
 * Lets the user inspect, copy, or download index.html, style.css, script.js
 */
function initCodeInspector() {
  const openInspectorBtn = document.getElementById('openCodeInspectorBtn');
  const inspectorModal = document.getElementById('codeInspectorModal');
  if (!openInspectorBtn || !inspectorModal) return;

  openInspectorBtn.addEventListener('click', () => {
    inspectorModal.classList.add('active');
    loadSourceCodes();
  });

  // Tab switching
  const tabs = document.querySelectorAll('.code-tab-btn');
  const panes = document.querySelectorAll('.code-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(tab.getAttribute('data-target'));
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Copy code buttons
  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeId = btn.getAttribute('data-code');
      const preElem = document.getElementById(codeId);
      if (preElem) {
        navigator.clipboard.writeText(preElem.textContent);
        const originalText = btn.innerHTML;
        btn.textContent = 'Copied! ✓';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }
    });
  });

  // Download All 3 Files button
  const downloadBtn = document.getElementById('downloadAllFilesBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      downloadFile('index.html', document.getElementById('codeHtmlPre').textContent);
      downloadFile('style.css', document.getElementById('codeCssPre').textContent);
      downloadFile('script.js', document.getElementById('codeJsPre').textContent);
    });
  }
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Loads the source code into the inspector modal pre elements
 */
async function loadSourceCodes() {
  try {
    const htmlPre = document.getElementById('codeHtmlPre');
    const cssPre = document.getElementById('codeCssPre');
    const jsPre = document.getElementById('codeJsPre');

    if (cssPre && (!cssPre.textContent || cssPre.textContent.includes('Loading...'))) {
      const resCss = await fetch('/style.css');
      if (resCss.ok) cssPre.textContent = await resCss.text();
    }

    if (jsPre && (!jsPre.textContent || jsPre.textContent.includes('Loading...'))) {
      const resJs = await fetch('/script.js');
      if (resJs.ok) jsPre.textContent = await resJs.text();
    }

    if (htmlPre && (!htmlPre.textContent || htmlPre.textContent.includes('Loading...'))) {
      const resHtml = await fetch('/index.html');
      if (resHtml.ok) htmlPre.textContent = await resHtml.text();
    }
  } catch (err) {
    console.error('Failed to load file contents for inspector:', err);
  }
}
