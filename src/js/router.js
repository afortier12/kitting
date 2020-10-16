const KittingView = httpVueLoader('./views/kitting.vue');
const DetailView = httpVueLoader('./views/detail.vue');
const NotFound = httpVueLoader('./views/NotFound.vue');

export default {
    routes: [
        {
            path: '/',
            name: 'index',
            components: {
                default: KittingView,
            },
        },
        {
            path: '/kit',
            name: 'kit_details',
            components: {
                default: DetailView,
            },
            props: true,
            
        },
        {
            path: "/:catchAll(.*)",
            component: NotFound,
        },
    ],
};