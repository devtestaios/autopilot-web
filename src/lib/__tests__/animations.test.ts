import { 
  ANIMATION_CONFIG,
  animationVariants,
  scrollAnimations,
  animationUtils
} from '../animations';

describe('Animation System', () => {
  describe('ANIMATION_CONFIG', () => {
    it('should have spring configurations', () => {
      expect(ANIMATION_CONFIG).toHaveProperty('spring');
      expect(ANIMATION_CONFIG.spring).toMatchObject({
        type: 'spring',
        damping: expect.any(Number),
        stiffness: expect.any(Number),
        mass: expect.any(Number)
      });
    });

    it('should have springBouncy configuration', () => {
      expect(ANIMATION_CONFIG).toHaveProperty('springBouncy');
      expect(ANIMATION_CONFIG.springBouncy.type).toBe('spring');
    });

    it('should have springGentle configuration', () => {
      expect(ANIMATION_CONFIG).toHaveProperty('springGentle');
      expect(ANIMATION_CONFIG.springGentle.type).toBe('spring');
    });

    it('should have duration settings', () => {
      expect(ANIMATION_CONFIG).toHaveProperty('duration');
      expect(typeof ANIMATION_CONFIG.duration).toBe('object');
    });

    it('should have easing settings', () => {
      expect(ANIMATION_CONFIG).toHaveProperty('easing');
      expect(typeof ANIMATION_CONFIG.easing).toBe('object');
    });
  });

  describe('animationVariants', () => {
    it('should have pageTransition variant', () => {
      expect(animationVariants).toHaveProperty('pageTransition');
      const pageTransition = animationVariants.pageTransition;
      
      expect(pageTransition).toHaveProperty('initial');
      expect(pageTransition).toHaveProperty('animate');
      expect(pageTransition).toHaveProperty('exit');
    });

    it('should have modal variant', () => {
      expect(animationVariants).toHaveProperty('modal');
      const modal = animationVariants.modal;
      
      expect(modal).toHaveProperty('initial');
      expect(modal).toHaveProperty('animate');
    });

    it('should have fadeIn variant', () => {
      expect(animationVariants).toHaveProperty('fadeIn');
      const fadeIn = animationVariants.fadeIn;
      
      expect(fadeIn.initial).toMatchObject({
        opacity: 0
      });
      expect(fadeIn.animate).toMatchObject({
        opacity: 1
      });
    });

    it('should have slideUp variant', () => {
      expect(animationVariants).toHaveProperty('slideUp');
      const slideUp = animationVariants.slideUp;
      
      expect(slideUp.initial).toHaveProperty('y');
      expect(slideUp.animate.y).toBe(0);
    });

    it('should have scaleIn variant', () => {
      expect(animationVariants).toHaveProperty('scaleIn');
      const scaleIn = animationVariants.scaleIn;
      
      expect(scaleIn.initial.scale).toBeLessThan(1);
      expect(scaleIn.animate.scale).toBe(1);
    });

    it('should have stagger variant', () => {
      expect(animationVariants).toHaveProperty('stagger');
      const stagger = animationVariants.stagger;
      
      expect(stagger).toHaveProperty('animate');
      expect(stagger.animate).toHaveProperty('transition');
    });
  });

  describe('scrollAnimations', () => {
    it('should be defined as an object', () => {
      expect(scrollAnimations).toBeDefined();
      expect(typeof scrollAnimations).toBe('object');
    });

    it('should have scroll-triggered animations', () => {
      expect(scrollAnimations).toHaveProperty('fadeInOnScroll');
    });

    it('should have parallax effects', () => {
      expect(scrollAnimations).toHaveProperty('parallax');
    });
  });

  describe('animationUtils', () => {
    it('should be defined as an object', () => {
      expect(animationUtils).toBeDefined();
      expect(typeof animationUtils).toBe('object');
    });

    it('should have utility functions', () => {
      expect(animationUtils).toHaveProperty('createStagger');
      expect(typeof animationUtils.createStagger).toBe('function');
    });

    it('should have delay utilities', () => {
      expect(animationUtils).toHaveProperty('withDelay');
      expect(typeof animationUtils.withDelay).toBe('function');
    });

    it('createStagger should return proper config', () => {
      const stagger = animationUtils.createStagger(0.1);
      expect(stagger).toHaveProperty('transition');
      expect(stagger.transition).toHaveProperty('staggerChildren');
    });

    it('withDelay should add delay to animation', () => {
      const baseAnimation = { opacity: 1 };
      const delayedAnimation = animationUtils.withDelay(baseAnimation, 0.5);
      expect(delayedAnimation).toHaveProperty('transition');
      expect(delayedAnimation.transition.delay).toBe(0.5);
    });
  });
});