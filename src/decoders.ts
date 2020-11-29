import { createParameterDecorator } from "maishu-node-web-server-mvc";

export let currentAppId = createParameterDecorator(async (context, routeData) => {
    let name = "application-id";
    let appId = context.req.headers[name] || routeData[name];
    return appId;
});

export let currentUserId = createParameterDecorator(async (context, routeData) => {
    let name = "user-id";
    let appId = context.req.headers[name] || routeData[name];
    return appId;
});