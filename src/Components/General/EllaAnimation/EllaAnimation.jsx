

import React, { useEffect, useContext, useRef } from 'react';
import AnimeJS from 'animejs/lib/anime.es.js';
import { CoreContext } from '../../../Services/Core/Context';
import './EllaAnimation.css';

const EllaAnimation = () => {
    const TapEventListenerID = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? ('touchstart') : ('mousedown');
    const ELLA_TITLE_IN_DURATION = 1300;
    const ELLA_TITLE_OUT_DURATION = 700;

    const CanvasReference = useRef(null);
    const EllaTitleReference = useRef(null);
    const { SetIsEllaAnimationEnabled } = useContext(CoreContext);
    
    const ScreenFireworkEffect = () => {
      let X = 0;
      let Y = 0;
      const Canvas = CanvasReference.current;
      const Context = Canvas.getContext('2d');
      const TotalParticules = 24;
      const Distance = 200;
      const Animations = [];
      const Colors = ['#FF324A', '#31FFA6', '#206EFF', '#FFFF99'];
      const GetFontSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
      
      const SetCanvasSize = function() {
          Canvas.width = window.innerWidth;
          Canvas.height = window.innerHeight;
      }
    
      const UpdateCoords = function(Event) {
          X = Event.clientX || Event.touches[0].clientX;
          Y = Event.clientY || Event.touches[0].clientY;
      }
    
      const CreateCircle = function(X, Y) {
          const Properties = {};
          Properties.x = X;
          Properties.y = Y;
          Properties.color = '#FFF';
          Properties.radius = 0;
          Properties.alpha = 1;
          Properties.lineWidth = 6;
          Properties.draw = function() {
            Context.globalAlpha = Properties.alpha;
            Context.beginPath();
            Context.arc(Properties.x, Properties.y, Properties.radius, 0, 2 * Math.PI, true);
            Context.lineWidth = Properties.lineWidth;
            Context.strokeStyle = Properties.color;
            Context.stroke();
            Context.globalAlpha = 1;
          }
          return Properties;
      }
    
      const CreateParticule = (X, Y) => {
          const Properties = {};
          Properties.x = X;
          Properties.y = Y;
          Properties.color = Colors[AnimeJS.random(0, Colors.length - 1)];
          Properties.radius = AnimeJS.random(GetFontSize(), GetFontSize() * 2);
          Properties.draw = function() {
            Context.beginPath();
            Context.arc(Properties.x, Properties.y, Properties.radius, 0, 2 * Math.PI, true);
            Context.fillStyle = Properties.color;
            Context.fill();
          }
          return Properties;
      }
    
      const CreateParticles = (X, Y) => {
          var Particules = [];
          for(let Iterator = 0; Iterator < TotalParticules; Iterator++)
              Particules.push(CreateParticule(X, Y));
          return Particules;
      }
    
      const RemoveAnimation = (Animation) => {
          const Index = Animations.indexOf(Animation);
          (Index > -1) && (Animations.splice(Index, 1));
      }
    
      var AnimateParticules = (X, Y) => {
          SetCanvasSize();
          var Particules = CreateParticles(X, Y);
          var Circle = CreateCircle(X, Y);
          var ParticulesAnimation = AnimeJS({
              targets: Particules,
              x: (Properties) => Properties.x + AnimeJS.random(-Distance, Distance),
              y: (Properties) => Properties.y + AnimeJS.random(-Distance, Distance),
              radius: 0,
              duration: () => AnimeJS.random(1200, 1800),
              easing: 'easeOutExpo',
              complete: RemoveAnimation
          });
          var CircleAnimation = AnimeJS({
              targets: Circle,
              radius: () => AnimeJS.random(GetFontSize() * 8.75, GetFontSize() * 11.25),
              lineWidth: 0,
              alpha: {
                  value: 0,
                  easing: 'linear',
                  duration: () => AnimeJS.random(400, 600)
              },
              duration: () => AnimeJS.random(1200, 1800),
              easing: 'easeOutExpo',
              complete: RemoveAnimation
          });
          Animations.push(ParticulesAnimation);
          Animations.push(CircleAnimation);
      }
    
       AnimeJS({
          duration: Infinity,
          update: () => {
              Context.clearRect(0, 0, Canvas.width, Canvas.height);
              Animations.forEach((Animation) => Animation.animatables.forEach((Animatable) => Animatable.target.draw()));
          }
        });
    
      document.addEventListener(TapEventListenerID, (Event) => {
          UpdateCoords(Event);
          AnimateParticules(X, Y);
      }, false);
    
      window.addEventListener('resize', SetCanvasSize, false);
    };

    const EllaTitleAnimation = () => {
      EllaTitleReference.current.innerHTML = EllaTitleReference.current.textContent.replace(/\S/g, '<span class="Letter">$&</span>');
      AnimeJS.timeline({ loop: false })
          .add({
              targets: '.Title .Letter',
              translateX: [40,0],
              translateZ: 0,
              opacity: [0,1],
              easing: 'easeOutExpo',
              duration: Ella_TITLE_IN_DURATION,
              delay: (_, Index) => 500 + 30 * Index
          })
          .add({
              targets: '.Title .Letter',
              translateX: [0,-30],
              opacity: [1,0],
              easing: 'easeInExpo',
              duration: ELLA_TITLE_OUT_DURATION,
              delay: (_, Index) => 100 + 30 * Index,
              complete: () => SetIsEllaAnimationEnabled(false)
          });
    };

    useEffect(() => {
        ScreenFireworkEffect();
        EllaTitleAnimation();
    }, []);

    return (
        <React.Fragment>
            <canvas ref={CanvasReference} id='Firework-Canvas' />
            <aside id='Ella-Animation-Box'>
                <h3 className='Title' ref={EllaTitleReference}>Ella AI</h3>
            </aside>
        </React.Fragment>
    );
};

export default EllaAnimation;