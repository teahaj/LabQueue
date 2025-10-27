// Shared JS for student & instructor pages

async function fetchQueue() {
  const res = await fetch('/queue');
  if (!res.ok) return null;
  return res.json();
}

function renderQueue(data) {
  const nextEl = document.getElementById('next');
  const restEl = document.getElementById('rest');
  if (!data) {
    nextEl.textContent = '(error)';
    restEl.innerHTML = '';
    return;
  }
  if (data.next) {
    nextEl.textContent = data.next.id;
  } else {
    nextEl.textContent = '(none)';
  }
  restEl.innerHTML = '';
  (data.rest || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.id;
    restEl.appendChild(li);
  });
}

async function poll() {
  const data = await fetchQueue().catch(()=>null);
  renderQueue(data);
}

// Student join form
const form = document.getElementById('joinForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idEl = document.getElementById('studentId');
    const student_id = idEl.value;
    try {
      const res = await fetch('/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to join');
      } else {
        idEl.value = '';
        poll();
      }
    } catch (err) {
      alert('Network error');
    }
  });
}

// Instructor pop button
const popBtn = document.getElementById('popBtn');
if (popBtn) {
  popBtn.addEventListener('click', async () => {
    try {
      const res = await fetch('/pop', { method: 'POST' });
      const data = await res.json();
      const out = document.getElementById('popResult');
      if (!res.ok) {
        out.textContent = data.error || 'Nothing to pop';
        out.style.color = 'red';
      } else {
        out.textContent = `Popped ${data.popped.id}`;
        out.style.color = 'green';
      }
      poll();
    } catch (err) {
      alert('Network error');
    }
  });
}

// Start polling every 2s
poll();
setInterval(poll, 2000);
