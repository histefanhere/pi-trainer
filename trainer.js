/*jshint browser: true, devel: true*/
(function () {
    var pi, entered = "", errors = 0, keys, hintShown = false;
    var loadingEl, centreEl, piEl, hintEl;
    var digitsCountEl, errorsCountEl, percentCountEl;

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

        // TODO: This was how you had to reset the count, but we'll think of something better than this.
        // (a reset button would be nice)
        // - ooooo, what if it had a cool SPIN animation when you clicked it
        // digitsCountEl.addEventListener("click", function () {
        //     entered = "";
        //     piEntryEl.innerText = "";
        //     hideHint();
        //     piDigitsCountEl.innerText = "0";
        // });

        // TODO: Better way to show a hint
        // hintEl.addEventListener("click", toggleHint);

        console.log("Loading pi from file \"./pi.txt\" - Go ahead and study it if you wish. Thanks to http://www.geom.uiuc.edu/~huberty/math5337/groupe/digits.html for 100,000 digits of PI!");
        pi = getPI();
        console.log("Pi finished loading.");

        // TODO: Nice smoother fade animation here
        loadingEl.style.display = "none";
        centreEl.style.display = "block";

        window.addEventListener("keydown", function (e) {
            // TODO: These are depreciated
            var keyCode = e.which || e.keyCode;

            // Backspace
            if (keyCode === 8 && entered.length > 0) {
                entered = entered.substring(0, entered.length - 1);
                e.preventDefault();
                // hideHint();

            // Space
            // } else if (keyCode === 32) {
                // toggleHint();

            // Number
            } else if (keys[keyCode] !== undefined) {
                let key = keys[keyCode].toString();
                if (pi.charAt(entered.length) === key) {
                    // They've pressed the right key!
                    entered = entered + "" + key;
                    // hideHint();
                } else {
                    // They've pressed the WRONG key
                    errors += 1;
                    errorAnimation();

                    // TODO: We don't want it to be *that* easy!
                    // *code basically for showing hint*
                }
            }

            piEl.innerText = entered;
            updateInfos();
            digitsCountEl.innerText = "" + entered.length;
        });
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

    function getPI () {
        // TODO: Maybe use jquery here instead of raw XML requests?
        // Would stop error of XML request on main thread
        var xhr = new XMLHttpRequest();
        xhr.open("get", "pi.txt", false);
        xhr.send();
        return xhr.responseText;
    }

    function toggleHint () {
        if (hintShown)
            hideHint();
        else
            showHint();
    }

    function showHint () {
        piHintEl.innerText = pi.charAt(entered.length);
        piHintEl.style.backgroundColor = "transparent";
        hintShown = true;
    }

    function hideHint () {
        piHintEl.innerHTML = "&nbsp;";
        piHintEl.style.backgroundColor = "";
        hintShown = false;
    }
})();
