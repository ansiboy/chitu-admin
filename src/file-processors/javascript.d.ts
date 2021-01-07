import { ContentTransform, RequestContext, RequestResult } from "maishu-node-web-server";
export declare class JavascriptTransform implements ContentTransform {
    private commonjsToAmdMatchs;
    constructor(commonjsToAmdMatchs?: string[]);
    execute(result: RequestResult, context: RequestContext): Promise<RequestResult>;
    private getContentAsString;
}
