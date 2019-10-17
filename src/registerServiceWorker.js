/* eslint-disable no-console */

import { register } from "register-service-worker"; //NO I18N

if (process.env.NODE_ENV === "production") { //NO I18N
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" + //NO I18N
          "For more details, visit https://goo.gl/AFskqB" //NO I18N
      );
    },
    registered() {
      console.log("Service worker has been registered."); //NO I18N
    },
    cached() {
      console.log("Content has been cached for offline use."); //NO I18N
    },
    updatefound() {
      console.log("New content is downloading."); //NO I18N
    },
    updated() {
      console.log("New content is available; please refresh."); //NO I18N
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode." //NO I18N
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error); //NO I18N
    }
  });
}
