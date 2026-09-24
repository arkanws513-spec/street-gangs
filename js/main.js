// نقطة تشغيل اللعبة - Phaser
(function () {
  'use strict';

  var started = false;

  function showFatalError(message, error) {
    var container = document.getElementById('game-container');
    if (!container) return;

    container.innerHTML =
      '<div style="direction:rtl;color:#fff;background:#14171f;min-height:100vh;' +
      'display:flex;align-items:center;justify-content:center;padding:24px;' +
      'font-family:Cairo,Arial,sans-serif;text-align:center">' +
      '<div style="max-width:700px">' +
      '<h2 style="color:#d4af37">تعذر تشغيل اللعبة</h2>' +
      '<p>' + String(message) + '</p>' +
      '<p style="color:#9aa2b1;font-size:13px">افتح وحدة التحكم في المتصفح لمعرفة الخطأ التفصيلي.</p>' +
      '</div></div>';

    if (window.console && console.error) console.error(error || message);
  }

  function boot() {
    if (started) return;

    if (!window.Phaser) {
      showFatalError('محرك Phaser لم يتم تحميله.');
      return;
    }

    // الدوال المعرّفة بـ function تصبح خصائص على window، لكن class
    // المعرّفة في ملفات script التقليدية تبقى في النطاق العام دون window.X.
    // لذلك نتحقق من وجود كل رمز مباشرة بدل window[اسم].
    var missing = [];
    if (typeof GameState === 'undefined') missing.push('GameState');
    if (typeof CityScene === 'undefined') missing.push('CityScene');
    if (typeof CrewScene === 'undefined') missing.push('CrewScene');
    if (typeof MissionsScene === 'undefined') missing.push('MissionsScene');
    if (typeof AttackScene === 'undefined') missing.push('AttackScene');

    if (missing.length) {
      showFatalError('ملفات اللعبة لم تُحمّل بشكل صحيح: ' + missing.join('، '));
      return;
    }

    try {
      window.gameState = new GameState();
      window.gameState.load();

      var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 620,
        parent: 'game-container',
        backgroundColor: '#14171f',
        scene: [CityScene, CrewScene, MissionsScene, AttackScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 800,
          height: 620
        },
        render: {
          antialias: true,
          roundPixels: false
        }
      };

      window.game = new Phaser.Game(config);
      started = true;

      // تحديث حالة اللعبة خارج دورة الرسم، مع منع تراكم المؤقتات.
      window.gameStateTimer = window.setInterval(function () {
        if (window.gameState) window.gameState.tick(1);
      }, 1000);

      window.gameSaveTimer = window.setInterval(function () {
        if (window.gameState) window.gameState.save();
      }, 5000);

      window.addEventListener('beforeunload', function () {
        if (window.gameState) window.gameState.save();
      });
    } catch (error) {
      showFatalError('حدث خطأ أثناء إنشاء محرك اللعبة.', error);
    }
  }

  function loadPhaserFallback() {
    if (window.Phaser) {
      boot();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://unpkg.com/phaser@3.70.0/dist/phaser.min.js';
    script.onload = boot;
    script.onerror = function (error) {
      showFatalError('تعذر تحميل Phaser من الخادم الرئيسي والبديل.', error);
    };
    document.head.appendChild(script);
  }

  window.addEventListener('load', function () {
    if (window.Phaser) {
      boot();
    } else {
      loadPhaserFallback();
    }
  });
})();