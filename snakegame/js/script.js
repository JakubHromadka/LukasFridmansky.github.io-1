var menu = $('.settings-menu');

menu.hide();

function slideToggleMenu(){
    menu.slideToggle(250);
}

document.addEventListener('keydown', keyPush);

function keyPush(event){
    switch (event.key){
        case event.key:
            menu.slideUp(250);
            help.classList.remove('active');
            break;
    }
}

document.addEventListener('touchstart', touchStart);
document.addEventListener('touchend', touchEnd);

function touchStart(event){
    xPositionStart = event.touches[0].clientX;
    yPositionStart = event.touches[0].clientY;
    //console.log(xPositionStart, yPositionStart);
}
function touchEnd(event){
    //console.log(event.changedTouches);
    xPositionEnd = event.changedTouches[0].clientX;
    yPositionEnd = event.changedTouches[0].clientY;
    //console.log(xPositionEnd, yPositionEnd);
    slideSettings();
}
function slideSettings(){
    if ((xPositionStart - xPositionEnd > 1 || xPositionStart - xPositionEnd < -1) && (yPositionStart - yPositionEnd > 1 || yPositionStart - yPositionEnd < -1)){
        menu.slideUp(250);
        help.classList.remove('active');
    }
}

let help = document.querySelector('.help');

function helpButton(){
    help.classList.toggle('active');
}

function quitButton(){
    help.classList.toggle('active');
}