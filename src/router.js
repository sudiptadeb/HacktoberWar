import Vue from "vue"; //NO I18N
import Router from "vue-router";
import ScoreBoard from "./components/ScoreBoard";
import warmap from "./components/warmap";
import Rules from "@/components/Rules";
import Map from "@/components/Map";
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
            component: Rules,
            meta: {
                icon: "fa fa-question-circle" //NO I18N
            },
            name: "Rules & Guidelines", //NO I18N
            path: "/rules" //NO I18N

        },
        {
            component: Map,
            meta: {
                icon: "fa fa-map" //NO I18N
            },
            name: "Attack Map", //NO I18N
            path: "/map" //NO I18N

        },
        {
            component: warmap,
            meta: {
                icon: "fa fa-map" //NO I18N
            },
            name: "War Map", //NO I18N
            path: "/warmap" //NO I18N

        }
    ]
});
