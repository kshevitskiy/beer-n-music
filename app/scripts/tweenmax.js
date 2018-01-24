const controller = new ScrollMagic.Controller({
    refreshInterval: 0
});

const fadeIn = [...document.querySelectorAll('.fade-in-tm')];
const fadeOut = [...document.querySelectorAll('.fade-out-tm')];
const slides = [...document.querySelectorAll('.slide')];
const content = [...document.querySelectorAll('.slide-content')];
const changeBg = [...document.querySelectorAll('.change-bg-tm')];

var ANIMATION = {

    mouseMove: function(event) {
        var y = event.touches ? event.touches[0].clientY : event.clientY;
        var h = window.innerHeight / 2;
        var t = -(y - h) / (h / 10);
      
        TweenMax.to('.slide__image', 1, {
            y: t + "%",
            force3D: true
        });
    },

    scrollMagic: {

        slideWipe: function() {
            for (let i = 0; i < slides.length; i++) {

                new ScrollMagic.Scene({
                        triggerElement: slides[i],
                        triggerHook: 0,
                        duration: '100%'
                    })
                    .setPin(slides[i])
                    .addTo(controller);
            };
        },

        changeBackground: function(element) {
            for (let i = 0; i < element.length; i++) {

                new ScrollMagic.Scene({
                        triggerElement: element[i],
                        triggerHook: 0,
                        duration: '100%'
                    })
                    .setTween(TweenMax.to(element[i], 1, {
                        backgroundColor: 'transparent',
                        ease: Power0.easeNone
                    }))
                    .addTo(controller);
            }
        },                

        fadeIn: function(element) {
            for (let i = 0; i < element.length; i++) {

                    new ScrollMagic.Scene({
                            triggerElement: element[i].parentNode.parentNode,
                            triggerHook: 0,
                            // duration: '100%'
                        })
                        .setTween(TweenMax.from(element[i], .3, {
                            transform: 'translateY(20px)',
                            autoAlpha: 0,
                            ease: Power0.easeNone
                        }))
                        .addTo(controller);
            }
        },

        fadeOut: function(element) {
            for (let i = 0; i < element.length; i++) {

                new ScrollMagic.Scene({
                        triggerElement: element[i].parentNode.parentNode,
                        triggerHook: 0,
                        offset: 251,
                        // duration: '100%'
                    })
                    .setTween(TweenMax.to(element[i], .3, {
                        transform: 'translateY(20px)',
                        autoAlpha: 0,
                        ease: Power0.easeNone
                    }))
                    .addTo(controller);
            }
        },             
    },

    events: function() {
        slides[0].addEventListener("mousemove", ANIMATION.mouseMove);
        slides[0].addEventListener("touchstart", ANIMATION.mouseMove);
        slides[0].addEventListener("touchmove", ANIMATION.mouseMove);
    },

    init: function() {
        ANIMATION.events();
        ANIMATION.scrollMagic.slideWipe();
        ANIMATION.scrollMagic.changeBackground(changeBg);
        ANIMATION.scrollMagic.fadeIn(fadeIn);
        ANIMATION.scrollMagic.fadeOut(fadeOut);
    },
};

module.exports = {
    init : ANIMATION.init
};