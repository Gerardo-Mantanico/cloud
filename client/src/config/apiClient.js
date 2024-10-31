import { feathers } from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import authentication from "@feathersjs/authentication-client";

const STORAGE_KEY = "feathers-jwt";
const options = {
  storageKey: STORAGE_KEY,
  storage: window.localStorage,
};
export const app = feathers();

const restClient = rest("http://localhost:3002/").fetch(
  window.fetch.bind(window),
  {
    headers: {
      Authorization: window.localStorage.getItem(STORAGE_KEY), //token de acceso
    },
  },
);

// Configure an AJAX library (see below) with that client
app.configure(restClient);
app.configure(authentication(options));

app.use("file", restClient.service("file"), {
  methods: ["find", "get", "create", "update", "patch", "remove", "duplicate"],
});

app.use("directory", restClient.service("directory"), {
  methods: ["find", "get", "create", "update", "patch", "remove", "duplicate"],
});

export const directoryService = app.service("directory");
export const fileService = app.service("file");
export const userService = app.service("users");
