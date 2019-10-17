import Vue from "vue"; //NO I18N
import Router from "vue-router";
import ScoreBoard from "./components/ScoreBoard";
import Feeds from "./components/Feeds";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/", //NO I18N
            redirect: "/scoreboard" //NO I18N
        },
        {
            component: ScoreBoard,
            meta: {
                icon: "fa fa-code" //NO I18N
            },
            name: "Score Board", //NO I18N
            path: "/scoreboard" //NO I18N

        },
        {
            component: Feeds,
            meta: {
                icon: "fa fa-code" //NO I18N
            },
            name: "Score Board", //NO I18N
            path: "/feeds" //NO I18N

        }
    ]
});
