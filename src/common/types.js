// @flow

// Algebraic types are composable, so it makes sense to have them at one place.
// blog.ploeh.dk/2016/11/28/easy-domain-modelling-with-types

// Core

export type Deps = {
  FBSDK: any,
  firebase: any,
  firebaseAuth: Function,
  firebaseDatabase: any,
  getState: () => Object,
  getUid: () => string,
  now: () => number,
  validate: (json: Object) => any,
};

// Models

export type Todo = {|
  completed: boolean,
  createdAt: number,
  id: string,
  title: string,
|};

export type User = {|
  displayName: string,
  email: ?string,
  id: string,
  photoURL: ?string,
|};

export type Venue = {
  key: number,
  title: string,
  description: string,
  facebookURL: string,
  address: string,
  latlng: {lattitude: number, longitude: number},
};

export type Event = {
  key: string,
  beginsAt: number,
  description: string,
  facebookEventURL: ?string,
  isFeatured: boolean,
  name: string,
  photoURL: ?string,
  residentAdvisorURL: ?string,
  venueKey: string,
}

export type Queue = {
  key: string,
  loggedAt: number,
  owner: User,
  value: number,
  venueKey: number,
}

// Reducers
// We can't use exact object type, because spread is not supported yet.
// We can't use Strict<T> = T & $Shape<T>, because it breaks autocomplete.
// TODO: Wait for Flow.

export type AppState = {
  baselineShown: boolean,
  currentTheme: string,
  error: ?Error,
  menuShown: boolean,
  online: boolean,
  started: boolean,
};

export type AuthState = {
  formDisabled: boolean,
  error: ?Error,
};

export type ConfigState = {
  appName: string,
  appVersion: string,
  firebase: ?Object,
  sentryUrl: string,
};

export type DeviceState = {
  host: string,
  isReactNative: boolean,
  platform: string,
};

export type IntlState = {
  currentLocale: ?string,
  defaultLocale: ?string,
  initialNow: ?number,
  locales: ?Array<string>,
  messages: ?Object,
};

export type TodosState = {
  all: { [id: string]: Todo },
};

export type UsersState = {
  online: ?Array<User>,
  viewer: ?User,
};

export type AdminState = {
  isAdmin: boolean,
  activeEntry: ?number,
};

export type VenuesState = {
  venueList: Array<Venue>,
  venuesLoaded: boolean,
}

export type EventsState = {
  eventList: ?Array<Event>,
  eventsLoaded: boolean,
};

export type GuidesState = {
  guideDate: ?number,
  guideVenue: ?number,
  guideEvent: ?string,
};

export type QueuesState = {
  queueMap: {[venueKey: string]: Array<Queue>},
  queuesLoaded: boolean,
}

// State

export type State = {
  app: AppState,
  auth: AuthState,
  config: ConfigState,
  device: DeviceState,
  fields: any,
  intl: IntlState,
  todos: TodosState,
  users: UsersState,
  admin: AdminState,
  events: EventsState,
  queues: QueuesState,
  venues: VenuesState,
  guides: GuidesState,
};

// Actions

export type Action =
  { type: 'APP_ERROR', payload: { error: Error } }
  | { type: 'ADD_HUNDRED_TODOS', payload: { todos: Array<Todo> } }
  | { type: 'ADD_TODO', payload: { todo: Todo } }
  | { type: 'APP_ONLINE', payload: { online: boolean } }
  | { type: 'APP_SHOW_MENU', payload: { menuShown: boolean } }
  | { type: 'APP_START' }
  | { type: 'APP_STARTED' }
  | { type: 'APP_STOP' }
  | { type: 'CLEAR_ALL_COMPLETED_TODOS' }
  | { type: 'CLEAR_ALL_TODOS' }
  | { type: 'DELETE_TODO', payload: { id: string } }
  | { type: 'ON_AUTH', payload: { firebaseUser: ?Object } }
  | { type: 'ON_USERS_PRESENCE', payload: { presence: Object } }
  | { type: 'RESET_PASSWORD', payload: { email: string } }
  | { type: 'SAVE_USER_DONE' }
  | { type: 'SET_CURRENT_LOCALE', payload: { locale: string } }
  | { type: 'SET_THEME', payload: { theme: string } }
  | { type: 'SIGN_IN', payload: { providerName: string, options?: Object } }
  | { type: 'SIGN_IN_DONE', payload: { user: ?User } }
  | { type: 'SIGN_IN_FAIL', payload: { error: Error } }
  | { type: 'SIGN_OUT' }
  | { type: 'SIGN_UP', payload: { providerName: string, options?: Object } }
  | { type: 'SIGN_UP_DONE', payload: { user: ?User } }
  | { type: 'SIGN_UP_FAIL', payload: { error: Error } }
  | { type: 'TOGGLE_TODO_COMPLETED', payload: { todo: Todo } }
  | { type: 'GET_ALL_EVENTS', payload: { events: Object } }
  | { type: 'SAVE_EVENT', payload: {
    event: Event,
    eventKey: string,
    fields: ?Object,
  } }
  | { type: 'SAVE_EVENT_DONE' }
  | { type: 'DELETE_EVENT', payload: { eventKey: string } }
  | { type: 'DELETE_EVENT_DONE' }
  | { type: 'REPORT_EVENT_LINK_CLICK', payload: { linkType: string } }
  | { type: 'ADMIN_CHECK', payload: { user: ?User } }
  | { type: 'ADMIN_CHECK_DONE' }
  | { type: 'ADMIN_CHECK_FAIL', payload: { error: string } }
  | { type: 'ADD_QUEUE_ENTRY', payload: {
    activeEntry: number,
    queueData: Queue,
    owner: Object,
  } }
  | { type: 'ADD_QUEUE_ENTRY_DONE' }
  | { type: 'SET_ACTIVE_ENTRY', payload: { venueKey: number } }
  | { type: 'CHECK_ALL_QUEUES', payload: { snap: Object } }
  | { type: 'DELETE_QUEUE_ENTRY', payload: { key: string } }
  | { type: 'DELETE_QUEUE_ENTRY_DONE' }
  | { type: 'LIST_VENUES', payload: { venues: Object } }
  | { type: 'TOGGLE_BASELINE' }
  | { type: 'SET_GUIDE_VENUE', payload: { venueKey: number } }
  | { type: 'SET_GUIDE_EVENT', payload: { eventKey: string } }
  | { type: 'SET_GUIDE_DATE', payload: { guideDate: number } };
