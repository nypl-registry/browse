export const agents = require('./agents')
export const resources = require('./resources')

// Navigation

export function transitionTo (path, params) {
  return (dispatch, getState) => {
    console.log('dispatching push: ', path, params)
    path = `${path}?${qs.stringify(params)}`
    dispatch(push(path))
  }
}
