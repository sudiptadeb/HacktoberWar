import Vue from "vue"; //NO I18N
import router from "./router"; //NO I18N
import "./registerServiceWorker"; //NO I18N
import Buefy from 'buefy';
import App from "./App.vue"; //NO I18N
import VueSidebarMenu from "vue-sidebar-menu"; //NO I18N
import axios from "axios"; //NO I18N
import "line-awesome"; //NO I18N

Vue.config.productionTip = false;

Vue.use(Buefy, {defaultIconPack: "fa"}); //NO I18N
Vue.use(VueSidebarMenu);


// Register a global custom directive called `v-shref`
// It secures href by whitelisting only http and https and preventing Referer header among others.
// Usage: Instead of href, use v-shref. It will append secured href and other attributes to the element.
Vue.directive('shref', function (el, binding) { //No I18N
    let url;
    try {
        url = new URL(binding.value);
    } catch (e) {
        url = new URL('unsafe:' + binding.value); //NO I18N
    }
    if (url.protocol === "ht" + "tps:" || url.protocol === "ht" + "tp:") {  //NO I18N
        el.href = url.href;
    } else {
        el.removeAttribute("href");  //NO I18N
    }
    el.target = "_blank";  //NO I18N
    el.referrerpolicy = "no-referrer"; //No I18N
    el.referrerPolicy = "no-referrer"; //No I18N
    el.rel = "no-referrer no-openner nofollow";  //NO I18N
});


let vue = new Vue({
    el: "#app", //No I18N
    router,
    render: h => h(App)
});

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    vue.$buefy.snackbar.open({
        message: 'Error while sending request to server',  //NO I18N
        type: 'is-danger',  //NO I18N
        position: 'is-top'  //NO I18N
    });
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    vue.$buefy.snackbar.open({
        message: error.message,
        type: 'is-danger',  //NO I18N
        position: 'is-top-right',  //NO I18N
        queue: false,
        duration: 1500
    });
    return Promise.reject(error);
});


