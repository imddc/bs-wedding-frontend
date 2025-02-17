import request from '~/plugins/http'

enum ActivityApi {
  Activities = '/activities',
}

export function getActivities() {
  return request.get(ActivityApi.Activities)
}
