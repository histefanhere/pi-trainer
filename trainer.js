/*jshint browser: true, devel: true*/
(function () {
    var pi, entered = "", errors = 0, keys, hintShown = false;
    var loadingEl, centreEl, piEl;
    var digitsCountEl, errorsCountEl, percentCountEl;
    var resetBtn, hintBtn;
    var inputMOBILE;

    keys = {
        digits: {},
        reset: 'KeyR',
        hint: 'KeyH'
    };
    for (let i = 0; i < 10; i++) {
        keys.digits['Digit' + i] = i;
    }

    if (document.readyState === "complete")
        init();
    else
        document.addEventListener("readystatechange", function () {
            if (document.readyState === "complete")
                init();
        });

    function init () {
        loadingEl = document.getElementById("loading");
        centreEl = document.getElementById('centre');
        piEl = document.getElementById("pi");

        digitsCountEl = document.getElementById("digits-count");
        errorsCountEl = document.getElementById("errors-count");
        percentCountEl = document.getElementById("percent-count");

        resetBtn = document.getElementById('reset-button');
        hintBtn = document.getElementById('hint-button');

        inputMOBILE = document.getElementById('input-MOBILE');

        console.log("Loading pi from file \"./pi.txt\" - Now would be a good time to go and study!");
        setTimeout(getPi, 200);
    }
    
    function getPi() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", "pi.txt");
        xhr.onload = function () { onPi(this); };
        xhr.send();
    }
    
    function onPi(xhr) {
        pi = xhr.responseText;

        console.log("Pi finished loading.");

        var tl = anime.timeline({
            duration: 500,
            easing: 'easeInOutCubic'
        });
        tl
        .add({
            targets: loadingEl,
            opacity: 0,
            complete: () => {loadingEl.style.display = "none"; centreEl.style.display = "block";}
        })
        .add({
            targets: centreEl,
            opacity: 1
        });

        listenToEvents();
    }

    function listenToEvents() {
        resetBtn.addEventListener("click", function () {
            reset();
        });

        hintBtn.addEventListener('click', function () {
            toggleHint();
        });

        var helpModal = document.getElementById('help-modal');
        var toggleModal = function () {
            helpModal.classList.toggle('modal-hidden');
            helpModal.classList.toggle('modal-visible');
        };
        document.getElementById('help-modal-btn').addEventListener('click', toggleModal);
        document.getElementById('help-modal-close').addEventListener('click', toggleModal);
        window.onclick = function(event) {
            if (event.target == helpModal) {
                toggleModal();
            }
        };

        window.addEventListener("keydown", function (e) {
            var keyCode = e.code;

            // Backspace
            // if (keyCode === 8 && entered.length > 0) {
            //     entered = entered.substring(0, entered.length - 1);
            //     e.preventDefault();
            // }

            if (keyCode == keys.reset) {
                reset();
            }
            else if (keyCode == keys.hint) {
                toggleHint();
            }
            else if (keys.digits[keyCode] !== undefined) {
                var key = keys.digits[keyCode].toString();
                if (pi.charAt(entered.length) === key) {
                    // They've pressed the right key!
                    entered = entered + "" + key;

                } else {
                    // They've pressed the WRONG key
                    errors += 1;
                    errorAnimation();
                }
            }

            if (inputMOBILE.value) {
                inputMOBILE.value = "";
            }

            showEntered();
            updateInfos();
            percentCountEl.scrollIntoView();
        });
    }

    function showEntered() {
        piEl.innerText = entered;
        if (hintShown) {
            var hintDigit = pi.charAt(entered.length);
            piEl.innerHTML += "<span id=\"hint\">" + hintDigit + "</span>";
        }
    }

    function errorAnimation () {
        if (!('animating' in document.body.classList)) {
            anime({
                targets: 'body',
                duration: 180,
                keyframes: [
                    {backgroundColor: '#ffc0c0', easing: 'cubicBezier(0.165, 0.840, 0.440, 1.000)'}, // easeOutQuart
                    {backgroundColor: '#fcfcfc', easing: 'cubicBezier(0.895, 0.030, 0.685, 0.220)'} // easeInQuart
                ],
                begin: () => document.body.classList.add('animating'),
                complete: () => document.body.classList.remove('animating')
            });
        }
    }

    function reset() {
        entered = "";
        errors = 0;
        showEntered();
        updateInfos();

        anime({
            targets: resetBtn,
            rotate: -360,
            easing: "easeOutBack",
            duration: 500,
            complete: anime.set(resetBtn, {rotate: 0})
        });
    }

    function updateInfos () {
        digits = entered.length;
        digitsCountEl.innerText = "" + digits;
        errorsCountEl.innerText = errors;
        if (digits == 0) {
            percentCountEl.innerHTML = "0";
        }
        else {
            percentCountEl.innerText = Math.round(100 * digits / (digits + errors));
        }
    }

    function toggleHint () {
        hintShown = !hintShown;
        hintBtn.classList.toggle('hintShown');
        showEntered();
    }
})();
