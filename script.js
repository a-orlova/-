document.querySelectorAll('img[data-f]').forEach(function (img) {
  var f = img.dataset.f;
  img.loading = 'lazy';
  img.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(f) + '?width=900';
  img.onerror = function () {
    var q = img.dataset.q || f.replace(/\.[a-z]+$/i, '').replace(/_/g, ' ');
    var d = document.createElement('a');
    d.className = 'ph';
    d.target = '_blank';
    d.rel = 'noopener';
    d.href = 'https://commons.wikimedia.org/w/index.php?ns6=1&search=' + encodeURIComponent(q);
    d.textContent = 'Фото недоступно';
    img.replaceWith(d);
  };
});

// Подсветка текущего раздела в меню
var links = document.querySelectorAll('nav a');
var io = new IntersectionObserver(function (es) {
  es.forEach(function (e) {
    if (e.isIntersecting) {
      links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });

var Q = [
  { q: 'По какому признаку делят беспилотные системы на четыре основных класса?', o: ['По стоимости', 'По среде работы', 'По стране-производителю', 'По цвету корпуса'], a: 1, e: 'Воздух, суша, поверхность воды и подводная среда определяют конструкцию и ограничения.' },
  { q: 'Какой тип БПЛА способен зависать на месте и взлетать вертикально?', o: ['Самолётного типа с катапультой', 'Мультироторный', 'Планер', 'Парашютный'], a: 1, e: 'Мультироторные аппараты взлетают вертикально и зависают, но летают недолго.' },
  { q: 'Что означает класс MALE у БПЛА, например Bayraktar TB2?', o: ['Малая масса, малая дальность', 'Средняя высота, большая продолжительность полёта', 'Максимальная скорость', 'Мультироторный, лёгкий'], a: 1, e: 'MALE — Medium Altitude Long Endurance.' },
  { q: 'Чем автономный подводный аппарат (AUV) отличается от ROV?', o: ['Работает без кабеля по программе миссии', 'Всегда меньше по размеру', 'Управляется по радио', 'Работает только у поверхности'], a: 0, e: 'ROV управляется оператором по кабелю, AUV выполняет заложенную миссию сам.' },
  { q: 'Какое ограничение связано именно с подводной средой?', o: ['Влияние рельефа', 'Отсутствие радиосвязи и GPS под водой', 'Нельзя нести датчики', 'Невозможна автономность'], a: 1, e: 'Радиоволны быстро затухают в воде, поэтому нужна автономность или кабель.' },
  { q: 'Какой тип БПЛА сочетает вертикальный взлёт и самолётный полёт?', o: ['Мультироторный', 'Гибридный (VTOL)', 'Самолётного типа', 'Вертолётный'], a: 1, e: 'VTOL взлетает и садится вертикально, а в полёте использует крыло.' },
  { q: 'Какой двигатель у гибридной платформы THeMIS?', o: ['Только электрический', 'Только дизельный', 'Дизель и электромотор', 'Паровой'], a: 2, e: 'THeMIS имеет гибридную силовую установку и может идти только на электричестве.' },
  { q: 'Чем Saildrone отличается от обычного катера?', o: ['Идёт под водой', 'Использует энергию ветра и солнца', 'Управляется по кабелю', 'Всегда с экипажем'], a: 1, e: 'Парусная платформа с солнечными панелями работает в море месяцами.' }
];
var i = 0, score = 0, box = document.getElementById('qbox');
function show() {
  if (i >= Q.length) {
    box.innerHTML = '<p class="q">Результат: ' + score + ' из ' + Q.length + '</p><button class="btn" id="again">Пройти ещё раз</button>';
    document.getElementById('again').onclick = function () { i = 0; score = 0; show(); };
    return;
  }
  var c = Q[i];
  box.innerHTML = '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div><p class="q">' + c.q + '</p>' +
    c.o.map(function (t, k) { return '<button class="opt" data-k="' + k + '">' + t + '</button>'; }).join('') +
    '<p class="fb" aria-live="polite"></p>';
  box.querySelectorAll('.opt').forEach(function (b) {
    b.onclick = function () {
      var k = +b.dataset.k;
      box.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
      box.querySelectorAll('.opt')[c.a].classList.add('ok');
      if (k === c.a) { score++; } else { b.classList.add('bad'); }
      box.querySelector('.fb').textContent = (k === c.a ? 'Верно. ' : 'Неверно. ') + c.e;
      var n = document.createElement('button');
      n.className = 'btn';
      n.textContent = i === Q.length - 1 ? 'Показать результат' : 'Дальше';
      n.onclick = function () { i++; show(); };
      box.appendChild(n);
      n.focus();
    };
  });
}
show();
