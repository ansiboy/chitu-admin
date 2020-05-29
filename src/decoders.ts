import { createParameterDecorator } from "maishu-node-mvc";

export let currentAppId = createParameterDecorator(async (req, res, context, routeData) => {
    let name = "application-id";
    let appId = req.headers[name] || routeData[name];
    return appId;
});

export let currentUserId = createParameterDecorator(async (req, res, context, routeData) => {
    let name = "user-id";
    let appId = req.headers[name] || routeData[name];
    return appId;
});