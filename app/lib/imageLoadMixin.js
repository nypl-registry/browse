/* global Image */

// This mixin provides basic image load monitoring
// Waits for isMounted() to fire.
// E.g.
//   this.loadImage(imageUrl, (img) => this.setState({myImageIsLoaded: true}), (url, err) => console.log('error loading: ', url, err))

var ImageLoadMixin = {
  loadImage: function (url, onLoad, onError) {
    var img = new Image()
    if (onLoad) {
      img.onload = (e) => {
        this.imageload_fireWhenMounted(() => onLoad(img, e))
      }
    }
    if (onError) {
      img.onerror = (e) => {
        this.imageload_fireWhenMounted(() => onError(url, e))
      }
    }
    img.src = url
  },

  // Fire given function when this.isMounted
  imageload_fireWhenMounted: function (onMounted) {
    var cb = (instance) => {
      if (!this.isMounted()) console.warn('waiting to fire ', onMounted)
      if (this.isMounted()) onMounted()
      else if (instance < 100) setTimeout(() => cb(instance + 1), 100 + instance * 100) // progressively reduce frequency as errors continue..
    }
    cb(0)
  }
}

export default ImageLoadMixin
