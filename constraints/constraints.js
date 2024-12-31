import { Link, Calendar, Clock, Users } from "lucide-react";
const dashboardDetails = [
  {
    id: "0",
    name: "Event Types",
    instanceId: "I101",
    widgetDetails: [
      {
        id: "1001",
        fieldPermissionMessage: null,
        name: "abc",
        key: null, // Assuming `key` is `WidgetsView | string | null`
        widgetType: "abc",
        widgetMetadata: null, // Assuming it’s of type `BaseGenericObjectType | null`
        moduleViewId: ["1001"], // String array
        customView: [
          { key: "key" }, // Assuming `customView` is an array of `BaseGenericObjectType`
        ],
      },
    ],
    widgets: ["string1", "string2", "string3"], // String array
    url: "/event_types",
    icon: <Link />,
  },

  {
    id: "1",
    name: "Meetings",
    instanceId: "I102",
    widgetDetails: [
      {
        id: "1002",
        fieldPermissionMessage: null,
        name: "abc",
        key: null, // Assuming `key` is `WidgetsView | string | null`
        widgetType: "abc",
        widgetMetadata: null, // Assuming it’s of type `BaseGenericObjectType | null`
        moduleViewId: ["1001"], // String array
        customView: [
          { key: "key" }, // Assuming `customView` is an array of `BaseGenericObjectType`
        ],
      },
    ],
    widgets: ["string1", "string2", "string3"], // String array
    url: "/meetings/upcoming",
    icon: <Calendar />,
  },

  {
    id: "2",
    name: "Availability",
    instanceId: "I103",
    widgetDetails: [
      {
        id: "1003",
        fieldPermissionMessage: null,
        name: "abc",
        key: null, // Assuming `key` is `WidgetsView | string | null`
        widgetType: "abc",
        widgetMetadata: null, // Assuming it’s of type `BaseGenericObjectType | null`
        moduleViewId: ["1001"], // String array
        customView: [
          { key: "key" }, // Assuming `customView` is an array of `BaseGenericObjectType`
        ],
      },
    ],
    widgets: ["string1", "string2", "string3"], // String array
    url: "/availability",
    icon: <Clock />,
  },

  {
    id: "3",
    name: "Teams",
    instanceId: "I104",
    widgetDetails: [
      {
        id: "1004",
        fieldPermissionMessage: null,
        name: "abc",
        key: null, // Assuming `key` is `WidgetsView | string | null`
        widgetType: "abc",
        widgetMetadata: null, // Assuming it’s of type `BaseGenericObjectType | null`
        moduleViewId: ["1001"], // String array
        customView: [
          { key: "key" }, // Assuming `customView` is an array of `BaseGenericObjectType`
        ],
      },
    ],
    widgets: ["string1", "string2", "string3"], // String array
    url: "/teams",
    icon: <Users />,
  },

  // {
  //   id: '4',
  //   name: 'Apps',
  //   instanceId: 'I105',
  //   widgetDetails: [
  //     {
  //       id: '1005',
  //       fieldPermissionMessage: null,
  //       name: 'abc',
  //       key: null, // Assuming `key` is `WidgetsView | string | null`
  //       widgetType: 'abc',
  //       widgetMetadata: null, // Assuming it’s of type `BaseGenericObjectType | null`
  //       moduleViewId: ['1001'], // String array
  //       customView: [
  //         { key: 'key' }, // Assuming `customView` is an array of `BaseGenericObjectType`
  //       ],
  //     },
  //   ],
  //   widgets: ['string1', 'string2', 'string3'], // String array
  //   url:'/apps'
  // },

  // {
  //   id: '5',
  //   name: 'Routing',
  //   instanceId: 'I106',
  //   widgetDetails: [
  //     {
  //       id: '1006',
  //       fieldPermissionMessage: null,
  //       name: 'abc',
  //       key: null, // Assuming `key` is `WidgetsView | string | null`
  //       widgetType: 'abc',
  //       widgetMetadata: null, // Assuming it’s of type `BaseGenericObjectType | null`
  //       moduleViewId: ['1001'], // String array
  //       customView: [
  //         { key: 'key' }, // Assuming `customView` is an array of `BaseGenericObjectType`
  //       ],
  //     },
  //   ],
  //   widgets: ['string1', 'string2', 'string3'], // String array
  //   url:'/routing'
  // },

  // {
  //   id: '6',
  //   name: 'Workflows',
  //   instanceId: 'I107',
  //   widgetDetails: [
  //     {
  //       id: '1007',
  //       fieldPermissionMessage: null,
  //       name: 'abc',
  //       key: null, // Assuming `key` is `WidgetsView | string | null`
  //       widgetType: 'abc',
  //       widgetMetadata: null, // Assuming it’s of type `BaseGenericObjectType | null`
  //       moduleViewId: ['1001'], // String array
  //       customView: [
  //         { key: 'key' }, // Assuming `customView` is an array of `BaseGenericObjectType`
  //       ],
  //     },
  //   ],
  //   widgets: ['string1', 'string2', 'string3'], // String array
  //   url:'/workflows'
  // },

  // {
  //   id: '7',
  //   name: 'Analytics',
  //   instanceId: 'I108',
  //   widgetDetails: [
  //     {
  //       id: '1008',
  //       fieldPermissionMessage: null,
  //       name: 'abc',
  //       key: null, // Assuming `key` is `WidgetsView | string | null`
  //       widgetType: 'abc',
  //       widgetMetadata: null, // Assuming it’s of type `BaseGenericObjectType | null`
  //       moduleViewId: ['1001'], // String array
  //       customView: [
  //         { key: 'key' }, // Assuming `customView` is an array of `BaseGenericObjectType`
  //       ],
  //     },
  //   ],
  //   widgets: ['string1', 'string2', 'string3'], // String array
  //   url:'/analytics'
  // },
];

export default dashboardDetails;
