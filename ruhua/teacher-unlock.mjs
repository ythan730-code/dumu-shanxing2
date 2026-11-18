const form = document.querySelector('#teacher-login');
const input = document.querySelector('#teacher-password');
const submit = form.querySelector('button[type="submit"]');
const status = document.querySelector('#login-status');
const root = new URL('./', location.href);
const moduleRoot = new URL('ruhua/', root);
let busy = false;

function bytes(base64) {
  return Uint8Array.from(atob(base64), char => char.charCodeAt(0));
}

async function decryptLesson(password) {
  const response = await fetch(new URL('ruhua/teacher-lesson.enc.json?v=20261118-encrypted', root), {cache: 'no-store'});
  if (!response.ok) throw new Error('load');
  const envelope = await response.json();
  if (envelope.version !== 1 || envelope.iterations !== 600000) throw new Error('format');
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    {name: 'PBKDF2', salt: bytes(envelope.salt), iterations: envelope.iterations, hash: 'SHA-256'},
    material,
    {name: 'AES-GCM', length: 256},
    false,
    ['decrypt']
  );
  const plaintext = await crypto.subtle.decrypt(
    {name: 'AES-GCM', iv: bytes(envelope.iv), tagLength: 128},
    key,
    bytes(envelope.ciphertext)
  );
  return JSON.parse(new TextDecoder().decode(plaintext));
}

async function openLesson(lesson) {
  const urls = [];
  function moduleURL(source) {
    const url = URL.createObjectURL(new Blob([source], {type: 'text/javascript'}));
    urls.push(url);
    return url;
  }
  const dataURL = moduleURL(lesson.data);
  // Blob modules need absolute URLs for the existing, locally hosted game modules.
  const application = lesson.application.replace(/from\s+(['"])(\.\/[^'"]+)\1/g, (match, quote, specifier) => {
    const url = specifier.startsWith('./appreciation-data.mjs') ? dataURL : new URL(specifier, moduleRoot).href;
    return 'from ' + JSON.stringify(url);
  });
  const applicationURL = moduleURL(application);
  const page = new DOMParser().parseFromString(lesson.html, 'text/html');
  page.querySelectorAll('script, base').forEach(element => element.remove());
  const base = page.createElement('base');
  base.href = root.href;
  page.head.prepend(base);
  const style = page.createElement('style');
  // Preserve image paths from the stylesheet's original ruhua/ directory.
  style.textContent = lesson.styles.replace(/url\((['"]?)([^)'"\s]+)\1\)/g,
    (match, quote, relative) => 'url(' + JSON.stringify(new URL(relative, moduleRoot).href) + ')');
  page.head.append(style);
  page.querySelector('nav').insertAdjacentHTML('beforeend', '<button type="button" id="lock-lesson">鎖定賞析</button>');
  document.head.replaceChildren(...Array.from(page.head.childNodes, node => document.importNode(node, true)));
  document.body.replaceWith(document.importNode(page.body, true));
  document.querySelector('#lock-lesson').addEventListener('click', () => location.reload());
  try {
    await import(applicationURL);
    document.querySelector('#heading').focus();
  } catch (error) {
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.style.cssText = 'position:fixed;inset:80px 5% auto;z-index:20000;background:#f5edda;color:#293e34;padding:18px';
    message.textContent = '賞析未能完整載入，請重新整理後再輸入密碼。';
    document.body.append(message);
    console.error('Teacher lesson could not open', error);
  } finally {
    urls.forEach(url => URL.revokeObjectURL(url));
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  if (!input.value) {
    status.textContent = '請先輸入教師密碼。';
    input.focus();
    return;
  }
  if (!globalThis.crypto?.subtle) {
    status.textContent = '請透過 GitHub 網址開啟此頁，再輸入教師密碼。';
    return;
  }
  busy = true;
  submit.disabled = true;
  input.disabled = true;
  status.textContent = '正在開啟賞析……';
  let password = input.value;
  input.value = '';
  try {
    const lesson = await decryptLesson(password);
    password = '';
    await openLesson(lesson);
  } catch (error) {
    password = '';
    status.textContent = error.name === 'OperationError' ? '密碼不正確，請再試一次。' : '賞析檔案未能載入，請重新整理或檢查是否已上傳全部檔案。';
    busy = false;
    submit.disabled = false;
    input.disabled = false;
    input.focus();
  }
});

// Returning through browser history also returns to the password screen.
window.addEventListener('pageshow', event => {
  if (event.persisted) location.reload();
});
