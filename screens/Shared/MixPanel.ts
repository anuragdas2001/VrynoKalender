import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN || "", {
  debug: false,
  ignore_dnt: false,
  secure_cookie: true,
  // @ts-ignore - defination was not found in ts file at the time of implementation
  track_pageview: false,
});

let actions = {
  register: (props: Record<string, any>) => {
    mixpanel.register(props);
  },
  registerOnce: (props: Record<string, any>) => {
    mixpanel.register_once(props);
  },
  track: (name: string, props: Record<string, any>) => {
    mixpanel.track(name, props);
  },
  people: {
    set: (props: Record<string, any>) => {
      mixpanel.people.set(props);
    },
  },
  pageView: (pageName: string) => {
    // @ts-ignore - defination was not found in ts file at the time of implementation
    mixpanel.track_pageview({ page: pageName });
  },
  alias: (id: string) => {
    mixpanel.alias(id);
  },
  reset: () => {
    mixpanel.reset();
  },
  identify: (id: string) => {
    mixpanel.identify(id);
  },
};

// mixpanel.track_links("a", "Click Link", {
//   referrer: document.referrer,
// });

export let MixpanelActions = actions;
