import { Resource } from "entities";

export let errors = {
    unknonwResourceName(resourceName: string) {
        let msg = `Resource name '${resourceName}' is unknown.`
        return new Error(msg)
    },
    resourceDataFieldMissing(resource: Resource, fieldName: Extract<keyof Resource["data"], string>) {
        let msg = `Resource data field '${fieldName}' is missing, resource id is ${resource.id}.`;
        return new Error(msg);
    },
    buttonExecutePahtIsEmpty(resource: Resource) {
        let msg = `The execute_path of resource '${resource.id}' is empty.`;
        return new Error(msg);
    },
    executePathIncorrect(executePath: string) {
        let msg = `Execute path '${executePath}' is incorrect.`;
        return new Error(msg);
    },
    contextMemberIsNotExist(memberName: string) {
        let msg = `Context member '${memberName}' is not exists.`;
        return new Error(msg);
    },
    contextMemberIsNotFunction(memberName: string) {
        let msg = `Context member '${memberName}' is not a function.`;
        return new Error(msg);
    }
}