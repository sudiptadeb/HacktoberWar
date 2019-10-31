<template>
  <div class="flex card-holder">
  </div>
</template>

<script>
    import AttackMap from '../map/AttackMap'
    export default {
        name: "WarMap",
        mounted() {
            AttackMap(this.$el);
        },
        methods: {}
    }



</script>

<style lang="scss">





  #map {
    left: 0;
    top: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  #map svg {
    width: 100%;
    height: 100%;
  }



  .card-holder{
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background: #7383af;
  }
  .card-holder >*{
    position: absolute;
    overflow: hidden;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }



  .flame {
    animation-name: flamefly;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    opacity: 0;
    transform-origin: 50% 50% 0;
  }
  .flame.one {
    /*animation-delay: 1s;*/
    animation-duration: .3s;
  }
  .flame3.two{
    animation-duration: .5s;
    /*animation-delay: 1s;*/
  }

  .flame-main {
    animation-name: flameWobble;
    animation-duration: .5s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .flame-main.one {
    animation-duration: .4s;
    /*animation-delay: 1s;*/
  }
  .flame-main.two {
    animation-duration: .3s;
    /*animation-delay: 2s;*/
  }
  .flame-main.three {
    animation-duration: .21s;
    /*animation-delay: 3s;*/
  }
  .flame-main.four {
    animation-duration: .32s;
    /*animation-delay: 4s;*/
  }
  .flame-main.five {
    animation-duration: .25s;
    /*animation-delay: 5s;*/
  }
  @keyframes flameWobble {
    50% {
      transform: scale(1,1.2) translate(0, -30px) rotate(-2deg);
    }
  }
  @keyframes flamefly {
    0% {
      transform: translate(0) rotate(180deg);
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translate(-20px, -100px) rotate(180deg);
      opacity: 0;
    }
  }



</style>