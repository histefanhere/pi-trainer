/*jshint browser: true, devel: true*/
(function () {
    var pi, entered = "", errors = 0, keys, hintShown = false;
    var loadingEl, centreEl, piEl, hintEl;
    var digitsCountEl, errorsCountEl, percentCountEl;
    var resetBtn, hintBtn;
    var inputMOBILE;

    keys = {
        48: 0,
        49: 1,
        50: 2,
        51: 3,
        52: 4,
        53: 5,
        54: 6,
        55: 7,
        56: 8,
        57: 9,
        96: 0,
        97: 1,
        98: 2,
        99: 3,
        100: 4,
        101: 5,
        102: 6,
        103: 7,
        104: 8,
        105: 9
    };

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
        piHintEl = document.getElementById("pi-hint");

        digitsCountEl = document.getElementById("digits-count");
        errorsCountEl = document.getElementById("errors-count");
        percentCountEl = document.getElementById("percent-count");

        resetBtn = document.getElementById('reset-button');
        hintBtn = document.getElementById('hint-button')

        inputMOBILE = document.getElementById('input-MOBILE');

        console.log("Loading pi from file \"./pi.txt\" - Now would be a good time to go and study!");
        setTimeout(getPi, 200);
    }
    
    function getPi() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", "pi.txt");
        xhr.onload = function () { onPi(this) };
        xhr.send();
    }
    
    function onPi(xhr) {
        pi = xhr.responseText;

        console.log("Pi finished loading.");

        let tl = anime.timeline({
            duration: 500,
            easing: 'easeInOutCubic'
        })
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

        window.addEventListener("keydown", function (e) {
            // TODO: These are depreciated
            var keyCode = e.which || e.keyCode;

            // Backspace
            if (keyCode === 8 && entered.length > 0) {
                entered = entered.substring(0, entered.length - 1);
                e.preventDefault();
            }

            // TODO: Maybe these should be letter keys?

            // Delete Key
            else if (keyCode == 46) {
                reset();
            }

            // Space
            else if (keyCode === 32) {
                toggleHint();
            }

            // Number
            else if (keys[keyCode] !== undefined) {
                let key = keys[keyCode].toString();
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
            let hintDigit = pi.charAt(entered.length);
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
        piEl.innerText = "";
        updateInfos();

        anime({
            targets: resetBtn,
            rotate: -360,
            easing: "easeOutBack",
            duration: 500,
            complete: anime.set(resetBtn, {rotate: 0})
        })
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
