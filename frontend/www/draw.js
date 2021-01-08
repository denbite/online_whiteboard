window.onload = function(){

    console.log('script started!');

    var ws = new WebSocket("ws://127.0.0.1:8000");

    ws.onmessage = function (event) {

        data = JSON.parse(event.data)

        console.log(data);
    };

    // create canvas element and append it to document body
    var canvas = document.getElementById('drawingCanvas');
    var saveButton = document.getElementById('saveButton');
    var clearButton = document.getElementById('clearButton');

    var strData = undefined
    strData = undefined
    // some hotfixes... ( ≖_≖)
    document.body.style.margin = 0;
    canvas.style.position = 'fixed';

    // get canvas 2D context and set him correct size
    var ctx = canvas.getContext('2d');

    if (strData != undefined) {
        var img = new Image();

        img.src = strData;

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        }

    }

    resize();

    // last known position
    var pos = { x: 0, y: 0 };

    canvas.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('mousedown', setPosition);
    canvas.addEventListener('touchend', setPosition);
    canvas.addEventListener('mouseenter', setPosition);
    canvas.addEventListener('touchstart', setPosition);


    saveButton.addEventListener('click', saveCanvas);
    clearButton.addEventListener('click', clearCanvas);

    function saveCanvas(event) {
        console.log('clicked!');

        data = canvas.toDataURL('image/png');

        console.log('data: ', data);

        ws.send(JSON.stringify({name: 'denbite'}));
    }

    // new position from mouse event
    function setPosition(e) {
        if (e.touches) e = e.touches[0];

        pos.x = e.clientX - e.target.offsetLeft;
        pos.y = e.clientY - e.target.offsetTop;

    }

    // resize canvas
    function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    }

    function draw(e) {
        // mouse left button must be pressed
        if (e.buttons !== 1) return;
        if (e.touches) e = e.touches[0];

        ctx.beginPath(); // begin

        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#c0392b';

        ctx.moveTo(pos.x, pos.y); // from
        setPosition(e);
        ctx.lineTo(pos.x, pos.y); // to

        ctx.stroke(); // draw it!
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }


}